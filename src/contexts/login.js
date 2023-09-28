import * as fcl from "@onflow/fcl"

fcl.config({
    "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn", // Endpoint set to Testnet
    "discovery.authn.endpoint": "https://fcl-discovery.onflow.org/api/testnet/authn"
  })

export const login = async ()=>{
   const res =  await fcl.logIn()
  return res;
}