import { useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { ethers, parseEther } from "ethers";
import {
  useNFTCollectionAddress,
  useMarketPlaceAddress,
} from "../hooks/tokenAddress";
import NFT_ABI from "../abi/NFTCollection.json";
import NFTMarketPlaceABI from "../abi/NFTMarketPlace.json";

interface Asset {
  tokenId: number;
  imageUrl: string;
  name: string;
  description: string;
  price?: string;
  approved?: boolean;
}

export default function MyAssets() {
  const { isConnected, address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const nftCollectionAddress = useNFTCollectionAddress();
  const marketplaceAddress = useMarketPlaceAddress();

  const [assets, setAssets] = useState<Asset[]>([]);
  const [status, setStatus] = useState<string>("");

  const fetchUserAssets = async () => {
    if (!walletClient || !address) {
      setStatus("Wallet not connected or address unavailable.");
      return;
    }

    try {
      setStatus("Loading your assets...");
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();

      const nftContract = new ethers.Contract(
        nftCollectionAddress,
        NFT_ABI.abi,
        signer
      );

      const totalIssued = await nftContract.totalIssued();
      let userAssets: Asset[] = [];

      for (let i = 0; i < totalIssued; i++) {
        const owner = await nftContract.ownerOf(i);
        const tokenURI = await nftContract.tokenURI(i);

        if (owner === address) {
          const metadata = await fetch(tokenURI).then((res) => res.json());
          const isApproved =
            (await nftContract.getApproved(i)) === marketplaceAddress;

          userAssets.push({
            tokenId: i,
            imageUrl: metadata.image,
            name: metadata.name,
            description: metadata.description,
            approved: isApproved,
          });
        }
      }
      setAssets(userAssets);
      setStatus("");
    } catch (error) {
      console.error("Error fetching assets:", error);
      setStatus("Failed to load assets.");
    }
  };

  const handleApproveNFT = async (tokenId: number) => {
    if (!walletClient || !address) {
      setStatus("Wallet not connected or address unavailable.");
      return;
    }

    try {
      setStatus("Approving marketplace...");
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();

      const nftContract = new ethers.Contract(
        nftCollectionAddress,
        NFT_ABI.abi,
        signer
      );

      const txApproval = await nftContract.approve(marketplaceAddress, tokenId);
      await txApproval.wait();

      setAssets((prevAssets) =>
        prevAssets.map((asset) =>
          asset.tokenId === tokenId ? { ...asset, approved: true } : asset
        )
      );
      setStatus("NFT approved for marketplace!");
    } catch (error) {
      console.error("Error approving NFT:", error);
      setStatus("Failed to approve NFT.");
    }
  };

  const handleListNFT = async (tokenId: number, price: string) => {
    if (!walletClient || !address) {
      setStatus("Wallet not connected or address unavailable.");
      return;
    }

    try {
      setStatus("Listing NFT for sale...");
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();

      const marketplaceContract = new ethers.Contract(
        marketplaceAddress,
        NFTMarketPlaceABI.abi,
        signer
      );

      const tx = await marketplaceContract.listNFT(
        nftCollectionAddress,
        tokenId,
        parseEther(price)
      );
      await tx.wait();
      setStatus("NFT listed for sale successfully!");
    } catch (error) {
      console.error("Error listing NFT for sale:", error);
      setStatus("Failed to list NFT for sale.");
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchUserAssets();
    }
  }, [isConnected]);

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 p-10 rounded-lg shadow-lg max-w-screen-xl mx-auto mt-10 text-white">
      <h1 className="text-5xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
        My Assets
      </h1>

      {status && <p className="text-center text-gray-300 mb-6">{status}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {assets.map((asset) => (
          <div
            key={asset.tokenId}
            className="bg-gray-800 p-6 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:bg-gray-700"
          >
            <img
              src={asset.imageUrl}
              alt={asset.name}
              className="w-full h-48 object-cover rounded-lg mb-4 shadow-md"
            />
            <h2 className="text-2xl font-semibold mb-2 text-white">
              {asset.name}
            </h2>
            <p className="text-gray-400 mb-2 text-sm">{asset.description}</p>
            <p className="text-gray-500 mb-4">Token ID: {asset.tokenId}</p>

            <input
              type="text"
              placeholder="Price in ETH"
              value={asset.price || ""}
              onChange={(e) =>
                setAssets(
                  assets.map((a) =>
                    a.tokenId === asset.tokenId
                      ? { ...a, price: e.target.value }
                      : a
                  )
                )
              }
              className="w-full mt-2 p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {asset.approved ? (
              <button
                onClick={() => handleListNFT(asset.tokenId, asset.price || "0")}
                className="w-full mt-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-md transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                List NFT to Marketplace
              </button>
            ) : (
              <button
                onClick={() => handleApproveNFT(asset.tokenId)}
                className="w-full mt-4 py-2 bg-yellow-500 text-white font-semibold rounded-md transition-all duration-300 ease-in-out transform hover:bg-yellow-600"
              >
                Approve Marketplace
              </button>
            )}
          </div>
        ))}
      </div>

      {!assets.length && !status && (
        <p className="text-center text-gray-400 mt-12">
          No assets found. Mint an NFT to see it here.
        </p>
      )}
    </div>
  );
}
