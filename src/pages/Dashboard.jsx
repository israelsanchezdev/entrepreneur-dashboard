// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Bar, Pie } from 'react-chartjs-2';
import ProgressBar from '../components/ProgressBar'; 
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  TimeScale,
  PointElement,
  LineElement
} from 'chart.js';

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  TimeScale,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const [entrepreneurs, setEntrepreneurs] = useState([]);

  useEffect(() => {
    const fetchEntrepreneurs = async () => {
      const { data, error } = await supabase.from('entrepreneurs').select('*');
      if (!error) setEntrepreneurs(data);
    };
    fetchEntrepreneurs();
  }, []);

  // total ever
  const totalEntrepreneurs = entrepreneurs.length;

  // total this calendar month
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthCount = entrepreneurs.filter(e => {
    const d = new Date(e.created_at);
    return !isNaN(d) && d >= monthStart;
  }).length;

  // business type distribution
  const businessTypes = { Startup: 0, Established: 0, Ideation: 0 };
  entrepreneurs.forEach(e => {
    if (e.type && businessTypes.hasOwnProperty(e.type)) {
      businessTypes[e.type]++;
    }
  });
  const businessTypeStats = Object.entries(businessTypes).map(([type, count]) => ({
    type,
    percentage: totalEntrepreneurs > 0
      ? ((count / totalEntrepreneurs) * 100).toFixed(0)
      : 0,
  }));

  // recent activity (last 7 entries)
  const recentEntrepreneurs = [...entrepreneurs]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 7);

  // partner referrals this month (counts all, unchanged)
  const partnerReferrals = entrepreneurs.reduce((acc, e) => {
    if (e.referred) acc[e.referred] = (acc[e.referred] || 0) + 1;
    return acc;
  }, {});
  const totalPartnerReferrals = Object.values(partnerReferrals).reduce((sum, c) => sum + c, 0);

  // 🍺 Bar chart: this month only
  const barData = {
    labels: ['Monthly Trends'],
    datasets: [
      {
        label: 'Monthly Trends',
        data: [thisMonthCount],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  // 🍕 Pie chart: business types
  const pieData = {
    labels: Object.keys(businessTypes),
    datasets: [
      {
        label: 'Business Types',
        data: Object.values(businessTypes),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
      },
    ],
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded shadow">
          <h2 className="text-sm font-semibold">Total Entrepreneurs</h2>
          <p className="text-2xl">{totalEntrepreneurs}</p>
        </div>
        <div className="bg-gray-800 p-4 rounded shadow">
          <h2 className="text-sm font-semibold">Business Types</h2>
          <p className="text-sm">
            {businessTypeStats.map(b => `${b.percentage}% ${b.type}`).join(' • ')}
          </p>
        </div>
        <div className="bg-gray-800 p-4 rounded shadow">
          <h2 className="text-sm font-semibold">Recent Contacts</h2>
          <p className="text-2xl">{recentEntrepreneurs.length}</p>
          <p className="text-xs text-gray-400">Last 7 entries</p>
        </div>
        <div className="bg-gray-800 p-4 rounded shadow">
          <h2 className="text-sm font-semibold">Partner Referrals</h2>
          <p className="text-2xl">{totalPartnerReferrals}</p>
          <p className="text-xs text-gray-400">All time</p>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-left text-sm bg-gray-900 rounded">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-2">Date</th>
              <th className="p-2">Entrepreneur</th>
              <th className="p-2">Action</th>
              <th className="p-2">Partner</th>
              <th className="p-2">Stage</th>
            </tr>
          </thead>
          <tbody>
            {recentEntrepreneurs.map((e, i) => (
              <tr key={i} className="border-t border-gray-700">
                <td className="p-2">
                  {e.created_at
                    ? new Date(e.created_at).toLocaleDateString()
                    : 'No date'}
                </td>
                <td className="p-2 font-semibold">{e.name || '—'}</td>
                <td className="p-2">
                  <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
                    Added
                  </span>
                </td>
                <td className="p-2">{e.referred || '—'}</td>
                <td className="p-2">
                  <ProgressBar currentStage={e.stage} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Monthly Trends</h2>
          <Bar data={barData} />
        </div>
        <div className="bg-gray-900 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Business Type Distribution</h2>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
