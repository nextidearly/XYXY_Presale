export const TelegramLink = process.env.TELEGRAM || "";
export const GithubLink = process.env.GITHUB || "";
export const DiscordLink = process.env.DISCORD || "";
export const TwitterLink = process.env.TWITTER || "";

export const TREASURY =
  process.env.NEXT_PUBLIC_TREASURY ||
  "0xc1E19a2Ae53B7007608F88621bb7a611A42c3301";
export const TOKEN_PRICE = process.env.NEXT_PUBLIC_PRICE;

export const LOGOS = {
  1: "/assets/eth.png",
  137: "/assets/matic.webp",
  10: "/assets/optimism.png",
  8453: "/assets/base.svg",
  42161: "/assets/arbitrum.png",
  7777777: "https://storage.googleapis.com/conduit-public-dls/CoreZorb.svg",
  56: "/assets/bnb.png",
};

export const START_PRESALE = Number(
  (
    new Date(new Date("9/29/2023 10:00:00 AM EST").toString()).getTime() / 1000
  ).toFixed(0)
);

export const END_PRESALE = Number(
  (
    new Date(new Date("11/29/2023 10:00:00 AM EST").toString()).getTime() / 1000
  ).toFixed(0)
);

export const CURRENCYS = {
  1: 1590,
  137: 0.5,
  10: 1590,
  8453: 1590,
  42161: 1590,
  7777777: 1590,
  56: 212,
};

export const airdropAddresses = [
  0x4f0b947c347f8a8fbca7185e365bb837613835a6,
  0x00ac3ee9d9b33aea35e748bfc7008796cdf914b6,
];
