import { useAccount } from "wagmi";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { isConnected } = useAccount();
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  if (!isConnected) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-10 mt-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Connect Your Wallet</h1>
          <p className="text-lg text-gray-300">
            Please connect your wallet to view your dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-10 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Profile Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-4">Welcome, Test User</h2>
            <p className="text-gray-400 mb-2">Email: test@mail.com</p>
            <p className="text-gray-300 mb-4">
              Bio: Passionate about technology and innovation.
            </p>
          </div>
          <button
            onClick={handleEditProfile}
            className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded"
          >
            Edit Profile
          </button>
        </div>

        {/* Skill Meter & Token Rewards */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
          <h2 className="text-3xl font-bold mb-4">Skill Meter & Rewards</h2>
          <div className="mb-4">
            <p className="text-gray-400">JavaScript Proficiency</p>
            <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
              <div
                className="bg-purple-600 h-4 rounded-full"
                style={{ width: "80%" }}
              ></div>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-gray-400">React Skills</p>
            <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
              <div
                className="bg-blue-500 h-4 rounded-full"
                style={{ width: "70%" }}
              ></div>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-gray-400">Solidity Development</p>
            <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
              <div
                className="bg-green-500 h-4 rounded-full"
                style={{ width: "60%" }}
              ></div>
            </div>
          </div>
          <p className="text-gray-400 mt-4">
            Token Rewards Earned: <span className="font-bold">150</span> Tokens
          </p>
        </div>

        {/* Job Applications */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
          <h2 className="text-3xl font-bold mb-4">Job Applications</h2>
          <p className="text-gray-400">
            You have applied to 5 jobs. 3 are in review, and 1 is awaiting your
            response.
          </p>
        </div>

        {/* AI Cover Letter Builder */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
          <h2 className="text-3xl font-bold mb-4">AI Cover Letter Builder</h2>
          <p className="text-gray-400 mb-4">
            Generate a professional cover letter instantly using our AI-powered
            tool.
          </p>
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded">
            Build Cover Letter
          </button>
        </div>

        {/* AI Coach & VR Interview Prep */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
          <h2 className="text-3xl font-bold mb-4">
            AI Coach & VR Interview Prep
          </h2>
          <p className="text-gray-400 mb-4">
            Prepare for your interviews with AI coaching and virtual reality
            simulations.
          </p>
          <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded">
            Start Interview Prep
          </button>
        </div>

        {/* Schej - Schedule Meetings */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col">
          <h2 className="text-3xl font-bold mb-4">Schej - Schedule Meetings</h2>
          <p className="text-gray-400 mb-4">
            Easily schedule meetings for your interview process directly from
            your dashboard.
          </p>
          <button className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded">
            Schedule a Meeting
          </button>
        </div>
      </div>
    </div>
  );
}
