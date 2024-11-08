import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { Address, Chain, http } from "viem";
import { skaleNebulaTestnet } from "viem/chains";

export function profileContractAddress(chain: Chain | undefined): Address {
  if (!chain) {
    throw new Error("Chain is undefined. Please connect to a valid network.");
  }

  switch (chain) {
    case skaleNebulaTestnet:
      return "0xF3ead142EB1dec8A5A33D1D9aaB3436F2186D3D7";
    default:
      throw new Error(
        `Profile contract address not configured for chain ${chain.name}`
      );
  }
}

export function jobContractAddress(chain: Chain | undefined): Address {
  if (!chain) {
    throw new Error("Chain is undefined. Please connect to a valid network.");
  }

  switch (chain) {
    case skaleNebulaTestnet:
      return "0xBd03FE76734Eb36500E50a8Cb1c0450689554C9c";
    default:
      throw new Error(
        `Job contract address not configured for chain ${chain.name}`
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
