import React, { createContext, useState, useContext } from "react";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState("");

  return (
    <WalletContext.Provider value={{ walletAddress, setWalletAddress }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used within WalletProvider");
  return context;
};
