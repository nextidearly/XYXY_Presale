import "@ethersproject/shims";
import { getContractObjStaking } from "./contract";
import Web3 from "web3";

export async function earned(account, provider) {
  const myContract = getContractObjStaking(provider);

  try {
    const earned = await myContract.earned(account);
    return earned;
  } catch (error) {
    console.log(error);
    return 0;
  }
}
export async function checkBalance(account, provider){
  const myContract = getContractObjStaking(provider);
    
  try{
    const balance = await myContract.balanceOf(account);
    return balance;
  } catch(e){
    console.log(e);
    return 0;
  }
}

export async function Stake(amount, provider) {
    const myContract = getContractObjStaking(provider);
    try {
      var tx = await myContract.stake(amount);
      return tx;
    } catch (error) {
      console.log(error);
      return false;
    }
}

export async function unStake(amount, provider) {
  const myContract = getContractObjStaking(provider);
  try {
    var tx = await myContract.withdraw(amount);
    return tx;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function claim(provider) {
  const myContract = getContractObjStaking(provider);

  try {
    var tx = await myContract.getReward();
    return tx;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getAllInfo(provider) {
  const mycontract = getContractObjStaking(provider);
  try {
    const [
      totalStaked,
      duration,
      finish
    ] = await Promise.all([
      mycontract.totalSupply(),
      mycontract.duration(),
      mycontract.finishAt(),
    ]);
    const total = Web3.utils.fromWei(totalStaked.toString())
    const finishdate = new Date(finish.toString() * 1000)
    return {
      total,
      duration,
      finishdate
    };
  } catch (error) {
    console.log(error);
  }
}
