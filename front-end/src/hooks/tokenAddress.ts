import { Address } from "viem";
import { useAccount } from "wagmi";
import {
  nftCollectionAddress,
  stakeAddress,
  pyusdTokenAddress,
  pynftCollectionAddress,
  betterCauseAddress,
  getBaseURL,
  MarketPlaceAddress,
} from "../config";

export function useNFTCollectionAddress(): Address {
  if (!useAccount().chain) return "0x0000000000000000000000000000000000000000";
  const { chain } = useAccount();
  return nftCollectionAddress(chain);
}

export function useStakeAddress(): Address {
  if (!useAccount().chain) return "0x0000000000000000000000000000000000000000";
  const { chain } = useAccount();
  return stakeAddress(chain);
}

export function usePYUSDTokenAddress(): Address {
  if (!useAccount().chain) return "0x0000000000000000000000000000000000000000";
  const { chain } = useAccount();
  return pyusdTokenAddress(chain);
}

export function usePYNFTCollectionAddress(): Address {
  if (!useAccount().chain) return "0x0000000000000000000000000000000000000000";
  const { chain } = useAccount();
  return pynftCollectionAddress(chain);
}

export function useBetterCauseAddress(): Address {
  if (!useAccount().chain) return "0x0000000000000000000000000000000000000000";
  const { chain } = useAccount();
  return betterCauseAddress(chain);
}

export function useBaseURL(): Promise<string> {
  if (!useAccount().chain)
    return Promise.resolve("0x0000000000000000000000000000000000000000");
  const { chain } = useAccount();
  return getBaseURL(chain);
}

export function useMarketPlaceAddress(): Address {
  if (!useAccount().chain) return "0x0000000000000000000000000000000000000000";
  const { chain } = useAccount();
  return MarketPlaceAddress(chain);
}
