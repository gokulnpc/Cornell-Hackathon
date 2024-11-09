import { useAccount, useWalletClient } from "wagmi";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useProfileContractAddress } from "../hooks/tokenAddress";
import ProfileContractABI from "../abi/ProfileContract.json";
import { useNavigate } from "react-router-dom";

interface ProfileData {
  name: string;
  email: string;
  bio: string;
}

export default function MyProfile() {
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const profileContractAddress = useProfileContractAddress();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (isConnected && walletClient) {
        try {
          console.log("Fetching profile...");
          console.log("Profile contract address:", profileContractAddress);
          const provider = new ethers.BrowserProvider(walletClient);
          const signer = await provider.getSigner();
          const profileContract = new ethers.Contract(
            profileContractAddress,
            ProfileContractABI.abi,
            signer
          );
          console.log("Profile contract:", profileContract);

          const profileData = await profileContract.getProfile();
          console.log("Profile data:", profileData);
          setProfile({
            name: profileData[0],
            email: profileData[1],
            bio: profileData[2],
          });
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          setStatus("Failed to load profile. Please try again later.");
        }
      }
    };
    fetchProfile();
  }, [isConnected, walletClient, profileContractAddress]);

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  if (!isConnected) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-10 mt-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Connect Your Wallet</h1>
          <p className="text-lg text-gray-300">
            Please connect your wallet to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-10 mt-10">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">My Profile</h1>
        {status && <p className="text-red-500 mb-4">{status}</p>}
        {profile ? (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-2">{profile.name}</h2>
            <p className="text-gray-400 mb-2">Email: {profile.email}</p>
            <p className="text-gray-300 mb-4">Bio: {profile.bio}</p>
            <button
              onClick={handleEditProfile}
              className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <p className="text-gray-400">Loading profile...</p>
        )}
      </div>
    </div>
  );
}
