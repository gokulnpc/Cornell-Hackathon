import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";

interface Job {
  jobId: number;
  title: string;
  description: string;
  salary: string;
  location: string;
  employer: string;
  isOpen: boolean;
}

export default function JobDetails() {
  const { isConnected } = useAccount();
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<Job | null>({
    jobId: 1,
    title: "Software Developer",
    description:
      "We are looking for a passionate Software Developer to join our growing team. The ideal candidate should have a strong background in software development, experience with various technologies, and the ability to work in a dynamic, fast-paced environment. You will be responsible for developing scalable software solutions, working on both the front-end and back-end, and collaborating closely with designers and product managers. This position offers H1B sponsorship to qualified candidates.\n\nResponsibilities:\n- Design, develop, and maintain software applications.\n- Write clean and efficient code.\n- Participate in code reviews and collaborate with team members.\n- Work on projects from conception through to production deployment.\n\nTech Stack Required:\n- Proficiency in JavaScript/TypeScript.\n- Experience with front-end frameworks such as React.\n- Strong knowledge of Node.js for back-end development.\n- Familiarity with Solidity and blockchain concepts.\n- RESTful APIs, GraphQL, and cloud services such as AWS.",
    salary: "$100,000/year",
    location: "Remote",
    employer: "0xAbc...1234",
    isOpen: true,
  });
  const navigate = useNavigate();

  const handleApplyClick = () => {
    navigate(`/job-application/${jobId}`);
  };

  if (!isConnected) {
    return (
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-10 mt-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Connect Your Wallet</h1>
          <p className="text-lg text-gray-300">
            Please connect your wallet to view job details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-10 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Job Overview */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-6">Job Overview</h1>
          <div className="mb-4">
            <h2 className="text-3xl font-bold mb-2">{job?.title}</h2>
            <p className="text-gray-300 mb-4">{job?.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded">
              <p className="text-gray-400">Location</p>
              <p className="text-white font-bold">{job?.location}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <p className="text-gray-400">Salary</p>
              <p className="text-white font-bold">{job?.salary}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <p className="text-gray-400">Employer</p>
              <p className="text-white font-bold">{job?.employer}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <p className="text-gray-400">Status</p>
              <p className="text-white font-bold">
                {job?.isOpen ? "Open" : "Closed"}
              </p>
            </div>
          </div>
          <div className="bg-gray-700 p-4 rounded mt-6">
            <p className="text-gray-400">H1B Sponsorship</p>
            <p className="text-white font-bold">
              Available for qualified candidates
            </p>
          </div>
          <div className="bg-gray-700 p-4 rounded mt-6">
            <h2 className="text-3xl font-bold mb-4">Tech Stack Required</h2>
            <ul className="list-disc ml-6">
              <li className="text-white mb-2">JavaScript/TypeScript</li>
              <li className="text-white mb-2">
                React for front-end development
              </li>
              <li className="text-white mb-2">
                Node.js for back-end development
              </li>
              <li className="text-white mb-2">
                Solidity and blockchain technologies
              </li>
              <li className="text-white mb-2">RESTful APIs and GraphQL</li>
              <li className="text-white mb-2">Git for version control</li>
              <li className="text-white">AWS or Azure (optional)</li>
            </ul>
          </div>
          {job?.isOpen && (
            <button
              onClick={handleApplyClick}
              className="mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded"
            >
              Apply for Job
            </button>
          )}
        </div>

        {/* Analytics and Application Details */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold mb-6">
            Analytics & Application Details
          </h1>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-700 p-4 rounded">
              <p className="text-gray-400">Total Applicants</p>
              <h2 className="text-3xl font-bold">288</h2>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <p className="text-gray-400">Shortlisted Candidates</p>
              <h2 className="text-3xl font-bold">120</h2>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <p className="text-gray-400">Hired Candidates</p>
              <h2 className="text-3xl font-bold">60</h2>
            </div>
            <div className="bg-gray-700 p-4 rounded">
              <p className="text-gray-400">Gender Diversity Ratio</p>
              <h2 className="text-3xl font-bold">72.45%</h2>
            </div>
          </div>
          <div className="bg-gray-700 p-4 rounded mb-6">
            <p className="text-gray-400">Applications Received by Department</p>
            <div className="w-full h-48 mt-2 rounded-lg bg-gray-600 flex items-end justify-around">
              <div className="w-1/5 h-32 bg-purple-500 mx-2 rounded-t-md">
                <p className="text-center text-sm text-white mt-2">IT</p>
              </div>
              <div className="w-1/5 h-20 bg-purple-300 mx-2 rounded-t-md">
                <p className="text-center text-sm text-white mt-2">Finance</p>
              </div>
              <div className="w-1/5 h-40 bg-purple-700 mx-2 rounded-t-md">
                <p className="text-center text-sm text-white mt-2">HR</p>
              </div>
              <div className="w-1/5 h-24 bg-purple-400 mx-2 rounded-t-md">
                <p className="text-center text-sm text-white mt-2">Marketing</p>
              </div>
              <div className="w-1/5 h-28 bg-purple-600 mx-2 rounded-t-md">
                <p className="text-center text-sm text-white mt-2">Sales</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-700 p-4 rounded">
            <p className="text-gray-400">Current Vacancies</p>
            <ul className="list-disc ml-6 mt-4">
              <li className="text-white mb-2">
                Web Development - 2/3 recruited
              </li>
              <li className="text-white mb-2">UI/UX Design - 4/6 recruited</li>
              <li className="text-white mb-2">
                Content Writer - 4/6 recruited
              </li>
              <li className="text-white mb-2">
                Graphic Design - 3/5 recruited
              </li>
            </ul>
          </div>

          {/* Recruitment Funnel */}
          <div className="bg-gray-700 p-4 rounded mt-6">
            <p className="text-gray-400">Recruitment Funnel</p>
            <div className="w-full bg-gray-600 h-64 mt-2 rounded-lg flex items-center justify-between p-4">
              <div className="w-1/4 text-center">
                <p className="text-white mb-2">Applied</p>
                <div className="h-12 bg-purple-500 rounded-t-lg"></div>
                <p className="text-white mt-2">41.3%</p>
              </div>
              <div className="w-1/4 text-center">
                <p className="text-white mb-2">Screened</p>
                <div className="h-8 bg-purple-400 rounded-t-lg"></div>
                <p className="text-white mt-2">31.2%</p>
              </div>
              <div className="w-1/4 text-center">
                <p className="text-white mb-2">Interviewed</p>
                <div className="h-6 bg-purple-300 rounded-t-lg"></div>
                <p className="text-white mt-2">19.5%</p>
              </div>
              <div className="w-1/4 text-center">
                <p className="text-white mb-2">Hired</p>
                <div className="h-4 bg-purple-200 rounded-t-lg"></div>
                <p className="text-white mt-2">8.0%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Applicant Details Table max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 */}

      <div className="mt-10 mx-autobg-gray-800 p-6 rounded-lg shadow-lg max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Applicant Details</h1>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-4 text-gray-400">Applicant Name</th>
              <th className="p-4 text-gray-400">ETH Address</th>
              <th className="p-4 text-gray-400">Job Title</th>
              <th className="p-4 text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-700">
              <td className="p-4 text-white">Bessie Cooper</td>
              <td className="p-4 text-white">0xA1b...4C67</td>
              <td className="p-4 text-white">UI/UX Designer</td>
              <td className="p-4 text-green-500">Hired</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="p-4 text-white">Theresa Webb</td>
              <td className="p-4 text-white">0xB2d...7D89</td>
              <td className="p-4 text-white">Developer</td>
              <td className="p-4 text-yellow-400">Applied</td>
            </tr>
            <tr className="border-b border-gray-700">
              <td className="p-4 text-white">Darrell Steward</td>
              <td className="p-4 text-white">0xC3e...8E90</td>
              <td className="p-4 text-white">Marketing</td>
              <td className="p-4 text-blue-400">Offer Initiated</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
