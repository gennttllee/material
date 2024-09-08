import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      // position: 'top' as const,
      display: false
    },
    title: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      border: { dash: [6, 6], display: true },
      grid: {
        display: false // Display grid lines for the y-axis
      },
      ticks: {
        //   padding: 15
      }
    },
    x: {
      beginAtZero: true,
      border: { display: true },
      grid: {
        display: false // Display grid lines for the y-axis
      },
      ticks: {
        //   padding: 7
      }
    }
  }
};

const labels = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec'
];

export const data = {
  labels,
  datasets: [
    {
      fill: false,
      borderWidth: 2,
      lineTension: 0.5, // This makes the line smooth
      label: 'Dataset 1',
      borderColor: '#437ADB',
      backgroundColor: '#437ADB',
      pointBackgroundColor: '#fff', // Transparent inside color
      pointBorderColor: '#437ADB', // Border color
      pointBorderWidth: 2, // Border thickness
      pointRadius: 5, // Dot size
      pointHoverBackgroundColor: '#437ADB', // Transparent inside color on hover
      pointHoverBorderColor: '#437ADB', // Border color on hover
      pointHoverBorderWidth: 2, // Border thickness on hover
      data: [0, 3, 28, 9, 21, 5, 19, 16, 7, 25, 2, 12]
    }
  ]
};

const LineChart = () => {
  return <Line options={options} data={data} />;
};

export default LineChart;
