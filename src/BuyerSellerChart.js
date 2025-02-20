import React, { useEffect, useState } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import axios from "axios";

Chart.register(...registerables);

const BuyerSellerChart = () => {
  const [chartData, setChartData] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

  // Function to Fetch Data from MongoDB
  const fetchChartData = async () => {
    try {
      const response = await axios.get("http://localhost:5001/data");
      const months = response.data.map((item) => item.month);
      const purchases = response.data.map((item) => item.purchase);
      const sales = response.data.map((item) => item.sales);

      setChartData({
        labels: months,
        datasets: [
          {
            label: "Purchases",
            data: purchases,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 2,
          },
          {
            label: "Sales",
            data: sales,
            backgroundColor: "rgba(255, 99, 132, 0.6)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 2,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  // Function to Handle File Upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5001/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadMessage(response.data.message);
      fetchChartData(); // Refresh chart data after upload
    } catch (error) {
      console.error("Upload Error:", error);
      setUploadMessage("Error uploading file!");
    }
  };

  if (!chartData) {
    return <p className="text-center text-gray-500 text-lg">Loading chart data...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Sales & Purchase Data Visualization</h2>

      {/* File Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6 w-full max-w-lg">
        <h3 className="text-xl font-semibold text-gray-700 mb-3">Upload Excel File</h3>
        <input
          type="file"
          accept=".xlsx, .xls"
          className="block w-full text-gray-900 border border-gray-300 rounded-lg cursor-pointer p-2 mb-3"
          onChange={handleFileChange}
        />
        <button
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-500 transition"
          onClick={handleFileUpload}
        >
          Upload File
        </button>
        {uploadMessage && <p className="mt-2 text-green-600">{uploadMessage}</p>}
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Purchase vs Sales</h3>
          <div className="h-64">
            <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Sales Distribution</h3>
          <div className="h-64">
            <Pie data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-3">Sales & Purchase Trends</h3>
          <div className="h-64">
            <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerSellerChart;
