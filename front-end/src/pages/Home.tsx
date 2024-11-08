import { useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { ethers, formatEther, parseEther } from "ethers";
import { useMarketPlaceAddress } from "../hooks/tokenAddress";
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
    </div>
  );
}
