import React, { useEffect, useState } from "react";
import axios from "axios";

interface GlobalData {
  market_cap_usd: number;
  volume_24h_usd: number;
  bitcoin_dominance_percentage: number;
  cryptocurrencies_number: number;
}

interface Coin {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_active: boolean;
}

interface CoinDetail {
  id: string;
  name: string;
  symbol: string;
  description: string;
  rank: number;
  is_active: boolean;
  logo: string;
  website: string;
  proof_type: string;
  org_structure: string;
}

const CryptoDashboard: React.FC = () => {
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [selectedCoin, setSelectedCoin] = useState<CoinDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGlobalData();
    fetchCoins();
  }, []);

  const fetchGlobalData = async () => {
    try {
      const response = await axios.get<GlobalData>(
        "https://api.coinpaprika.com/v1/global"
      );
      setGlobalData(response.data);
    } catch (err) {
      console.error("Error fetching global data:", err);
      setError("Unable to fetch global data.");
    }
  };

  const fetchCoins = async () => {
    try {
      const response = await axios.get<Coin[]>(
        "https://api.coinpaprika.com/v1/coins"
      );
      setCoins(response.data.slice(0, 20)); // Display top 20 coins for performance
    } catch (err) {
      console.error("Error fetching coins:", err);
      setError("Unable to fetch coin list.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCoinDetails = async (coinId: string) => {
    try {
      const response = await axios.get<CoinDetail>(
        `https://api.coinpaprika.com/v1/coins/${coinId}`
      );
      setSelectedCoin(response.data);
    } catch (err) {
      console.error("Error fetching coin details:", err);
      setError("Unable to fetch coin details.");
    }
  };

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Crypto Dashboard</h1>

      {/* Global Market Overview */}
      {globalData && (
        <div className="mb-8 p-4 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Global Market Overview</h2>
          <p>Market Cap: ${globalData.market_cap_usd.toLocaleString()}</p>
          <p>24h Volume: ${globalData.volume_24h_usd.toLocaleString()}</p>
          <p>Bitcoin Dominance: {globalData.bitcoin_dominance_percentage}%</p>
          <p>
            Number of Cryptocurrencies: {globalData.cryptocurrencies_number}
          </p>
        </div>
      )}

      {/* Coin List */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {coins.map((coin) => (
          <div
            key={coin.id}
            onClick={() => fetchCoinDetails(coin.id)}
            className="cursor-pointer p-4 bg-gray-800 rounded-lg shadow-lg hover:bg-gray-700 transition"
          >
            <p className="font-semibold">
              {coin.name} ({coin.symbol})
            </p>
            <p>Rank: {coin.rank}</p>
          </div>
        ))}
      </div>

      {/* Coin Details */}
      {selectedCoin && (
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">
            {selectedCoin.name} ({selectedCoin.symbol})
          </h2>
          <img
            src={selectedCoin.logo}
            alt={`${selectedCoin.name} logo`}
            className="w-16 h-16 mb-4"
          />
          <p>{selectedCoin.description}</p>
          <p>
            <strong>Rank:</strong> {selectedCoin.rank}
          </p>
          <p>
            <strong>Proof Type:</strong> {selectedCoin.proof_type}
          </p>
          <p>
            <strong>Organization Structure:</strong>{" "}
            {selectedCoin.org_structure}
          </p>
          <a
            href={selectedCoin.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400"
          >
            Official Website
          </a>
        </div>
      )}
    </div>
  );
};

export default CryptoDashboard;
