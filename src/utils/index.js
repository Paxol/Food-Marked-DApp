import { ERC20_DECIMALS } from "./constants";
import BigNumber from "bignumber.js";
import IERC20Token from "../contracts/IERC20Token.json"
import { Marketplace, TokenAddress } from "../contracts/MarketplaceAddress.json"

// format a wallet address
export const truncateAddress = (address) => {
    if (!address) return
    return address.slice(0, 5) + "..." + address.slice(address.length - 4, address.length);
}

// convert from big number
export const formatBigNumber = (num, decimals = ERC20_DECIMALS) => {
    if (!num) return
    if (!num.shiftedBy) return "";

    return num.shiftedBy(-decimals).toFixed(2);
}

// convert to big number
export const numberToBigNumber = (num, decimals = ERC20_DECIMALS) => {
    if (!num) return
    return new BigNumber(num).shiftedBy(decimals);
}

// approve token spending
export const approve = async (kit, price = "0xffffffffffffffffffffffffffffffffffffffff") => {
    const tokenContract = new kit.web3.eth.Contract(IERC20Token.abi, TokenAddress);

    const result = await tokenContract.methods.approve(Marketplace, price).send({ from: kit.defaultAccount });
    return result;
}

// get token spendig allowance
export const getAllowance = async (kit) => {
    const tokenContract = new kit.web3.eth.Contract(IERC20Token.abi, TokenAddress);

    const allowance = await tokenContract.methods.allowance(kit.defaultAccount, Marketplace).call();
    return allowance;
}