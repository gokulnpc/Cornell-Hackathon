import { useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { ethers } from "ethers";
import { useProfileContractAddress } from "../hooks/tokenAddress";
import ProfileContractABI from "../abi/ProfileContract.json";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const profileContractAddress = useProfileContractAddress();
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [updating, setUpdating] = useState<boolean>(false);

  const handleUpdateProfile = async () => {
    if (isConnected && walletClient) {
      setUpdating(true);
      try {
        const provider = new ethers.BrowserProvider(walletClient);
        const signer = await provider.getSigner();
        const profileContract = new ethers.Contract(
          profileContractAddress,
          ProfileContractABI.abi,
          signer
        );

        const tx = await profileContract.updateProfile(name, email, bio);
        await tx.wait();

        setStatus("Profile updated successfully!");
        navigate("/myprofile");
      } catch (error) {
        console.error("Failed to update profile:", error);
        setStatus("Failed to update profile. Please try again later.");
      } finally {
        setUpdating(false);
      }
    } else {
      setStatus("Please connect your wallet to update your profile.");
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-10 mt-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Connect Your Wallet</h1>
          <p className="text-lg text-gray-300">
            Please connect your wallet to edit your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-10 mt-10">
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Edit Profile</h1>
        {status && <p className="text-green-500 mb-4">{status}</p>}
        <div className="mb-4">
          <label className="block text-lg mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg mb-2">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
        </div>
        <button
          onClick={handleUpdateProfile}
          disabled={updating}
          className={`mt-4 px-6 py-2 ${
            updating ? "bg-gray-600" : "bg-purple-600 hover:bg-purple-700"
          } text-white font-bold rounded`}
        >
          {updating ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
}
