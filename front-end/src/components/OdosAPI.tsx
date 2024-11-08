// src/components/OdosApiIntegration.tsx

import { useState, useEffect, ChangeEvent } from "react";
import { ethers } from "ethers";

interface Chain {
  chainId: number;
  chainName: string;
}

interface QuoteData {
  gasEstimate: string;
  priceImpact: number;
  inTokens: string[];
  outTokens: string[];
}

export default function OdosApiIntegration() {
  const [odosPathViz, setOdosPathViz] = useState<string | null>(null);
  const [inputToken, setInputToken] = useState<string>(
    "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
  );
  const [outputToken, setOutputToken] = useState<string>(
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
  );
  const [amount, setAmount] = useState<string>("189000000");
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [selectedChain, setSelectedChain] = useState<number>(1);
  const [chains, setChains] = useState<Chain[]>([]);
  const [tokenPrices, setTokenPrices] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [inputError, setInputError] = useState<string | null>(null);
  const [outputError, setOutputError] = useState<string | null>(null);

  const fetchSupportedChains = async () => {
    try {
      const response = await fetch("https://api.odos.xyz/info/chains");
      const data = await response.json();
      const chainList = data.chains.map((chainId: number) => {
        let chainName = "";
        switch (chainId) {
          case 1:
            chainName = "Ethereum Mainnet";
            break;
          case 137:
            chainName = "Polygon";
            break;
          case 42161:
            chainName = "Arbitrum One";
            break;
          case 56:
            chainName = "Binance Smart Chain";
            break;
          case 43114:
            chainName = "Avalanche Mainnet";
            break;
          case 10:
            chainName = "Optimism";
            break;
          case 5000:
            chainName = "Mantle";
            break;
          case 324:
            chainName = "zkSync Mainnet";
            break;
          case 8453:
            chainName = "Base";
            break;
          case 34443:
            chainName = "Mode";
            break;
          case 59144:
            chainName = "Linea";
            break;
          case 250:
            chainName = "Fantom Opera";
            break;
          default:
            chainName = `Chain ${chainId}`;
        }
        return { chainId, chainName };
      });
      setChains(chainList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching chains:", error);
      setLoading(false);
    }
  };

  const handleInputTokenChange = (e: ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    setInputToken(address);
    setInputError(
      ethers.isAddress(address) ? null : "Invalid Ethereum address"
    );
  };

  const handleOutputTokenChange = (e: ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;
    setOutputToken(address);
    setOutputError(
      ethers.isAddress(address) ? null : "Invalid Ethereum address"
    );
  };
  const fetchTokenPrice = async (chainId: number, tokenAddr: string) => {
    try {
      const response = await fetch(
        `https://api.odos.xyz/pricing/token/${chainId}/${tokenAddr}`
      );
      const data = await response.json();
      if (data.price) {
        setTokenPrices((prevPrices) => ({
          ...prevPrices,
          [tokenAddr]: data.price,
        }));
      } else {
        console.error(`Price not available for token ${tokenAddr}`);
      }
    } catch (error) {
      console.error("Error fetching token price:", error);
    }
  };

  const getOdosQuote = async () => {
    if (!selectedChain || inputError || outputError) {
      alert("Please fix the errors before proceeding.");
      return;
    }

    try {
      const odosQuoteReq = await fetch("https://api.odos.xyz/sor/quote/v2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chainId: selectedChain,
          inputTokens: [
            {
              tokenAddress: inputToken,
              amount: amount,
            },
          ],
          outputTokens: [
            {
              tokenAddress: outputToken,
              proportion: 1,
            },
          ],
          slippageLimitPercent: 0.3,
          pathVizImage: true,
        }),
      });
      const odosQuoteRes = await odosQuoteReq.json();
      setOdosPathViz(odosQuoteRes.pathVizImage);
      setQuoteData(odosQuoteRes);
    } catch (error) {
      console.error("Error fetching quote:", error);
    }
  };

  useEffect(() => {
    fetchSupportedChains();
  }, []);

  useEffect(() => {
    if (selectedChain) {
      fetchTokenPrice(selectedChain, inputToken); // Fetch input token price
      fetchTokenPrice(selectedChain, outputToken); // Fetch output token price
      getOdosQuote();
    }
  }, [selectedChain, inputToken, outputToken, amount]);

  // return (
  //   <div className="bg-[#1A202C] p-10 rounded-lg shadow-lg max-w-2xl mx-auto mt-10 text-white">
  //     <h2 className="text-3xl font-bold mb-6 text-center">Odos Insights</h2>
  //     <p className="text-center mb-6">
  //       Use this tool to visualize token swaps across different liquidity pools.
  //     </p>

  //     <div className="mb-6">
  //       {loading ? (
  //         <p className="text-center text-gray-400">
  //           Loading supported chains...
  //         </p>
  //       ) : (
  //         <div className="mb-4">
  //           <label htmlFor="chainId" className="block font-semibold mb-2">
  //             Select Chain:
  //           </label>
  //           <select
  //             id="chainId"
  //             value={selectedChain}
  //             onChange={(e) => setSelectedChain(Number(e.target.value))}
  //             className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //           >
  //             <option value="" disabled>
  //               Select a chain
  //             </option>
  //             {chains.map((chain) => (
  //               <option key={chain.chainId} value={chain.chainId}>
  //                 {chain.chainName} (Chain ID: {chain.chainId})
  //               </option>
  //             ))}
  //           </select>
  //         </div>
  //       )}
  //     </div>

  //     <div className="mb-6">
  //       <label className="block font-semibold mb-2">Input Token</label>
  //       <input
  //         type="text"
  //         placeholder="Enter input token address"
  //         value={inputToken}
  //         onChange={handleInputTokenChange}
  //         className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
  //       />
  //       {inputError && <p className="text-red-500 text-sm">{inputError}</p>}
  //       <p className="text-sm text-gray-400">
  //         Price: ${tokenPrices[inputToken] || "N/A"}
  //       </p>

  //       <label className="block font-semibold mt-4 mb-2">Output Token</label>
  //       <input
  //         type="text"
  //         placeholder="Enter output token address"
  //         value={outputToken}
  //         onChange={handleOutputTokenChange}
  //         className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
  //       />
  //       {outputError && <p className="text-red-500 text-sm">{outputError}</p>}
  //       <p className="text-sm text-gray-400">
  //         Price: ${tokenPrices[outputToken] || "N/A"}
  //       </p>

  //       <label className="block font-semibold mt-4 mb-2">Amount</label>
  //       <input
  //         type="number"
  //         placeholder="Enter amount to swap"
  //         value={amount}
  //         onChange={(e) => setAmount(e.target.value)}
  //         className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
  //       />
  //       <button
  //         onClick={getOdosQuote}
  //         className="w-full mt-6 p-3 bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 text-white font-semibold transition-all"
  //       >
  //         Get Swap Path
  //       </button>
  //     </div>

  //     <div className="mt-8">
  //       {odosPathViz && (
  //         <div className="mb-8">
  //           <h3 className="text-2xl font-bold mb-4">Path Visualization</h3>
  //           <img
  //             src={odosPathViz}
  //             alt="Odos Path Visualization"
  //             className="bg-white w-full rounded-lg shadow-lg"
  //           />
  //         </div>
  //       )}

  //       {quoteData && (
  //         <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
  //           <h3 className="text-2xl font-bold mb-4">Quote Information</h3>
  //           <p>
  //             <strong>Gas Estimate:</strong> {quoteData.gasEstimate} wei
  //           </p>
  //           <p>
  //             <strong>Price Impact:</strong> {quoteData.priceImpact}%
  //           </p>
  //           <p>
  //             <strong>Input Tokens:</strong>{" "}
  //             {quoteData.inTokens ? quoteData.inTokens.join(", ") : "N/A"}
  //           </p>
  //           <p>
  //             <strong>Output Tokens:</strong>{" "}
  //             {quoteData.outTokens ? quoteData.outTokens.join(", ") : "N/A"}
  //           </p>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-10 rounded-lg shadow-2xl max-w-2xl mx-auto mt-10 text-white transition-all duration-300">
      <h2 className="text-4xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        Odos Insights
      </h2>
      <p className="text-center mb-8 text-gray-400">
        Visualize token swaps across different liquidity pools.
      </p>

      {loading ? (
        <p className="text-center text-gray-400">Loading supported chains...</p>
      ) : (
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2 text-gray-300">
            Select Chain
          </label>
          <select
            value={selectedChain}
            onChange={(e) => setSelectedChain(Number(e.target.value))}
            className="w-full p-4 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select a chain
            </option>
            {chains.map((chain) => (
              <option key={chain.chainId} value={chain.chainId}>
                {chain.chainName} (Chain ID: {chain.chainId})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2 text-gray-300">
          Input Token
        </label>
        <input
          type="text"
          placeholder="Enter input token address"
          value={inputToken}
          onChange={handleInputTokenChange}
          className="w-full p-4 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        />
        {inputError && <p className="text-red-500 text-sm">{inputError}</p>}
        <p className="text-sm text-gray-400">
          Price: ${tokenPrices[inputToken] || "N/A"}
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2 text-gray-300">
          Output Token
        </label>
        <input
          type="text"
          placeholder="Enter output token address"
          value={outputToken}
          onChange={handleOutputTokenChange}
          className="w-full p-4 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
        />
        {outputError && <p className="text-red-500 text-sm">{outputError}</p>}
        <p className="text-sm text-gray-400">
          Price: ${tokenPrices[outputToken] || "N/A"}
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2 text-gray-300">
          Amount
        </label>
        <input
          type="number"
          placeholder="Enter amount to swap"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-4 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={getOdosQuote}
        className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Get Swap Path
      </button>

      {odosPathViz && (
        <div className="mt-10">
          <h3 className="text-3xl font-bold mb-6 text-center">
            Path Visualization
          </h3>
          <img
            src={odosPathViz}
            alt="Odos Path Visualization"
            className="w-full rounded-lg shadow-lg border border-gray-700"
          />
        </div>
      )}

      {quoteData && (
        <div className="bg-gray-800 p-6 mt-8 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-4 text-gradient">
            Quote Information
          </h3>
          <p>
            <strong>Gas Estimate:</strong> {quoteData.gasEstimate} wei
          </p>
          <p>
            <strong>Price Impact:</strong> {quoteData.priceImpact}%
          </p>
          <p>
            <strong>Input Tokens:</strong>{" "}
            {quoteData.inTokens ? quoteData.inTokens.join(", ") : "N/A"}
          </p>
          <p>
            <strong>Output Tokens:</strong>{" "}
            {quoteData.outTokens ? quoteData.outTokens.join(", ") : "N/A"}
          </p>
        </div>
      )}
    </div>
  );
}
