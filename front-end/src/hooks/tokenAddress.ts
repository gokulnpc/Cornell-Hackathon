import { Address } from "viem";
import { useAccount } from "wagmi";
import { profileContractAddress, jobContractAddress } from "../config";

export function useProfileContractAddress(): Address {
  if (!useAccount().chain) return "0x0000000000000000000000000000000000000000";
  const { chain } = useAccount();
  return profileContractAddress(chain);
}

export function useJobContractAddress(): Address {
  if (!useAccount().chain) return "0x0000000000000000000000000000000000000000";
  const { chain } = useAccount();
  return jobContractAddress(chain);
}
