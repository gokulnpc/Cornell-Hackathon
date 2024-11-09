import "@rainbow-me/rainbowkit/styles.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MyProfile from "./components/MyProfile";
import JobPostForm from "./components/JobPostForm";
import JobList from "./components/JobList";
import JobDetails from "./components/JobDetails";
import JobApplication from "./components/JobApplication";
import AppliedJobs from "./components/AppliedJobs";
import EditProfile from "./components/EditProfile";
import Dashboard from "./components/DashBoard";
import { wagmiConfig } from "./config";
import ChatbotComponent from "./components/Chatbot";
const queryClient = new QueryClient();

export default function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Router>
            <Navbar />
            <div className="pt-5">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/myprofile" element={<MyProfile />} />
                <Route path="/postjob" element={<JobPostForm />} />
                <Route path="/joblist" element={<JobList />} />
                <Route path="/job-details/:jobId" element={<JobDetails />} />
                <Route
                  path="/job-application/:jobId"
                  element={<JobApplication />}
                />
                <Route path="/applied-jobs" element={<AppliedJobs />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/dash-board" element={<Dashboard />} />
              </Routes>
            </div>

            {/* Add the Chatbot component as a floating element */}
            <div
              style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                zIndex: 1000,
              }}
            >
              <ChatbotComponent />
            </div>
          </Router>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
