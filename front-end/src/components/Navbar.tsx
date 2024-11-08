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
          to="/mint"
          className={({ isActive }) =>
            isActive
              ? "text-white border-b-2 border-purple-500 pb-1"
              : "hover:text-purple-400 transition duration-200"
          }
        >
          Mint NFT
        </NavLink>
        <NavLink
          to="/mint-with-pyusd"
          className={({ isActive }) =>
            isActive
              ? "text-white border-b-2 border-purple-500 pb-1"
              : "hover:text-purple-400 transition duration-200"
          }
        >
          Mint NFT with PYUSD
        </NavLink>
        <NavLink
          to="/odos-api"
          className={({ isActive }) =>
            isActive
              ? "text-white border-b-2 border-purple-500 pb-1"
              : "hover:text-purple-400 transition duration-200"
          }
        >
          Odos Insights
        </NavLink>

        <NavLink
          to="/noves-check"
          className={({ isActive }) =>
            isActive
              ? "text-white border-b-2 border-purple-500 pb-1"
              : "hover:text-purple-400 transition duration-200"
          }
        >
          Noves Check
        </NavLink>

        <NavLink
          to="/better-cause"
          className={({ isActive }) =>
            isActive
              ? "text-white border-b-2 border-purple-500 pb-1"
              : "hover:text-purple-400 transition duration-200"
          }
        >
          Better Cause
        </NavLink>
        <NavLink
          to="/my-assets"
          className={({ isActive }) =>
            isActive
              ? "text-white border-b-2 border-purple-500 pb-1"
              : "hover:text-purple-400 transition duration-200"
          }
        >
          My Assets
        </NavLink>
      </div>
      <div className="flex items-center">
        <ConnectButton />
      </div>
    </nav>
  );
}
