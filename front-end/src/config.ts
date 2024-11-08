import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { Address, Chain, http } from "viem";
import {
  sepolia,
  localhost,
  skaleNebulaTestnet,
  polygonAmoy,
} from "viem/chains";

export function pyusdTokenAddress(chain: Chain | undefined): Address {
  if (!chain) {
    throw new Error("Chain is undefined. Please connect to a valid network.");
  }

  switch (chain) {
    case sepolia:
    case localhost:
    case skaleNebulaTestnet:
      return "0x546ee037AB8647c985B8F217EE7dfce9bf334978";
    default:
      throw new Error(
        `Payment token address not configured for chain ${chain.name}`
      );
  }
}

export function pynftCollectionAddress(chain: Chain | undefined): Address {
  if (!chain) {
    throw new Error("Chain is undefined. Please connect to a valid network.");
  }

  switch (chain) {
    case sepolia:
    case localhost:
    case skaleNebulaTestnet:
      return "0x43A80ce3FDCd80F71032174e8AD6bB73392C8717";
    default:
      throw new Error(
        `NFT collection address not configured for chain ${chain.name}`
      );
  }
}

export function nftCollectionAddress(chain: Chain | undefined): Address {
  if (!chain) {
    throw new Error("Chain is undefined. Please connect to a valid network.");
  }

  switch (chain) {
    case sepolia:
    case localhost:
    case polygonAmoy:
      return "0xACEBf59C1bF0FdA1e5B936034aE6b57fB82ab770";
    case skaleNebulaTestnet:
      return "0x7C476D3335E187606c4323e2c55C188Bf9B37D25";
    default:
      throw new Error(
        `NFT collection address not configured for chain ${chain.name}`
      );
  }
}

export function betterCauseAddress(chain: Chain | undefined): Address {
  if (!chain) {
    throw new Error("Chain is undefined. Please connect to a valid network.");
  }

  switch (chain) {
    case sepolia:
    case localhost:
    case polygonAmoy:
      return "0x823e797e0942801361bE2710e5D230Ed93AFB450";
    case skaleNebulaTestnet:
      return "0x4EAC547Dfc9A79c73A4B28731DF7023f0FA764DD";
    default:
      throw new Error(
        `NFT collection address not configured for chain ${chain.name}`
      );
  }
}

export function MarketPlaceAddress(chain: Chain | undefined): Address {
  if (!chain) {
    throw new Error("Chain is undefined. Please connect to a valid network.");
  }

  switch (chain) {
    case sepolia:
    case localhost:
    case polygonAmoy:
      return "0x823e797e0942801361bE2710e5D230Ed93AFB450";
    case skaleNebulaTestnet:
      return "0x8F0F658182D86cc3C7DcBe318F05B47EfaA0Eb9C";
    default:
      throw new Error(
        `NFT collection address not configured for chain ${chain.name}`
      );
  }
}

export function stakeAddress(chain: Chain | undefined): Address {
  if (!chain) {
    throw new Error("Chain is undefined. Please connect to a valid network.");
  }

  switch (chain) {
    case sepolia:
    case localhost:
    case polygonAmoy:
      return "0xbd88E8CDAE3b6EcfD9513182288c5A95271d2386";
    case skaleNebulaTestnet:
      return "0x62DC0326cf4DE0b6e8c8cEd6B0e083901da6dD80";
    default:
      throw new Error(`Stake address not configured for chain ${chain.name}`);
  }
}

export function getBaseURL(chain: Chain | undefined): Promise<string> {
  if (!chain) {
    throw new Error("Chain is undefined. Please connect to a valid network.");
  }

  switch (chain) {
    case sepolia:
    case localhost:
    case polygonAmoy:
      return Promise.resolve("https://api.bettercause.io");
    case skaleNebulaTestnet:
      return Promise.resolve(
        "https://internal.explorer.testnet.skalenodes.com:10001/api/v2/transactions/"
      );
    default:
      throw new Error(`Stake address not configured for chain ${chain.name}`);
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
