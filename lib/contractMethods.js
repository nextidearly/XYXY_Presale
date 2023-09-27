import "@ethersproject/shims";
import { getContractObj } from "./contract";
import { BigNumber, ethers } from "ethers";
import Web3 from "web3";

export async function buy(_amount, provider) {
  const myContract = getContractObj(provider);

  try {
    const amount = Web3.utils.toWei(_amount, 'ether').toString();
    var tx = await myContract.buy(amount,{
      value: amount
    });
    console.log("tx-->", tx);
    return tx;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function claimTokens(provider) {
  const myContract = getContractObj(provider);

  try {
    var tx = await myContract.claimTokens();
    return tx;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function withdrawFunds(provider) {
  const myContract = getContractObj(provider);

  try {
    var tx = await myContract.withdrawFunds();
    return tx;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function tokensOwned(account, provider) {
  const myContract = getContractObj(provider);

  try {
    var tx = await myContract.getTokensOwned(account);
    return tx;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getTokensUnclaimed(account, provider) {
  const myContract = getContractObj(provider);

  try {
    var tx = await myContract.getTokensUnclaimed(account);
    return tx;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getTokensOwned(account, provider) {
  const myContract = getContractObj(provider);

  try {
    var tx = await myContract.getTokensOwned(account);
    return tx;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getAllInfo(provider) {
  const mycontract = getContractObj(provider);
  try {
    const [
      XYXYPerETH,
      Hardcap1,
      saleActive,
      claimActive,
      getTotalTokensSold,
      getXYXYTokensLeft,
      owner
    ] = await Promise.all([
      mycontract.XYXYPerETH(),
      mycontract.getHardCap(),
      mycontract.saleActive(),
      mycontract.claimActive(),
      mycontract.getTotalTokensSold(),
      mycontract.getXYXYTokensLeft(),
      mycontract.owner()
    ]);
    const Hardcap = Web3.utils.fromWei(Hardcap1.toString());
    return {
      XYXYPerETH,
      Hardcap,
      saleActive,
      claimActive,
      getTotalTokensSold,
      getXYXYTokensLeft,
      owner
    };
  } catch (error) {
    console.log(error);
  }
}
