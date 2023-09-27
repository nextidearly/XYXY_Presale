import "@ethersproject/shims";
import { getContractObjAirdrop } from "./contract";
import Web3 from "web3";

export async function checkEligibility(account, round, provider) {
  const myContract = getContractObjAirdrop(provider);

  try {
    const eligibility = await myContract.getUserInfo(account, round);
    return eligibility;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function GetuserTiers(account, provider) {
  const myContract = getContractObjAirdrop(provider);
  try {
    let userTiers = [];
    userTiers = await myContract.getUserTiers(account);
    return userTiers;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function claim(provider) {
  const myContract = getContractObjAirdrop(provider);

  try {
    var tx = await myContract.claim();
    return tx;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getAllInfo(provider) {
  const mycontract = getContractObjAirdrop(provider);
  try {
    const [
      claimActive,
      currentRound,
      Tiers,
      owner
    ] = await Promise.all([
      mycontract.isClaimActive(),
      mycontract.currentRound(),
      mycontract.getTiers(),
      mycontract.owner()
    ]);
    return {
      claimActive,
      currentRound,
      Tiers,
      owner
    };
  } catch (error) {
    console.log(error);
  }
}
