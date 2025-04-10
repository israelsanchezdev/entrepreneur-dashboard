
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Bar, Pie } from 'react-chartjs-2';
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

  const totalEntrepreneurs = entrepreneurs.length;

  const businessTypes = entrepreneurs.reduce((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1;
    return acc;
  }, {});

  const businessTypeStats = Object.entries(businessTypes).map(([type, count]) => {
    const percent = ((count / totalEntrepreneurs) * 100).toFixed(0);
    return `${percent}% ${type}`;
  });

  const recentWeek = entrepreneurs.filter((e) => {
    const date = new Date(e.date);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return date >= oneWeekAgo;
  });

  const monthlyReferrals = entrepreneurs.filter((e) => {
    const date = new Date(e.date);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });

  const activityLog = entrepreneurs
    .map((e) => ({
      date: new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      name: e.name,
      partner: e.referred || 'N/A',
      action: 'Added'
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const monthlyCounts = entrepreneurs.reduce((acc, e) => {
    const date = new Date(e.date);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const monthlyLabels = Object.keys(monthlyCounts);
  const monthlyValues = Object.values(monthlyCounts);

  const barData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: 'Monthly Trends',
        data: monthlyValues,
        backgroundColor: 'rgba(59,130,246,0.6)'
      }
    ]
  };

  const pieData = {
    labels: Object.keys(businessTypes),
    datasets: [
      {
        label: 'Business Type Distribution',
        data: Object.values(businessTypes),
        backgroundColor: ['#60a5fa', '#93c5fd', '#bfdbfe']
      }
    ]
  };

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 p-4 rounded shadow">
          <h3 className="text-white text-sm">Total Entrepreneurs</h3>
          <p className="text-2xl font-bold text-white">{totalEntrepreneurs}</p>
        </div>
        <div className="bg-gray-900 p-4 rounded shadow">
          <h3 className="text-white text-sm">Business Types</h3>
          <p className="text-sm text-white">{businessTypeStats.join(' · ')}</p>
        </div>
        <div className="bg-gray-900 p-4 rounded shadow">
          <h3 className="text-white text-sm">Recent Contacts</h3>
          <p className="text-2xl font-bold text-white">{recentWeek.length}</p>
          <p className="text-xs text-gray-400">Last 7 days</p>
        </div>
        <div className="bg-gray-900 p-4 rounded shadow">
          <h3 className="text-white text-sm">Partner Referrals</h3>
          <p className="text-2xl font-bold text-white">{monthlyReferrals.length}</p>
          <p className="text-xs text-gray-400">This month</p>
        </div>
      </div>

      <div>
        <h3 className="text-black text-lg font-semibold mb-2">Recent Activity</h3>
        <div className="overflow-auto rounded border border-gray-700">
          <table className="min-w-full bg-gray-800 text-white">
            <thead>
              <tr>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Entrepreneur</th>
                <th className="p-2 text-left">Action</th>
                <th className="p-2 text-left">Partner</th>
              </tr>
            </thead>
            <tbody>
              {activityLog.map((log, idx) => (
                <tr key={idx} className="border-t border-gray-700">
                  <td className="p-2">{log.date}</td>
                  <td className="p-2 font-semibold">{log.name}</td>
                  <td className="p-2">
                    <span className="bg-blue-500 px-2 py-1 rounded text-sm">Added</span>
                  </td>
                  <td className="p-2">{log.partner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-black text-lg font-semibold mb-2">Monthly Trends</h3>
          <Bar data={barData} />
        </div>
        <div>
          <h3 className="text-black text-lg font-semibold mb-2">Business Type Distribution</h3>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
