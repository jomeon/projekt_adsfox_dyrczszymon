import React from 'react';
import { Pie } from 'react-chartjs-2';
import {ArcElement, Chart, Legend, Tooltip} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {ChannelData} from "./form.tsx";
Chart.register(ArcElement,Tooltip, Legend, ChartDataLabels);

interface PieChartProps {
  data: ChannelData[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const filteredData = data.filter((item) => item.customers > 0)

  const chartData = {
    labels: filteredData.map(item => item.source),
    datasets: [
      {
        data: filteredData.map(item => item.customers),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: true,
      position: 'bottom',
    },
    plugins:{
      datalabels: {
        display:true,
        color:'white',
        formatter: (value:any, ctx:any) => {
          let sum = 0;
          let dataArr = ctx.chart.data.datasets[0].data;

          dataArr.map((d: number) => {
            sum += d;
          });
          return (value*100 / sum).toFixed(2)+"%";
        },
      }
    },

  };

  return <Pie data={chartData} options={options} />;
};

export default PieChart;