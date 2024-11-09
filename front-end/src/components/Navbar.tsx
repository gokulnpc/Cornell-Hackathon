// src/components/Navbar.tsx
import { NavLink } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  return (
    <nav className="fixed z-50 top-0 left-0 right-0 flex justify-between items-center p-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-md text-white">
      <div className="flex items-center space-x-6 text-lg font-medium">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-white border-b-2 border-purple-500 pb-1"
              : "hover:text-purple-400 transition duration-200"
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/myprofile"
          className={({ isActive }) =>
            isActive
              ? "text-white border-b-2 border-purple-500 pb-1"
              : "hover:text-purple-400 transition duration-200"
          }
        >
          My Profile
        </NavLink>

        <NavLink
          to="/postjob"
          className={({ isActive }) =>
            isActive
              ? "text-white border-b-2 border-purple-500 pb-1"
              : "hover:text-purple-400 transition duration-200"
          }
        >
          Post a Job
        </NavLink>

        <NavLink
          to="/joblist"
          className={({ isActive }) =>
            isActive
              ? "text-white border-b-2 border-purple-500 pb-1"
              : "hover:text-purple-400 transition duration-200"
          }
        >
          Job List
        </NavLink>
      </div>

      <div className="flex items-center">
        <ConnectButton />
      </div>
    </nav>
  );
}
