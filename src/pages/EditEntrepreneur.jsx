import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function EditEntrepreneur() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State keys must exactly match your Supabase column names.
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

  // Fetch existing entrepreneur record on mount.
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
      } else if (data) {
        // Format the date if necessary (assuming ISO string needed for HTML date input)
        const formattedData = {
          ...data,
          date: data.date ? data.date.slice(0, 10) : '',
        };
        setFormData(formattedData);
      }
    };

    fetchEntrepreneur();
  }, [id]);

  // Handle form input changes.
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Update entrepreneur record in Supabase on form submit.
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Submitting update:', formData); // Debug log

    const { error } = await supabase
      .from('entrepreneurs')
      .update(formData)
      .eq('id', id);

    if (error) {
      console.error('Update error:', error.message);
      alert(`Update failed: ${error.message}`);
    } else {
      alert('Record updated successfully!');
      navigate('/entrepreneurs');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Entrepreneur</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded text-black"
        />

        {/* Business Name */}
        <input
          name="business"
          placeholder="Business Name"
          value={formData.business}
          onChange={handleChange}
          className="w-full p-2 border rounded text-black"
        />

        {/* Business Type */}
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

        {/* Date */}
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 border rounded text-black"
        />

        {/* Referred To */}
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

        {/* Initials */}
        <input
          name="initials"
          placeholder="Initials"
          value={formData.initials}
          onChange={handleChange}
          className="w-full p-2 border rounded text-black"
        />

        {/* Notes Field (was missing before) */}
        <textarea
          name="notes"
          placeholder="Notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full p-2 border rounded text-black"
          rows="4"
        />

        {/* Partner Confirmed Checkbox with readable label */}
        <label className="flex items-center space-x-2 text-gray-800">
          <input
            type="checkbox"
            name="confirmed"
            checked={formData.confirmed}
            onChange={handleChange}
            className="form-checkbox h-5 w-5"
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
