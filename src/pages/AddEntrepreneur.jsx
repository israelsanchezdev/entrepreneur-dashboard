
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../auth';

const AddEntrepreneur = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    business: '',
    type: '',
    date: '',
    referred: '',
    initials: '',
    confirmed: false,
    notes: ''
  });

  const resourcePartners = [
    'Go Topeka',
    'KS Department of Commerce',
    'Network Kansas',
    'Omni Circle',
    'Shawnee Startups',
    'Washburn SBDC'
  ];

  const businessTypes = ['Ideation', 'Startup', 'Established'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from('entrepreneurs').insert([
      {
        ...formData,
        user_id: user.id
      }
    ]);

    if (error) {
      alert('Failed to save entrepreneur');
    } else {
      navigate('/entrepreneurs');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Entrepreneur</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Entrepreneur Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 rounded text-black"
        />
        <input
          type="text"
          name="business"
          placeholder="Business Name"
          value={formData.business}
          onChange={handleChange}
          required
          className="w-full p-2 rounded text-black"
        />
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="w-full p-2 rounded text-black"
        >
          <option value="">Select Business Type</option>
          {businessTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="w-full p-2 rounded text-black"
        />
        <select
          name="referred"
          value={formData.referred}
          onChange={handleChange}
          required
          className="w-full p-2 rounded text-black"
        >
          <option value="">Referred To</option>
          {resourcePartners.map((partner) => (
            <option key={partner} value={partner}>{partner}</option>
          ))}
        </select>
        <input
          type="text"
          name="initials"
          placeholder="Initials"
          value={formData.initials}
          onChange={handleChange}
          required
          className="w-full p-2 rounded text-black"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="confirmed"
            checked={formData.confirmed}
            onChange={handleChange}
          />
          <span>Partner Confirmed</span>
        </label>
        <textarea
          name="notes"
          placeholder="Notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          className="w-full p-2 rounded text-black"
        />
        <button type="submit" className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">
          Save Entrepreneur
        </button>
      </form>
    </div>
  );
};

export default AddEntrepreneur;
