// src/pages/AddEntrepreneur.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../auth';

// Partner name → actual email address map
const RESOURCE_PARTNERS = [
  { name: 'Go Topeka',                 email: 'foundertrackertest@gmail.com'  },
  { name: 'KS Department of Commerce', email: 'contact@kscommerce.gov'    },
  { name: 'Network Kansas',            email: 'hello@networkkansas.org'    },
  { name: 'Omni Circle',               email: 'team@omnicircle.org'         },
  { name: 'Shawnee Startups',          email: 'support@shawneestartups.com' },
  { name: 'Washburn SBDC',             email: 'sbdc@washburn.edu'           },
];

export default function AddEntrepreneur() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name:       '',
    business:   '',
    type:       '',
    date:       '',
    referred:   '',
    initials:   '',
    confirmed:  false,
    notes:      '',
    stage:      'Ideation',
  });
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!user) {
      setErrorMsg('You must be logged in to add an entrepreneur.');
      return;
    }

    // Find the partner email from your map
    const partnerObj   = RESOURCE_PARTNERS.find((p) => p.name === formData.referred);
    const partnerEmail = partnerObj?.email || '';

    // 1) Insert into Supabase
    const { error: insertError } = await supabase
      .from('entrepreneurs')
      .insert([{
        name:       formData.name,
        business:   formData.business,
        type:       formData.type,
        date:       formData.date || null,
        referred:   formData.referred,
        initials:   formData.initials,
        confirmed:  formData.confirmed,
        notes:      formData.notes,
        stage:      formData.stage,
        user_id:    user.id,
      }]);

    if (insertError) {
      console.error('Insert error:', insertError);
      setErrorMsg(insertError.message);
      return;
    }

    // 2) Notify partner via Netlify function
    try {
      const res = await fetch('/.netlify/functions/send-partner-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to:           partnerEmail,
          partner:      formData.referred,     // <-- now matches the function’s expectation
          entrepreneur: formData.name,
          business:     formData.business,
          date:         formData.date,
          initials:     formData.initials,
          notes:        formData.notes,
          stage:        formData.stage,
        }),
      });
      if (!res.ok) {
        console.error('Partner notification failed:', await res.text());
      }
    } catch (err) {
      console.error('Partner notification error:', err);
    }

    // 3) Finally, go back to list
    navigate('/entrepreneurs');
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white dark:bg-gray-800 rounded shadow space-y-4">
      <h2 className="text-2xl font-bold text-black dark:text-white">Add New Entrepreneur</h2>
      {errorMsg && <p className="text-red-600">{errorMsg}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name"       placeholder="Entrepreneur Name"     value={formData.name}       onChange={handleChange} required className="w-full p-2 border rounded text-black" />
        <input name="business"   placeholder="Business Name"          value={formData.business}   onChange={handleChange} required className="w-full p-2 border rounded text-black" />
        <select name="type"      value={formData.type}           onChange={handleChange} required className="w-full p-2 border rounded text-black">
          <option value="">Select Business Type</option>
          <option value="Ideation">Ideation</option>
          <option value="Planning">Planning</option>
          <option value="Launch">Launch</option>
          <option value="Funding">Funding</option>
        </select>
        <input type="date" name="date"     value={formData.date}        onChange={handleChange} className="w-full p-2 border rounded text-black" />
        <select name="referred" value={formData.referred}      onChange={handleChange} required className="w-full p-2 border rounded text-black">
          <option value="">Referred To</option>
          {RESOURCE_PARTNERS.map((p) => (
            <option key={p.name} value={p.name}>{p.name}</option>
          ))}
        </select>
        <input name="initials"   placeholder="Your Initials"          value={formData.initials}   onChange={handleChange} className="w-full p-2 border rounded text-black" />
        <label className="inline-flex items-center space-x-2 text-black dark:text-white">
          <input type="checkbox" name="confirmed" checked={formData.confirmed} onChange={handleChange} className="form-checkbox" />
          <span>Partner Confirmed</span>
        </label>
        <textarea name="notes"   placeholder="Notes"                   value={formData.notes}      onChange={handleChange} className="w-full p-2 border rounded text-black" rows={4} />
        <div>
          <label className="block mb-1 font-semibold text-black dark:text-white">Stage</label>
          <select name="stage"    value={formData.stage}          onChange={handleChange} required className="w-full p-2 border rounded text-black">
            <option value="Ideation">Ideation</option>
            <option value="Planning">Planning</option>
            <option value="Launch">Launch</option>
            <option value="Funding">Funding</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
          Add Entrepreneur
        </button>
      </form>
    </div>
  );
}
