import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { WalletLinkConnector } from '@web3-react/walletlink-connector'

const metaMask = new InjectedConnector({
  supportedChainIds: [324],
});

const walletConnect = new WalletConnectConnector({
  rpc: { 1: "https://mainnet.era.zksync.io"},
  bridge: "https://bridge.walletconnect.org/",
  qrcode: true,
  pollingInterval: 15000,
  supportedChainIds: [324],
});


 const walletlink = new WalletLinkConnector({
  url: "https://mainnet.era.zksync.io",
  appName: 'Peekaboos Universe',
  supportedChainIds: [324]
})
export { metaMask, walletConnect,walletlink };
