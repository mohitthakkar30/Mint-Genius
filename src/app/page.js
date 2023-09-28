"use client";
import HamsterLoader from "@/components/HamsterLoader";
import SplineObject from "@/components/SplineObject";
import { Inter } from "next/font/google";
import Confetti from "react-confetti";
import { useState } from "react";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { Configuration, OpenAIApi } from "openai";
import Link from "next/link";
import * as fcl from "@onflow/fcl"
import { login } from "@/contexts/login";
import {mintNFT} from "../flow/cadence/transactions/mint_nfts"
import * as types from "@onflow/types";
import getTotalSupply from "../flow/cadence/scripts/getTotalSupply"

fcl.config({
  "flow.network": "testnet",
  "app.detail.title": "Mint-Genius",
  "accessNode.api": "https://rest-testnet.onflow.org",
  "app.detail.icon": "https://bafybeif5epbtdbks2rfwoowjyxmkc7j2x5gqkdp5nwhmdkipbzsypagfp4.ipfs.nftstorage.link/68.png",
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn",
});

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  const [name, setName] = useState("Your AI Mint");
  const [desc, setDesc] = useState("Your AI Mint");
  const [metadata, setMetadata] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(0);
  const [explosion, setExplosion] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [forged, setForged] = useState(null);
  const [user, setUser] = useState();
  const [url, setUrl] = useState();

  const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  const logIn = async ()=>{
    fcl.authenticate();
    const res = await login();
    setUser(res.addr)
    return res.addr;
  }
  
  const mint = async (metadata)=>{
    const userAddress = logIn()
    setLoading(3);

    let _totalSupply;
    try {
      _totalSupply = await fcl.query({
        cadence: `${getTotalSupply}`,
      });
    } catch (err) {
      console.log(err);
    }

    const _id = parseInt(_totalSupply) + 1;


    try {
      const transactionId = await fcl.mutate({
        cadence: `${mintNFT}`,
        args: (arg, t) => [
          arg(user, types.Address), //address to which the NFT should be minted
          arg("MintGenius # " + _id.toString(), types.String),
          arg("MintGenius NFTs on the Flow blockchain", types.String), // Description
          arg(metadata,
            types.String
          ),
        ],
        proposer: fcl.currentUser,
        payer: fcl.currentUser,
        limit: 99,
      });
      console.log("Minting NFT now with transaction ID", transactionId);
      const transaction = await fcl.tx(transactionId).onceSealed();
      console.log(
        "Testnet explorer link:",
        `https://testnet.flowscan.org/transaction/${transactionId}`
      );
      console.log(transaction);
      setLoading(0);
      alert("NFT minted successfully!");
    } catch (error) {
      console.log(error);
      alert("Click Login to Connect Wallet")
      setLoading(0);
      // alert("Error minting NFT, please check the console for error details!");
    }
  }

  const createImage = async () => {

    console.log("Creating Image");
    setLoading(1);
    try {
      const response = await openai.createImage({
        prompt: desc,
        n: 1,
        size: "1024x1024",
      });
      console.log(response);
      const image_url = response.data.data[0].url;
      console.log(image_url);
      setImage(image_url);
      setDisabled(false);
      setForged(null);
      return image_url;
    } catch (e) {
      alert(e);
      console.log(e);
    }
  };

  const uploading = async (e) => {
    console.log(e);
    setLoading(2);
    const storage = new ThirdwebStorage();
    const url = await storage.upload(e);
    console.log(url);
    setLoading(0);
    setUrl(url)
    return url;
  };

  const handleSendTransaction = async () => {
        logIn()
        const metadata = await uploading(image);
        mint(metadata)
    };

  return (
    <div className="w-full h-full flex flex-col justify-between items-center py-10">
      <SplineObject scene="https://prod.spline.design/LM16YpEsPBwXzoug/scene.splinecode" />
      {(
        <div className="w-full h-4/5 flex flex-row bg-black/20 md:w-2/3 gap-5 p-10 rounded-md z-1 fixed">
          <div className="w-full h-full flex flex-col gap-5 justify-evenly text-lg">
            <h1 className="text-5xl font-semibold text-white">MintGenius</h1>
            <input
              className="px-5 py-3 rounded-lg mt-0 text-gray-800 shadow-sm placeholder:text-gray-500 placeholder:dark:text-gray-200 dark:text-white"
              id="name"
              name="name"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              className="px-5 py-3 rounded-lg mt-0 text-gray-800 shadow-sm placeholder:text-gray-500 placeholder:dark:text-gray-200 dark:text-white"
              id="desc"
              name="desc"
              rows={8}
              placeholder="Describe the image you want"
              onChange={(e) => setDesc(e.target.value)}
            />
            <button
              className="bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg"
              onClick={() => {
                createImage();
              }}
            >
              Generate {!disabled && "new"} AI Art
            </button>
            {/* <button onClick={awesome}>Tester</button> */}
            {forged ? (
              <Link href={forged}>
                <div className="bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg disabled:bg-gray-500 flex justify-center">
                  View on Block Explorer
                </div>
              </Link>
            ) : (
              <button
                className="bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg disabled:bg-gray-500"
                onClick={handleSendTransaction}
                disabled={disabled}
              >
                Mint
              </button>
            )}
          </div>
          <img
            src={image || "./out.png"}
            onLoad={() => setLoading(0)}
            alt="ai-art"
          />
        </div>
      )}
      {loading === 1 && (
        <div className="w-1/3 h-1/3 flex justify-center items-center absolute top-1/3 left-1/3 z-10">
          <HamsterLoader loaderTitle="Forging the Image" />
        </div>
      )}
      {loading === 2 && (
        <div className="w-1/3 h-1/3 flex justify-center items-center absolute top-1/3 left-1/3 z-10">
          <HamsterLoader loaderTitle="Uploading to IPFS" />
        </div>
      )}
       {loading === 3 && (
        <div className="w-1/3 h-1/3 flex justify-center items-center absolute top-1/3 left-1/3 z-10">
          <HamsterLoader loaderTitle="Minting NFT" />
        </div>
      )}
      {explosion && <Confetti className="fullscreen" />}
    </div>
  );
}
