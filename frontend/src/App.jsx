import { useState } from "react";
import Converter from "./components/Converter";
import MarketPanel from "./components/MarketPanel";
import "./App.css";

function App() {
  // Shared currency pair — drives both Converter and MarketPanel chart
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");

  return (
    <div className="app-root">

      {/* Decorative ambient orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Top header — icon only */}
      <header className="app-header">
        <span className="logo-icon">💱</span>
      </header>

      {/* Main panels */}
      <main className="app-main">
        <Converter from={from} to={to} setFrom={setFrom} setTo={setTo} />
        <MarketPanel from={from} to={to} />
      </main>

    </div>
  );
}

export default App;