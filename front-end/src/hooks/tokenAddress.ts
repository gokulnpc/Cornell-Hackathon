import { Address } from "viem";
import { useAccount } from "wagmi";
import { profileContractAddress } from "../config";

export function useProfileContractAddress(): Address {
  if (!useAccount().chain) return "0x0000000000000000000000000000000000000000";
  const { chain } = useAccount();
  return profileContractAddress(chain);
}
