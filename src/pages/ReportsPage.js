import React, { useState, useEffect } from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
);

const ReportsPage = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [revenueData, setRevenueData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Revenue (Ksh)',
        data: [820000, 910000, 870000, 950000, 1020000, 980000],
        borderColor: '#8E44AD',
        backgroundColor: 'rgba(142, 68, 173, 0.2)',
        tension: 0.3,
      },
    ],
  });

  const occupancyData = {
    labels: ['Deluxe King', 'Standard Queen', 'Executive Suite', 'Twin Room'],
    datasets: [
      {
        label: 'Occupancy',
        data: [45, 30, 15, 10],
        backgroundColor: ['#8E44AD', '#3498DB', '#E67E22', '#2ECC71'],
      },
    ],
  };

  const incomeVsExpenses = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Income',
        data: [820000, 910000, 870000, 950000, 1020000],
        backgroundColor: '#2ECC71',
      },
      {
        label: 'Expenses',
        data: [620000, 700000, 680000, 720000, 750000],
        backgroundColor: '#E74C3C',
      },
    ],
  };

  const handleFilter = () => {
    console.log('Filtering from', startDate, 'to', endDate);
  };

  const handleExportCSV = () => {
    const rows = [['Month', 'Revenue']];
    revenueData.labels.forEach((label, i) => {
      rows.push([label, revenueData.datasets[0].data[i]]);
    });

    const csvContent = rows.map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'revenue_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (startDate && endDate) {
      const filteredLabels = ['Jan', 'Feb', 'Mar'];
      const filteredValues = [820000, 910000, 870000];
      setRevenueData({
        labels: filteredLabels,
        datasets: [
          {
            label: 'Monthly Revenue (Ksh)',
            data: filteredValues,
            borderColor: '#8E44AD',
            backgroundColor: 'rgba(142, 68, 173, 0.2)',
            tension: 0.3,
          },
        ],
      });
    }
  }, [startDate, endDate]);

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedValues = revenueData.datasets[0].data.map(val => val + Math.floor(Math.random() * 5000 - 2500));
      setRevenueData({
        ...revenueData,
        datasets: [{ ...revenueData.datasets[0], data: updatedValues }],
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] px-4 py-12">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-serif text-[#2C3E50] mb-8 text-center">Hotel Reports & Analytics</h2>

        {/* Date Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex gap-4">
            <label className="text-sm font-medium text-gray-700">Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />
            <label className="text-sm font-medium text-gray-700">End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <button
            onClick={handleFilter}
            className="bg-[#8E44AD] hover:bg-[#732d91] text-white px-6 py-2 rounded"
          >
            Filter Reports
          </button>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExportCSV}
          className="bg-[#27AE60] hover:bg-[#1E8449] text-white px-6 py-2 rounded mb-6"
        >
          Export Revenue to CSV
        </button>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-lg font-semibold mb-2">Monthly Revenue</h3>
            <Line data={revenueData} />
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Room Occupancy</h3>
            <Pie data={occupancyData} />
          </div>

          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-2">Income vs Expenses</h3>
            <Bar data={incomeVsExpenses} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
