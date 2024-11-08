import { useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { ethers, formatEther, parseEther } from "ethers";
import { useMarketPlaceAddress } from "../hooks/tokenAddress";
import NFTMarketPlaceABI from "../abi/NFTMarketPlace.json";
import CryptoDashboard from "../components/CryptoDashboard";
import ExchangeRateGraph from "../components/ExchangeRateGraph";
interface Asset {
  tokenId: number;
  imageUrl: string;
  name: string;
  description: string;
  price: string;
  seller: string;
}

export default function Home() {
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const marketPlaceAddress = useMarketPlaceAddress();

  const [assets, setAssets] = useState<Asset[]>([]);
  const [status, setStatus] = useState<string>("");

  const fetchListedNFTs = async () => {
    if (!walletClient) {
      setStatus("Wallet not connected.");
      return;
    }

    try {
      setStatus("Loading NFTs available for sale...");
      const provider = new ethers.BrowserProvider(walletClient);
      const contract = new ethers.Contract(
        marketPlaceAddress,
        NFTMarketPlaceABI.abi,
        provider
      );

      const listingCount = await contract.getListingCount();
      let listedAssets: Asset[] = [];

      for (let i = 0; i < listingCount; i++) {
        const listing = await contract.getListingByIndex(i);
        const { seller, price, nftContract, tokenId } = listing;
        const tokenURI = await new ethers.Contract(
          nftContract,
          ["function tokenURI(uint256 tokenId) view returns (string)"],
          provider
        ).tokenURI(tokenId);

        const metadata = await fetch(tokenURI).then((res) => res.json());
        listedAssets.push({
          tokenId: Number(tokenId),
          imageUrl: metadata.image,
          name: metadata.name,
          description: metadata.description,
          price: formatEther(price),
          seller,
        });
      }

      setAssets(listedAssets);
      setStatus("");
    } catch (error) {
      console.error("Error fetching NFTs for sale:", error);
      setStatus("Failed to load NFTs.");
    }
  };

  const handleBuyNFT = async (tokenId: number, price: string) => {
    if (!walletClient) {
      setStatus("Wallet not connected.");
      return;
    }

    try {
      setStatus("Processing purchase...");
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        marketPlaceAddress,
        NFTMarketPlaceABI.abi,
        signer
      );

      const tx = await contract.buyNFT(marketPlaceAddress, tokenId, {
        value: parseEther(price),
      });
      await tx.wait();
      setStatus("Purchase successful!");
      fetchListedNFTs(); // Refresh the list after purchase
    } catch (error) {
      console.error("Error purchasing NFT:", error);
      setStatus("Purchase failed.");
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchListedNFTs();
    }
  }, [isConnected]);

  return (
    <div>
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 mt-10 text-white p-10">
        <div className="text-center mb-12 mt-20">
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 mb-4 drop-shadow-lg">
            NFTVerse
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Discover and purchase exclusive NFTs. Connect your wallet to explore
            the collection and make purchases directly from the marketplace.
          </p>
        </div>

        {/* Tech Stack Section */}
        <div className="text-center mt-12 mb-20">
          <h2 className="text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300 mb-6">
            Our Tech Stack
          </h2>
          <p className="text-lg text-gray-300 max-w-xl mx-auto mb-8">
            We leverage the following tools and technologies to deliver a
            seamless and secure NFT experience.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {/* Replace src with actual image URLs of tools */}
            <img
              src="https://images.ctfassets.net/23fkqdsgbpuj/6xvK4uUNIzll3ZWbNjXkLs/e94f5fd52c6d1b45606c08e69584853c/QuickNode.png"
              alt="Quicknode"
              className="w-20 h-20"
            />
            <img
              src="https://devfolio-prod.s3.ap-south-1.amazonaws.com/company/4498a48b1bda40869136fe306108f288/assets/favicon.png"
              alt="PYUSD"
              className="w-20 h-20"
            />
            <img
              src="https://devfolio-prod.s3.ap-south-1.amazonaws.com/company/319c25777440404582e020e7e0ccd0c4/assets/favicon.png"
              alt="Noves"
              className="w-20 h-20"
            />
            <img
              src="https://devfolio-prod.s3.ap-south-1.amazonaws.com/company/73d176a16fe047afa20b56e36fd607e8/assets/favicon.png"
              alt="Odos"
              className="w-20 h-20"
            />
            <img
              src="https://api.nuget.org/v3-flatcontainer/coinapi.rest.v1/3.2.4/icon"
              alt="CoinAPI"
              className="w-20 h-20"
            />
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqzkeH0Bm4Ay-LVWxVlRSFglR2MroABkrYsg&s"
              alt="CoinPaprika"
              className="w-20 h-20"
            />
            <img
              src="https://banner2.cleanpng.com/20180715/xcj/kisspng-solidity-ethereum-smart-contract-blockchain-comput-programming-language-5b4b4aedae4b16.6414784515316610377139.jpg"
              alt="Solidity"
              className="w-20 h-20"
            />
            <img
              src="https://www.rainbowkit.com/rainbow.svg"
              alt="Rainbow Kit"
              className="w-20 h-20"
            />
            <img
              src="https://prod-coin360-cms.s3.eu-central-1.amazonaws.com/Meta_Mask_e020f427ea.png"
              alt="Metamask"
              className="w-20 h-20"
            />
            <img
              src="https://miro.medium.com/v2/resize:fit:960/1*z7_kWKf-M-b_qSYTM_9b-g.png"
              alt="Ethers"
              className="w-20 h-20"
            />
          </div>
        </div>
      </div>

      <CryptoDashboard />

      <ExchangeRateGraph />
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen text-white p-10">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-semibold text-white mb-6">
            NFTs Available for Sale
          </h2>
          {status && <p className="text-gray-400">{status}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {assets.map((asset) => (
            <div
              key={asset.tokenId}
              className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center transform transition duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-700"
            >
              <img
                src={asset.imageUrl}
                alt={asset.name}
                className="w-full h-48 object-cover rounded-lg mb-4 shadow-md"
              />
              <h3 className="text-2xl font-semibold mb-2 text-white">
                {asset.name}
              </h3>
              <p className="text-gray-300 mb-2 text-sm">{asset.description}</p>
              <p className="text-indigo-400 font-semibold mb-2">
                Price: {asset.price} ETH
              </p>
              <p className="text-gray-500 mb-4">Token ID: {asset.tokenId}</p>
              <button
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
                onClick={() => handleBuyNFT(asset.tokenId, asset.price)}
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>

        {!assets.length && !status && (
          <p className="text-center text-gray-400 mt-12">
            No NFTs are listed for sale at the moment.
          </p>
        )}
      </div>
    </div>
  );
}
