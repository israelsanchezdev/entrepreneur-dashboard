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
    stage: '',
  });

  const stages = ['Ideation', 'Planning', 'Launch', 'Funding'];

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
        const formatted = {
          ...data,
          date: data.date ? data.date.slice(0, 10) : '',
        };
        setFormData(formatted);
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

  const handleStageSelect = (stage) => {
    setFormData((prev) => ({ ...prev, stage }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from('entrepreneurs')
      .update(formData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Update error:', error.message);
      alert(`Update failed: ${error.message}`);
    } else if (!data || data.length === 0) {
      console.error('No rows updated.');
      alert('Update did not affect any records.');
    } else {
      alert('Record updated successfully!');
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

        {/* Partner Confirmed Checkbox */}
        <label className="flex items-center space-x-2 text-white">
          <input
            type="checkbox"
            name="confirmed"
            checked={formData.confirmed}
            onChange={handleChange}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span>Partner Confirmed</span>
        </label>

        {/* Stage Progress Buttons */}
        <div className="space-y-2">
          <h3 className="font-semibold text-white">Business Stage</h3>
          <div className="flex flex-wrap gap-2">
            {stages.map((stage) => (
              <button
                key={stage}
                type="button"
                className={`px-3 py-1 rounded-full text-sm font-medium border 
                  ${formData.stage === stage
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-600 text-gray-200 hover:bg-gray-500'}`}
                onClick={() => handleStageSelect(stage)}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>

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
