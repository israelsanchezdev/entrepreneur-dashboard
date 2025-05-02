import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const STAGES = ['Ideation', 'Planning', 'Launch', 'Funding'];

export default function AddEntrepreneur() {
  const [formData, setFormData] = useState({
    name: '',
    business: '',
    type: '',
    date: '',
    referred: '',
    initials: '',
    notes: '',
    confirmed: false,
    stage: '',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleStageSelect = (stage) => {
    setFormData((prev) => ({
      ...prev,
      stage,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = supabase.auth.getUser();
    const {
      data: { user: currentUser },
    } = await user;

    if (!currentUser) {
      setErrorMsg('User not authenticated');
      return;
    }

    const { data, error } = await supabase.from('entrepreneurs').insert([
      {
        ...formData,
        user_id: currentUser.id,
      },
    ]);

    if (error) {
      console.error('Insert error:', error.message);
      setErrorMsg('Failed to add entrepreneur.');
    } else {
      alert('Entrepreneur added successfully!');
      navigate('/entrepreneurs');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Entrepreneur</h2>
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
          placeholder="Business Name"
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
        <label className="flex items-center space-x-2 text-black">
          <input
            type="checkbox"
            name="confirmed"
            checked={formData.confirmed}
            onChange={handleChange}
            className="form-checkbox h-5 w-5 text-blue-500"
          />
          <span>Partner Confirmed</span>
        </label>

        {/* Stage Buttons */}
        <div className="space-y-1">
          <label className="block font-semibold text-black">Stage</label>
          <div className="flex gap-2 flex-wrap">
            {STAGES.map((stage) => (
              <button
                type="button"
                key={stage}
                onClick={() => handleStageSelect(stage)}
                className={`px-3 py-1 rounded text-sm font-medium transition ${
                  formData.stage === stage
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>

        {errorMsg && <p className="text-red-500">{errorMsg}</p>}
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
