// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// interface Rate {
//   time: string;
//   asset_id_quote: string;
//   rate: number;
// }

// const ExchangeRateGraph: React.FC = () => {
//   const [rates, setRates] = useState<Rate[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchExchangeRates = async () => {
//       try {
//         const response = await axios.get(
//           "https://rest.coinapi.io/v1/exchangerate/ETH",
//           {
//             headers: {
//               Accept: "text/plain",
//               "X-CoinAPI-Key": "2C9304EB-16ED-418C-8430-811DD2AAB715",
//             },
//           }
//         );
//         setRates(response.data.rates.slice(0, 10)); // Take the first 10 rates for simplicity
//       } catch (error) {
//         setError("Failed to fetch data");
//         console.error("Error fetching exchange rates:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchExchangeRates();
//   }, []);

//   // Prepare data for the chart
//   const chartData = {
//     labels: rates.map((rate) => rate.asset_id_quote),
//     datasets: [
//       {
//         label: "ETH Exchange Rates",
//         data: rates.map((rate) => rate.rate),
//         borderColor: "rgba(75, 192, 192, 1)",
//         backgroundColor: "rgba(75, 192, 192, 0.2)",
//         fill: true,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "top" as const,
//       },
//       title: {
//         display: true,
//         text: "ETH Exchange Rates Across Different Currencies",
//       },
//     },
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-2xl mx-auto text-white">
//       <h2 className="text-2xl font-bold mb-4 text-center">
//         ETH Exchange Rates
//       </h2>
//       <Line data={chartData} options={options} />
//     </div>
//   );
// };

// export default ExchangeRateGraph;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Rate {
  time: string;
  asset_id_quote: string;
  rate: number;
}

const ExchangeRateGraph: React.FC = () => {
  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(
          "https://rest.coinapi.io/v1/exchangerate/ETH",
          {
            headers: {
              Accept: "text/plain",
              "X-CoinAPI-Key": "2C9304EB-16ED-418C-8430-811DD2AAB715",
            },
          }
        );
        setRates(response.data.rates.slice(0, 10)); // Take the first 10 rates for simplicity
      } catch (error) {
        setError("Failed to fetch data");
        console.error("Error fetching exchange rates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRates();
  }, []);

  // Prepare data for the chart
  const chartData = {
    labels: rates.map((rate) => rate.asset_id_quote),
    datasets: [
      {
        label: "ETH Exchange Rates",
        data: rates.map((rate) => rate.rate),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
        pointBorderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: "#4bc0c0",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: {
          color: "#FFFFFF",
          font: {
            size: 14,
            family: "Arial",
          },
        },
      },
      title: {
        display: true,
        text: "ETH Exchange Rates Across Different Currencies",
        color: "#FFFFFF",
        font: {
          size: 18,
          weight: "bold" as const,
          family: "Arial",
        },
        padding: {
          top: 10,
          bottom: 10,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#FFFFFF",
          font: {
            size: 12,
            family: "Arial",
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: "#FFFFFF",
          font: {
            size: 12,
            family: "Arial",
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-xxl mx-auto text-white">
      <h2 className="text-2xl font-bold mb-4 text-center">
        ETH Exchange Rates
      </h2>
      <p className="text-center text-gray-400 mb-6">
        Latest ETH exchange rates across major currencies
      </p>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ExchangeRateGraph;
