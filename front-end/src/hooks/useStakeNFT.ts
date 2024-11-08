import { useState } from "react";
import { ethers } from "ethers";
import NFTStaking from "../abi/NFTStaking.json";
import { useWalletClient } from "wagmi";
import NFTCollectionABI from "../abi/NFTCollection.json";
import { useNFTCollectionAddress } from "../hooks/tokenAddress";
export function useStakeNFT(stakingContractAddress: string) {
  const { data: walletClient } = useWalletClient();
  const [status, setStatus] = useState<string>("");
  const nftCollectionAddress = useNFTCollectionAddress();
  const stakeNFT = async (tokenId: string) => {
    if (!walletClient) {
      setStatus("Wallet not connected. Please connect your wallet.");
      return;
    }

    try {
      setStatus("Staking NFT...");

      // Create a provider and signer from the wallet client
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();

      // Initialize the contract
      const stakingContract = new ethers.Contract(
        stakingContractAddress,
        NFTStaking.abi,
        signer
      );

      // Make sure tokenId is formatted correctly for the contract (as a number or BigNumber)
      console.log("Staking NFT with tokenId:", tokenId, nftCollectionAddress);

      // approve the staking contract to transfer the NFT
      const nftContract = new ethers.Contract(
        nftCollectionAddress,
        NFTCollectionABI.abi,
        signer
      );
      console.log("Approving staking contract to transfer NFT...");
      await nftContract.approve(stakingContractAddress, tokenId);
      console.log("Approved staking contract to transfer NFT");
      const tx = await stakingContract.stakeNFT(tokenId);
      setStatus(`Staking in progress... Transaction Hash: ${tx.hash}`);

      // Wait for the transaction to be mined
      await tx.wait();
      setStatus("Staked successfully!");
    } catch (error: any) {
      console.error("Error staking NFT:", error);

      // Improved error message to help with debugging
      setStatus(error.reason || "Staking failed.");
    }
  };

  return { stakeNFT, status };
}
