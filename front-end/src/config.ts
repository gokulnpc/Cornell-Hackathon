import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { Address, Chain, http } from "viem";
import {
  sepolia,
  localhost,
  skaleNebulaTestnet,
  polygonAmoy,
} from "viem/chains";

export function profileContractAddress(chain: Chain | undefined): Address {
  if (!chain) {
    throw new Error("Chain is undefined. Please connect to a valid network.");
  }

  switch (chain) {
    case sepolia:
    case localhost:
    case skaleNebulaTestnet:
      return "0x2Be1cF0a6a2ca7077F93d43Da530D725A532893c";
    default:
      throw new Error(
        `Profile contract address not configured for chain ${chain.name}`
      );
  }
}

if (!import.meta.env.VITE_WALLETCONNECT_PROJECT_ID) {
  throw new Error("VITE_WALLETCONNECT_PROJECT_ID is not set");
}

if (!import.meta.env.VITE_SEPOLIA_RPC_URL) {
  console.warn("VITE_SEPOLIA_RPC_URL is not set, using public RPC URL");
}

export const wagmiConfig = getDefaultConfig({
  appName: "hackathon",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains: [skaleNebulaTestnet], // Ensure these are correctly imported and configured
  transports: {
    [skaleNebulaTestnet.id]: http(
      "https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet"
    ),
  },
});
