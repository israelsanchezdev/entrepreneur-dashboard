// src/pages/AddEntrepreneur.jsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export default function AddEntrepreneur() {
  const navigate = useNavigate();

  // 1) map display names → actual email addresses
  const resourcePartners = [
    { name: 'Go Topeka',                email: 'info@gotopeka.org'           },
    { name: 'KS Department of Commerce',email: 'contact@kscommerce.gov'      },
    { name: 'Network Kansas',           email: 'hello@networkkansas.org'     },
    { name: 'Omni Circle',              email: 'team@omnicircle.org'          },
    { name: 'Shawnee Startups',         email: 'support@shawneestartups.com'  },
    { name: 'Washburn SBDC',            email: 'sbdc@washburn.edu'            },
  ];

  const [formData, setFormData] = useState({
    name: '',
    business: '',
    type: '',
    date: '',
    referred: '',
    partnerEmail: '',    // ← added
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
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRegister = async e => {
    e.preventDefault();
    setErrorMsg('');

    // 2) find partner object by its name
    const partnerObj = resourcePartners.find(p => p.name === formData.referred);
    const payload = { ...formData, partnerEmail: partnerObj?.email || '' };

    // 3) signup w/ Supabase Auth
    const token = uuidv4();
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,      // if you collect email field
      password: formData.password // if you collect password field
    });
    if (authError) {
      setErrorMsg(authError.message);
      return;
    }

    // 4) insert row into entrepreneurs table
    const { error: insertError } = await supabase
      .from('entrepreneurs')
      .insert([
        {
          name:       formData.name,
          business:   formData.business,
          type:       formData.type,
          date:       formData.date,
          referred:   formData.referred,
          initials:   formData.initials,
          confirmed:  formData.confirmed,
          notes:      formData.notes,
          stage:      formData.stage,
          user_id:    authData.user.id, // ensure RLS policy allows this
        }
      ]);
    if (insertError) {
      setErrorMsg(insertError.message);
      return;
    }

    // 5) send confirmation email to the user
    await fetch('/.netlify/functions/send-confirmation-email', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email: authData.user.email, token })
    });

    // 6) notify the partner by **actual** email address
    await fetch('/.netlify/functions/send-partner-notification', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        to:           payload.partnerEmail,      // ← the real email
        name:         payload.referred,          // partner display name
        entrepreneur: payload.name,
        business:     payload.business,
        date:         payload.date,
        initials:     payload.initials,
        notes:        payload.notes,
        stage:        payload.stage
      })
    });

    // 7) finish up
    alert('Entrepreneur added! Confirmation email sent; partner notified.');
    navigate('/entrepreneurs');
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow space-y-4">
      <h2 className="text-2xl font-bold">Add New Entrepreneur</h2>
      {errorMsg && <p className="text-red-600">{errorMsg}</p>}

      <form onSubmit={handleRegister} className="space-y-4">
        {/* Entrepreneur Name */}
        <input
          name="name"
          placeholder="Entrepreneur Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded text-black"
        />

        {/* Business Name */}
        <input
          name="business"
          placeholder="Business Name"
          value={formData.business}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded text-black"
        />

        {/* Business Type */}
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

        {/* Date Contacted */}
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 border rounded text-black"
        />

        {/* Referred To (partner) */}
        <select
          name="referred"
          value={formData.referred}
          onChange={e => {
            const name = e.target.value;
            const partner = resourcePartners.find(p => p.name === name);
            setFormData(prev => ({
              ...prev,
              referred:     name,
              partnerEmail: partner?.email || ''
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

        {/* Partner Confirmed */}
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
          <label className="block mb-1 text-black font-semibold">Stage</label>
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
