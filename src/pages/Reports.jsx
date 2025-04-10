import * as XLSX from 'xlsx';
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
} from 'chart.js';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Reports = () => {
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(entrepreneurs);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Entrepreneurs");
    XLSX.writeFile(wb, "entrepreneurs_report.xlsx");
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('entrepreneurs').select('*');
      if (!error) setEntrepreneurs(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-6">Loading reports...</div>;
  if (!entrepreneurs || entrepreneurs.length === 0) {
    return <div className="p-6 text-gray-500">No entrepreneur data available to generate reports.</div>;
  }

  const typeCounts = entrepreneurs.reduce((acc, e) => {
    acc[e.type] = (acc[e.type] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(typeCounts);
  const values = Object.values(typeCounts);

  const barData = {
    labels,
    datasets: [
      {
        label: 'Entrepreneur Types',
        data: values,
        backgroundColor: 'rgba(59,130,246,0.6)'
      }
    ]
  };

  const pieData = {
    labels,
    datasets: [
      {
        label: 'Entrepreneur Types',
        data: values,
        backgroundColor: ['#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe', '#3b82f6']
      }
    ]
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-4">Entrepreneur Report</h2>
      <button onClick={handleExport} className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Export to Excel</button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg mb-2">Bar Chart</h3>
          <Bar data={barData} />
        </div>
        <div>
          <h3 className="text-lg mb-2">Pie Chart</h3>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
};

export default Reports;
