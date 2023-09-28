"use client";
import "./globals.css";
import {useAuth} from "../contexts/AuthContext";
import {login} from "../contexts/login"
import { useState } from "react";

export default function RootLayout({
  children,
}) {
  const [user, setUser] = useState("Login");

  const logIn = async ()=>{
    const res = await login();
    setUser(res.addr)
  }
  
  return (
    <html lang="en">
      <body>
            <div className="w-full h-full flex flex-col justify-start gap-2 items-start">
              <div className="w-full flex flex-row justify-between items-center p-3 z-10 mx-auto bg-blue-200 bg-opacity-60 border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-800 dark:bg-opacity-60 drop-shadow-lg dark:drop-shadow-[0_20px_35px_rgba(255,255,255,0.25)]">
                <div className="flex flex-row gap-3">
                  <img src="./logo.png" alt="logo" className="h-6 w-6" />
                  <p>Mint-Genius: AI-Generated NFT Minting Tool</p>
                </div>
                <button onClick={logIn}>{user}</button>
              </div>
              {children}
            </div>
      </body>
    </html>
  );
}
