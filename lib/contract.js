import { Contract } from '@ethersproject/contracts'
const abi = require('./Contract/abi.json')
const airdrop_abi = require('./Contract/airdrop_abi.json')
const staking_abi = require('./Contract/staking_abi.json')
const presaleAddress = '0x3cB6CeEF116aCda0d39654BD60768683d7D989e5'
const airdropAddress = '0xf2791087D9e9b86D1c4235aCee7f54F5B2bEC453'
const stakingAddress = '0xFA50C47fFBF6E6780ad37b929C4A0CA5564C0086'
// const airdropAddress = "0x549bB9a7D349fC30862c5FA5D3D5D81C87Ab6057"
import { ethers } from 'ethers'

export function truncateWalletString(walletAddress) {
  if (!walletAddress) return walletAddress
  const lengthStr = walletAddress.length
  const startStr = walletAddress.substring(0, 7)
  const endStr = walletAddress.substring(lengthStr - 7, lengthStr)
  return `${startStr}...${endStr}`
}

export function truncateHashString(txhash) {
  if (!txhash) return txhash
  const lengthStr = txhash.length
  const startStr = txhash.substring(0, 10)
  const endStr = txhash.substring(lengthStr - 10, lengthStr)
  return `${startStr}...${endStr}`
}

export function getContractObj(provider) {
  return new Contract(presaleAddress, abi, provider)
}

export function getContractObjAirdrop(_provider) {
  return new Contract(airdropAddress, airdrop_abi, _provider)
}

export function getContractObjStaking(_provider) {
  return new Contract(stakingAddress, staking_abi, _provider)
}

export const shorter = (str) => (str?.length > 8 ? `${str.slice(0, 6)}...${str.slice(-4)}` : str)
