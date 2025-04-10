import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function EditEntrepreneur() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    business: '',
    type: '',
    date: '',
    referred: '',
    initials: '',
    notes: '',
    confirmed: false,
  });

  useEffect(() => {
    const fetchEntrepreneur = async () => {
      const { data, error } = await supabase
        .from('entrepreneurs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error loading entrepreneur:', error.message);
        alert('Failed to load entrepreneur.');
      } else {
        setFormData(data);
      }
    };

    fetchEntrepreneur();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Submitting:', formData); // helpful debug
    const { data, error } = await supabase
      .from('entrepreneurs')
      .update(formData)
      .eq('id', id);

    if (error) {
      console.error('Supabase update error:', error.message);
      alert(`Update failed: ${error.message}`);
    } else {
      console.log('Update successful:', data);
      navigate('/entrepreneurs');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Entrepreneur</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded text-black"
        />
        <input
          name="business"
          placeholder="Business"
          value={formData.business}
          onChange={handleChange}
          className="w-full p-2 border rounded text-black"
        />
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full p-2 border rounded text-black"
        >
          <option value="">Select Business Type</option>
          <option value="Ideation">Ideation</option>
          <option value="Startup">Startup</option>
          <option value="Established">Established</option>
        </select>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 border rounded text-black"
        />
        <select
          name="referred"
          value={formData.referred}
          onChange={handleChange}
          className="w-full p-2 border rounded text-black"
        >
          <option value="">Referred To</option>
          <option value="Go Topeka">Go Topeka</option>
          <option value="KS Department of Commerce">KS Department of Commerce</option>
          <option value="Network Kansas">Network Kansas</option>
          <option value="Omni Circle">Omni Circle</option>
          <option value="Shawnee Startups">Shawnee Startups</option>
          <option value="Washburn SBDC">Washburn SBDC</option>
        </select>
        <input
          name="initials"
          placeholder="Initials"
          value={formData.initials}
          onChange={handleChange}
          className="w-full p-2 border rounded text-black"
        />
        <textarea
          name="notes"
          placeholder="Notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full p-2 border rounded text-black"
          rows="4"
        />
        <label className="flex items-center space-x-2 text-gray-800">
          <input
            type="checkbox"
            name="confirmed"
            checked={formData.confirmed}
            onChange={handleChange}
          />
          <span>Partner Confirmed</span>
        </label>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save
        </button>
      </form>
    </div>
  );
}
