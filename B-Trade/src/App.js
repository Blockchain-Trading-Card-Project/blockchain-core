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
      <div className="min-h-screen bg-slate-950 relative overflow-x-hidden">
        {/* Animated background gradients */}
        <div className="fixed inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-600 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-600 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Main content */}
        <div className="relative z-10">
          <Router>
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/mint" element={<MintNFT />} />
                <Route path="/mycards" element={<MyCards />} />
                <Route path="/marketplace" element={<Marketplace />} />
              </Routes>
            </main>
          </Router>
        </div>
      </div>
    </WalletProvider>
  );
}

export default App;