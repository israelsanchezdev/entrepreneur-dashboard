
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaEdit } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const Entrepreneurs = () => {
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntrepreneurs = async () => {
      const { data, error } = await supabase.from('entrepreneurs').select('*');
      if (!error) setEntrepreneurs(data);
    };
    fetchEntrepreneurs();
  }, []);

  const filtered = entrepreneurs.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.business.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(entrepreneurs);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Entrepreneurs');
    XLSX.writeFile(wb, 'entrepreneurs.xlsx');
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this entrepreneur?')) {
      const { error } = await supabase.from('entrepreneurs').delete().eq('id', id);
      if (!error) {
        setEntrepreneurs(entrepreneurs.filter((e) => e.id !== id));
      }
    }
  };

  return (
    <div className="p-6 space-y-4">
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

      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded w-full md:w-1/3 text-black"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Search
        </button>
      </div>

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
  <a href={`/edit/${e.id}`}>{e.name}</a>
</td>
                <td className="p-2">{e.business}</td>
                <td className="p-2">
                  <span className="bg-blue-500 px-2 py-1 rounded text-sm text-white">
                    {e.type}
                  </span>
                </td>
                <td className="p-2">{new Date(e.date).toLocaleDateString()}</td>
                <td className="p-2">{e.referred}</td>
                <td className="p-2">{e.initials}</td>
                <td className="p-2">
  <input
    type="checkbox"
    checked={e.confirmed}
    onChange={async () => {
      const updated = { ...e, confirmed: !e.confirmed };
      const { error } = await supabase.from('entrepreneurs').update({ confirmed: updated.confirmed }).eq('id', e.id);
      if (!error) setEntrepreneurs(entrepreneurs.map(ent => ent.id === e.id ? updated : ent));
    }}
    className="form-checkbox h-5 w-5 text-blue-500"
  />
</td>
                <td className="p-2 flex space-x-2">
                  <button onClick={() => navigate('/edit/' + e.id)}>
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
