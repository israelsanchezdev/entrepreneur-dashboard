// src/pages/AddEntrepreneur.jsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

// 1) Your partner name → email mapping
const resourcePartners = [
  { name: 'Go Topeka',                 email: 'israelsanchezofficial@gmail.com'          },
  { name: 'KS Department of Commerce', email: 'contact@kscommerce.gov'    },
  { name: 'Network Kansas',            email: 'hello@networkkansas.org'    },
  { name: 'Omni Circle',               email: 'team@omnicircle.org'         },
  { name: 'Shawnee Startups',          email: 'support@shawneestartups.com' },
  { name: 'Washburn SBDC',             email: 'sbdc@washburn.edu'           },
];

export default function AddEntrepreneur() {
  const navigate = useNavigate();
  const user = supabase.auth.user(); // v1 syntax; if you're on v2 use supabase.auth.getUser()

  const [formData, setFormData] = useState({
    name: '',
    business: '',
    type: '',
    date: '',
    referred: '',
    partnerEmail: '',
    initials: '',
    confirmed: false,
    notes: '',
    stage: 'Ideation',
  });
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErrorMsg('');

    // 2) Must be signed in
    if (!user) {
      setErrorMsg('You must be logged in to add an entrepreneur.');
      return;
    }

    // 3) Lookup partnerEmail by referred name
    const partnerObj = resourcePartners.find(p => p.name === formData.referred);
    const partnerEmail = partnerObj?.email || '';

    // 4) Insert into entrepreneurs
    const { error: insertError } = await supabase
      .from('entrepreneurs')
      .insert([
        {
          name:      formData.name,
          business:  formData.business,
          type:      formData.type,
          date:      formData.date,
          referred:  formData.referred,
          initials:  formData.initials,
          confirmed: formData.confirmed,
          notes:     formData.notes,
          stage:     formData.stage,
          user_id:   user.id,
        },
      ]);

    if (insertError) {
      setErrorMsg(insertError.message);
      return;
    }

    // 5) Notify the partner
    await fetch('/.netlify/functions/send-partner-notification', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to:           partnerEmail,
        name:         formData.referred,
        entrepreneur: formData.name,
        business:     formData.business,
        date:         formData.date,
        initials:     formData.initials,
        notes:        formData.notes,
        stage:        formData.stage,
      }),
    });

    alert('Entrepreneur added — partner notified!');
    navigate('/entrepreneurs');
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow space-y-4">
      <h2 className="text-2xl font-bold">Add New Entrepreneur</h2>
      {errorMsg && <p className="text-red-600">{errorMsg}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <input
          name="name"
          placeholder="Entrepreneur Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded text-black"
        />

        {/* Business */}
        <input
          name="business"
          placeholder="Business Name"
          value={formData.business}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded text-black"
        />

        {/* Type */}
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded text-black"
        >
          <option value="">Select Business Type</option>
          <option value="Ideation">Ideation</option>
          <option value="Planning">Planning</option>
          <option value="Launch">Launch</option>
          <option value="Funding">Funding</option>
        </select>

        {/* Date */}
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 border rounded text-black"
        />

        {/* Partner */}
        <select
          name="referred"
          value={formData.referred}
          onChange={e => {
            const name = e.target.value;
            const partner = resourcePartners.find(p => p.name === name);
            setFormData(prev => ({
              ...prev,
              referred:     name,
              partnerEmail: partner?.email || '',
            }));
          }}
          required
          className="w-full p-2 border rounded text-black"
        >
          <option value="">Referred To</option>
          {resourcePartners.map(p => (
            <option key={p.name} value={p.name}>{p.name}</option>
          ))}
        </select>

        {/* Initials */}
        <input
          name="initials"
          placeholder="Your Initials"
          value={formData.initials}
          onChange={handleChange}
          className="w-full p-2 border rounded text-black"
        />

        {/* Confirmed */}
        <label className="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            name="confirmed"
            checked={formData.confirmed}
            onChange={handleChange}
            className="form-checkbox"
          />
          <span className="text-black">Partner Confirmed</span>
        </label>

        {/* Notes */}
        <textarea
          name="notes"
          placeholder="Notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full p-2 border rounded text-black"
          rows={4}
        />

        {/* Stage */}
        <div>
          <label className="block mb-1 font-semibold text-black">Stage</label>
          <select
            name="stage"
            value={formData.stage}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded text-black"
          >
            <option value="Ideation">Ideation</option>
            <option value="Planning">Planning</option>
            <option value="Launch">Launch</option>
            <option value="Funding">Funding</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Entrepreneur
        </button>
      </form>
    </div>
  );
}
