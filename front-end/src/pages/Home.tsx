import { useAccount, useWalletClient } from "wagmi";
import ResumeMatcher from "../components/ResumeMatcher";

export default function Home() {
  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  return (
    <div>
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 mt-10 text-white p-10">
        <div className="text-center mb-12 mt-20">
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 mb-4 drop-shadow-lg">
            SmartHire
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Welcome to SmartHire, the future of talent acquisition. Our platform
            leverages the power of blockchain and AI to create a transparent,
            secure, and efficient hiring process for both job seekers and
            employers. Connect your wallet to get started and explore a world of
            opportunities.
          </p>
          <ResumeMatcher />
        </div>
      </div>
    </div>
  );
}
