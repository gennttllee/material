import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, BarController);

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

const BarChart = () => {
  const data = {
    labels,
    datasets: [
      {
        label: '',
        data: [27, 8, 18, 22, 4, 29, 11, 20, 6, 17, 13, 26],
        hoverBackgroundColor: '#FF8A34',
        backgroundColor: '#F1F2F4',
        borderColor: '#F1F2F4',
        borderWidth: 1
      }
    ]
  };

  const options = {
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      }
    },
    layout: {
      padding: {
        // left: 5,
        // right: 5,
        // top: 10,
        // bottom: 5
      },
      margin: {
        // left: 5,
        // right: 5,
        // top: 5,
        // bottom: 5
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
    },
    elements: {
      bar: {
        borderRadius: 5,
        borderWidth: 0.7
      }
    }
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
