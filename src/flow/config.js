import { config } from "@onflow/fcl";

config({
  "app.detail.title": "MintGenius",
  "app.detail.icon": "https://unavatar.io/twitter/muttonia",
  "accessNode.api": "https://rest-testnet.onflow.org", // Endpoint set to Testnet
  "flow.network": "testnet",
  // "accessNode.api": process.env.NEXT_PUBLIC_ACCESS_NODE_API,
  "discovery.wallet": process.env.NEXT_PUBLIC_DISCOVERY_WALLET,
  "0xProfile": process.env.NEXT_PUBLIC_CONTRACT_PROFILE, // The account address where the smart contract lives
})

// fcl.config()
//   .put("accessNode.api", "https://rest-testnet.onflow.org")
//   .put("flow.network", "testnet")