import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const Entrepreneurs = () => {
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Fetch entrepreneurs on component mount
  useEffect(() => {
    const fetchEntrepreneurs = async () => {
      const { data, error } = await supabase.from('entrepreneurs').select('*');
      if (error) {
        console.error('Error fetching entrepreneurs:', error.message);
      } else {
        setEntrepreneurs(data);
      }
    };
    fetchEntrepreneurs();
  }, []);

  // Live filter entrepreneurs by name or business
  const filtered = entrepreneurs.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.business.toLowerCase().includes(search.toLowerCase())
  );

  // Export data to Excel
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(entrepreneurs);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Entrepreneurs');
    XLSX.writeFile(wb, 'entrepreneurs.xlsx');
  };

  // Delete an entrepreneur record
  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this entrepreneur?')) {
      try {
        console.log('Attempting to delete entrepreneur with ID:', id);
        
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          alert('Please log in to delete entrepreneurs');
          return;
        }

        if (!session) {
          console.error('No active session found');
          alert('Please log in to delete entrepreneurs');
          return;
        }

        console.log('User session found, proceeding with delete...');
        
        const { error } = await supabase
          .from('entrepreneurs')
          .delete()
          .eq('id', id)
          .select();

        if (error) {
          console.error('Delete error:', error);
          alert(`Failed to delete entrepreneur: ${error.message}`);
          return;
        }

        console.log('Successfully deleted entrepreneur. Refreshing list...');
        
        // Refresh the entrepreneurs list
        const { data, error: fetchError } = await supabase
          .from('entrepreneurs')
          .select('*');
        
        if (fetchError) {
          console.error('Error fetching updated list:', fetchError);
          alert('Entrepreneur deleted but failed to refresh the list');
        } else {
          console.log('Successfully refreshed entrepreneurs list');
          setEntrepreneurs(data);
          alert('Entrepreneur deleted successfully');
        }
      } catch (err) {
        console.error('Error in delete operation:', err);
        alert('An error occurred while deleting the entrepreneur');
      }
    }
  };

  // Toggle the "Partner Confirmed" status
  const toggleConfirmed = async (ent) => {
    const updated = { ...ent, confirmed: !ent.confirmed };
    const { error } = await supabase
      .from('entrepreneurs')
      .update({ confirmed: updated.confirmed })
      .eq('id', ent.id);
    if (error) {
      console.error('Error updating confirmed:', error.message);
    } else {
      setEntrepreneurs(entrepreneurs.map(e => e.id === ent.id ? updated : e));
    }
  };

  return (
    <div className="p-6 space-y-4">
      {/* Header and buttons */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Entrepreneurs</h2>
          <p className="text-sm text-gray-400">Manage your entrepreneur database</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleExport}
            className="bg-black text-white px-4 py-2 rounded shadow hover:bg-gray-800"
          >
            ⬇ Export
          </button>
          <button
            onClick={() => navigate('/add')}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
          >
            ➕ Add New
          </button>
        </div>
      </div>

      {/* Search input */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded w-full md:w-1/3 text-black"
        />
      </div>

      {/* Entrepreneurs table */}
      <div className="overflow-auto rounded border border-gray-700 mt-4">
        <table className="min-w-full bg-gray-800 text-white text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-2">Entrepreneur Name</th>
              <th className="p-2">Business Name</th>
              <th className="p-2">Business Type</th>
              <th className="p-2">Date Contacted</th>
              <th className="p-2">Referred To</th>
              <th className="p-2">Initials</th>
              <th className="p-2">Partner Confirmed</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id} className="border-t border-gray-700">
                <td className="p-2 text-blue-400 hover:underline cursor-pointer">
                  <Link to={`/edit/${e.id}`}>{e.name}</Link>
                </td>
                <td className="p-2">{e.business}</td>
                <td className="p-2">
                  <span className="bg-blue-500 px-2 py-1 rounded text-sm text-white">{e.type}</span>
                </td>
                <td className="p-2">{new Date(e.date).toLocaleDateString()}</td>
                <td className="p-2">{e.referred}</td>
                <td className="p-2">{e.initials}</td>
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={e.confirmed}
                    onChange={() => toggleConfirmed(e)}
                    className="form-checkbox h-5 w-5 text-blue-500"
                  />
                </td>
                <td className="p-2 flex space-x-2">
                  <button onClick={() => navigate(`/edit/${e.id}`)}>
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(e.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Entrepreneurs;
