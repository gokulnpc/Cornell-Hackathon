import { useState, ChangeEvent, useEffect } from "react";
import axios from "axios";
import { useAccount, useWalletClient } from "wagmi";
import {
  usePYUSDTokenAddress,
  usePYNFTCollectionAddress,
} from "../hooks/tokenAddress";
import { ethers } from "ethers";
import PYUSD from "../abi/PYUSD.json";
import PYNFT from "../abi/PYNFT.json";

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY!;
const PINATA_SECRET_API_KEY = import.meta.env.VITE_PINATA_SECRET_API_KEY!;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export default function MintWithPYUSD() {
  const [prompt, setPrompt] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [nftName, setNftName] = useState<string>("");
  const [nftDescription, setNftDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [approved, setApproved] = useState<boolean>(false);
  const [mintPrice, setMintPrice] = useState<bigint | null>(null);
  const [status, setStatus] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("");
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const nftCollectionAddress = usePYNFTCollectionAddress();
  const pyusdTokenAddress = usePYUSDTokenAddress();

  // Fetch mint price from the contract and check approval status
  useEffect(() => {
    const fetchMintPriceAndApproval = async () => {
      if (!walletClient) return;

      try {
        const provider = new ethers.BrowserProvider(walletClient);
        const signer = await provider.getSigner();

        const nftContract = new ethers.Contract(
          nftCollectionAddress,
          PYNFT.abi,
          signer
        );
        const pyusdToken = new ethers.Contract(
          pyusdTokenAddress,
          PYUSD.abi,
          signer
        );

        // Fetch mint price from the contract
        const mintPriceFromContract = await nftContract.mintPrice();
        setMintPrice(BigInt(mintPriceFromContract.toString()));

        // Check if the user has approved the mint price
        const allowance = await pyusdToken.allowance(
          await signer.getAddress(),
          nftCollectionAddress
        );
        console.log("Allowance:", allowance.toString());
        console.log("Mint Price:", mintPriceFromContract.toString());
        setApproved(BigInt(allowance.toString()) >= mintPriceFromContract);
      } catch (error) {
        console.error("Error fetching mint price or checking approval:", error);
      }
    };

    if (isConnected && walletClient) {
      fetchMintPriceAndApproval();
    }
  }, [isConnected, walletClient, nftCollectionAddress, pyusdTokenAddress]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageFile(file || null);

    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        setImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateImage = async () => {
    try {
      setLoading(true);
      setStatus("Generating AI image...");

      const response = await axios.post(
        "https://api.openai.com/v1/images/generations",
        {
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          style: "vivid",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      setImageUrl(response.data.data[0].url);
      setLoading(false);
      setStatus("AI image generated successfully.");
    } catch (error) {
      console.error("Error generating image:", error);
      setStatus("Error generating image.");
      setLoading(false);
    }
  };

  const uploadImageToIPFS = async () => {
    setStatus("Uploading image to IPFS...");
    if (!imageFile) throw new Error("No image file selected");

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: Infinity,
          headers: {
            "Content-Type": "multipart/form-data",
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_API_KEY,
          },
        }
      );
      const ipfsHash = res.data.IpfsHash;
      setStatus("Image uploaded to IPFS successfully.");
      console.log("Image uploaded to IPFS:", ipfsHash);
      return `https://pink-absolute-catshark-415.mypinata.cloud/ipfs/${ipfsHash}`;
    } catch (error) {
      console.error("Error uploading image to IPFS:", error);
      setStatus("Error uploading image to IPFS.");
      throw error;
    }
  };

  const handleApprovePYUSD = async () => {
    if (!walletClient || !mintPrice) {
      setStatus("Wallet not connected or mint price unavailable.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const pyusdToken = new ethers.Contract(
        pyusdTokenAddress,
        PYUSD.abi,
        signer
      );

      setStatus("Approving PYUSD for NFT minting...");
      const tx = await pyusdToken.approve(nftCollectionAddress, mintPrice);
      await tx.wait();

      // Check if the approval was successful
      const allowance = await pyusdToken.allowance(
        await signer.getAddress(),
        nftCollectionAddress
      );
      console.log("Allowance after approval:", allowance.toString());
      setApproved(true);
      setStatus("PYUSD approved successfully for minting.");
    } catch (error) {
      console.error("Error approving PYUSD:", error);
      setStatus("Approval failed.");
    }
  };

  const handleMintNFTWithPYUSD = async () => {
    setStatus("Preparing to mint NFT...");
    let imageToUpload = imageUrl;
    if (imageFile) {
      try {
        imageToUpload = await uploadImageToIPFS();
      } catch (error) {
        return;
      }
    }
    await mintNFT(imageToUpload);
  };

  const mintNFT = async (tokenURI: string) => {
    if (!walletClient) {
      setStatus("Wallet not connected.");
      return;
    }

    try {
      setStatus("Minting NFT...");
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const nftContract = new ethers.Contract(
        nftCollectionAddress,
        PYNFT.abi,
        signer
      );

      const transaction = await nftContract.mint(tokenURI);
      setStatus(`Minting in progress... Transaction Hash: ${transaction.hash}`);
      setTxHash(transaction.hash);
      await transaction.wait();
      setStatus("NFT minted successfully!");
    } catch (error) {
      console.error("Error minting NFT:", error);
      setStatus("Minting failed.");
    }
  };

  const openTransactionDetails = () => {
    if (txHash) {
      const transactionUrl = `/transaction-details/${txHash}`;
      window.open(transactionUrl, "_blank");
    }
  };
  // return (
  //   <div className="bg-[#1A202C] p-10 rounded-lg shadow-lg max-w-2xl mx-auto mt-10 text-white">
  //     <h1 className="text-3xl font-bold text-center mb-6 text-gradient">
  //       Mint Your NFT with PYUSD
  //     </h1>

  //     {isConnected && (
  //       <div>
  //         <div className="mb-6">
  //           <label className="block text-gray-300 mb-2">NFT Name</label>
  //           <input
  //             type="text"
  //             value={nftName}
  //             onChange={(e) => setNftName(e.target.value)}
  //             placeholder="Enter NFT Name"
  //             className="w-full p-3 border border-gray-600 rounded-lg bg-[#2D3748] text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  //           />
  //         </div>

  //         <div className="mb-6">
  //           <label className="block text-gray-300 mb-2">NFT Description</label>
  //           <textarea
  //             value={nftDescription}
  //             onChange={(e) => setNftDescription(e.target.value)}
  //             placeholder="Enter NFT Description"
  //             className="w-full p-3 border border-gray-600 rounded-lg bg-[#2D3748] text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  //           ></textarea>
  //         </div>

  //         <div className="mb-6">
  //           <label className="block text-gray-300 mb-2">AI Image Prompt</label>
  //           <input
  //             type="text"
  //             value={prompt}
  //             onChange={(e) => setPrompt(e.target.value)}
  //             placeholder="Enter a prompt for AI image"
  //             className="w-full p-3 border border-gray-600 rounded-lg bg-[#2D3748] text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
  //           />
  //         </div>

  //         <div className="mb-6 text-center">
  //           <button
  //             onClick={generateImage}
  //             disabled={loading}
  //             className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg transition-colors duration-200 ${
  //               loading ? "opacity-50 cursor-not-allowed" : ""
  //             }`}
  //           >
  //             {loading ? "Generating..." : "Generate AI Image"}
  //           </button>
  //         </div>

  //         <div className="mb-6">
  //           <p className="block text-gray-300 mb-2">OR Upload Your Own Image</p>
  //           <input
  //             type="file"
  //             accept="image/*"
  //             onChange={handleImageUpload}
  //             className="w-full p-2 border border-gray-600 rounded-lg bg-[#2D3748] text-gray-200"
  //           />
  //         </div>

  //         {imageUrl && (
  //           <div className="mb-6 text-center">
  //             <img
  //               src={imageUrl}
  //               alt="NFT Preview"
  //               className="w-64 h-64 object-cover mx-auto rounded-lg shadow-lg"
  //             />
  //           </div>
  //         )}

  //         <div className="mb-6 text-center">
  //           {approved ? (
  //             <button
  //               onClick={handleMintNFTWithPYUSD}
  //               disabled={!imageUrl && !imageFile}
  //               className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg transition-colors duration-200"
  //             >
  //               Mint NFT with PYUSD
  //             </button>
  //           ) : (
  //             <button
  //               onClick={handleApprovePYUSD}
  //               className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-6 rounded-lg transition-colors duration-200"
  //             >
  //               Approve PYUSD
  //             </button>
  //           )}
  //         </div>

  //         <p className="mt-4 text-center text-gray-400">{status}</p>
  //         <div className="flex justify-center mt-6">
  //           <button
  //             onClick={openTransactionDetails}
  //             className="px-4 py-2 text-blue-600 border border-blue-500 rounded-lg font-semibold transition duration-200 ease-in-out hover:bg-blue-500 hover:text-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 active:bg-blue-600"
  //           >
  //             View Transaction Details
  //           </button>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-10 rounded-2xl shadow-2xl max-w-2xl mx-auto mt-10 text-white transition-all duration-300">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-lg">
        Mint Your NFT with PYUSD
      </h1>

      {isConnected && (
        <div>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">NFT Name</label>
            <input
              type="text"
              value={nftName}
              onChange={(e) => setNftName(e.target.value)}
              placeholder="Enter NFT Name"
              className="w-full p-4 border border-gray-600 rounded-lg bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2">NFT Description</label>
            <textarea
              value={nftDescription}
              onChange={(e) => setNftDescription(e.target.value)}
              placeholder="Enter NFT Description"
              className="w-full p-4 border border-gray-600 rounded-lg bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            ></textarea>
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 mb-2">AI Image Prompt</label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter a prompt for AI image"
              className="w-full p-4 border border-gray-600 rounded-lg bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="mb-8 text-center">
            <button
              onClick={generateImage}
              disabled={loading}
              className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-8 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Generating..." : "Generate AI Image"}
            </button>
          </div>

          <div className="mb-6">
            <p className="block text-gray-300 mb-2">OR Upload Your Own Image</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 border border-gray-600 rounded-lg bg-gray-700 text-gray-200"
            />
          </div>

          {imageUrl && (
            <div className="mb-8 text-center">
              <img
                src={imageUrl}
                alt="NFT Preview"
                className="w-64 h-64 object-cover mx-auto rounded-lg shadow-lg border-2 border-purple-500"
              />
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
            {approved ? (
              <button
                onClick={handleMintNFTWithPYUSD}
                disabled={!imageUrl && !imageFile}
                className="w-full md:w-1/2 bg-gradient-to-r from-green-400 to-green-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Mint NFT with PYUSD
              </button>
            ) : (
              <button
                onClick={handleApprovePYUSD}
                className="w-full md:w-1/2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Approve PYUSD
              </button>
            )}
            <button
              onClick={openTransactionDetails}
              className="w-full md:w-1/2 bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              View Transaction Details
            </button>
          </div>
          <p className="mt-4 text-center text-gray-400 italic">{status}</p>
        </div>
      )}
    </div>
  );
}
