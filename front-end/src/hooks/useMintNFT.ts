import axios from "axios";
import { useState } from "react";
import { ethers } from "ethers";
import NFTCollection from "../abi/NFTCollection.json";
import { useWalletClient } from "wagmi";
const QUICKNODE_API_KEY = import.meta.env.VITE_QUICKNODE_API_KEY!;
export function useMintNFT(paymentToken: string) {
  const { data: walletClient } = useWalletClient();
  const [status, setStatus] = useState<string>("");
  const [txHash, setTxHash] = useState<string>("0x123...");

  const mintNFT = async (
    imageUrl: string,
    nftName: string,
    nftDescription: string,
    prompt: string
  ) => {
    if (!walletClient) {
      setStatus("Wallet not connected. Please connect your wallet.");
      return;
    }

    try {
      setStatus("Minting...");

      // Construct metadata
      const metadata = {
        name: nftName || "AI NFT",
        description:
          nftDescription || `An AI-generated NFT based on: ${prompt}`,
        image: imageUrl,
      };
      console.log("metadata", metadata);

      // Send metadata to QuickNode function
      const quickNodeResponse = await axios.post(
        "https://api.quicknode.com/functions/rest/v1/functions/f466105d-9237-476c-bc9f-3e63f92fcc72/call?result_only=true",
        {
          user_data: {
            metadata: metadata,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": QUICKNODE_API_KEY, // Replace with your QuickNode API key
          },
        }
      );

      // Get IPFS hash from QuickNode response
      const ipfsHash = quickNodeResponse.data.IpfsHash;
      console.log("IPFS hash of metadata:", ipfsHash);

      // Interact with the NFT contract to mint the NFT with the IPFS URL
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        paymentToken,
        NFTCollection.abi,
        signer
      );

      const transaction = await contract.publicMint(
        `https://ipfs.io/ipfs/${ipfsHash}`
      );
      setStatus(`Minting in progress... Transaction Hash: ${transaction.hash}`);
      await transaction.wait();
      setStatus(`Minted successfully! Transaction Hash: ${transaction.hash}`);
      setTxHash(transaction.hash);
    } catch (error) {
      console.error("Error minting NFT:", error);
      setStatus("Minting failed.");
    }
  };

  return { mintNFT, status, txHash };
}
