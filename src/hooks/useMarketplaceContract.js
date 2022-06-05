import { useContract } from "./useContract";
import Marketplace from "../contracts/Marketplace.json";
import MarketplaceAddress from "../contracts/MarketplaceAddress.json";

// export interface for smart contract
export const useMarketplaceContract = () =>
  useContract(Marketplace.abi, MarketplaceAddress.Marketplace);
