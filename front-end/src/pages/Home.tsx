// import { useAccount, useWalletClient } from "wagmi";
// import ResumeMatcher from "../components/ResumeMatcher";

// export default function Home() {
//   const { isConnected } = useAccount();
//   const { data: walletClient } = useWalletClient();

//   return (
//     <div>
//       <div className="bg-gradient-to-b from-gray-900 to-gray-800 mt-10 text-white p-10">
//         <div className="text-center mb-12 mt-20">
//           <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 mb-4 drop-shadow-lg">
//             SmartHire
//           </h1>
//           <p className="text-lg text-gray-300 max-w-2xl mx-auto">
//             Welcome to SmartHire, the future of talent acquisition. Our platform
//             leverages the power of blockchain and AI to create a transparent,
//             secure, and efficient hiring process for both job seekers and
//             employers. Connect your wallet to get started and explore a world of
//             opportunities.
//           </p>
//           <ResumeMatcher />
//         </div>
//       </div>
//     </div>
//   );
// }

import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const handleViewJobs = () => {
    navigate("/joblist");
  };

  const handleJoinNow = () => {
    navigate("/register");
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-10 mt-10">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6">Find Your Dream Job Today</h1>
          <p className="text-2xl text-gray-400 mb-8">
            Discover opportunities that match your skills and passion.
          </p>
          <button
            onClick={handleViewJobs}
            className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-lg"
          >
            View Jobs
          </button>
        </div>

        {/* Recent Job Postings */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold mb-6">Recent Job Postings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-2">Full Stack Developer</h3>
              <p className="text-gray-400 mb-2">Location: San Francisco, CA</p>
              <p className="text-gray-400 mb-4">
                Salary: $120,000 - $140,000/year
              </p>
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded">
                Apply Now
              </button>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-2">Product Manager</h3>
              <p className="text-gray-400 mb-2">Location: Remote</p>
              <p className="text-gray-400 mb-4">
                Salary: $100,000 - $130,000/year
              </p>
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded">
                Apply Now
              </button>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-2">UX Designer</h3>
              <p className="text-gray-400 mb-2">Location: New York, NY</p>
              <p className="text-gray-400 mb-4">
                Salary: $90,000 - $110,000/year
              </p>
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded">
                Apply Now
              </button>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold mb-6">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <p className="text-gray-300 mb-4">
                "Thanks to this platform, I found my dream job as a Software
                Engineer in just a month! The process was seamless and
                efficient."
              </p>
              <p className="text-gray-400 font-bold">- Alex Johnson</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <p className="text-gray-300 mb-4">
                "I was able to connect with amazing companies that value my
                skills. The AI cover letter builder was a game-changer!"
              </p>
              <p className="text-gray-400 font-bold">- Maria Lopez</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <p className="text-gray-300 mb-4">
                "Great experience! The VR interview prep made me feel super
                confident before my actual interview. Highly recommend!"
              </p>
              <p className="text-gray-400 font-bold">- James Smith</p>
            </div>
          </div>
        </div>

        {/* Join Now Call to Action */}
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Take the Next Step?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of job seekers who have already found success.
          </p>
          <button
            onClick={handleJoinNow}
            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-lg"
          >
            Join Now
          </button>
        </div>
      </div>
    </div>
  );
}
