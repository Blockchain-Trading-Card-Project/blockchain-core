import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/home";
import MintNFT from "./pages/MintNFT";
import MyCards from "./pages/mycards";
import Marketplace from "./pages/marketplace";
import { WalletProvider } from "./context/WalletContext";

function App() {
  return (
    <WalletProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mint" element={<MintNFT />} />
          <Route path="/mycards" element={<MyCards />} />
          <Route path="/marketplace" element={<Marketplace />} />
        </Routes>
      </Router>
    </WalletProvider>
  );
}

export default App;
