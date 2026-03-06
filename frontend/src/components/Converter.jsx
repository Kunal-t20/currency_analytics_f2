import { useState, useEffect } from "react";
import { convertCurrency, getCurrencies } from "../api/currencyApi";
import CurrencySelect from "./CurrencySelect";
import "./Converter.css";

function Converter({ from, to, setFrom, setTo }) {
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);
  const [rate, setRate] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);



  useEffect(() => {
    getCurrencies()
      .then(data => setCurrencies(Object.keys(data)))
      .catch(console.error);

    const saved = JSON.parse(localStorage.getItem("conversionHistory"));
    if (saved) setHistory(saved);
  }, []);

  useEffect(() => {
    if (amount && from && to) handleConvert();
  }, [from, to]);

  const handleConvert = async () => {
    setLoading(true);
    try {
      const numericAmount = Number(amount);
      const data = await convertCurrency(from, to, numericAmount);
      if (!data) return;
      const converted = data.converted_amount;
      setResult(converted);
      setRate((converted / numericAmount).toFixed(4));
      const newEntry = { from, to, amount: numericAmount, result: converted };
      setHistory(prev => {
        const updated = [newEntry, ...prev].slice(0, 5);
        localStorage.setItem("conversionHistory", JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleSwap = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
    setFrom(to);
    setTo(from);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("conversionHistory");
  };

  return (
    <div className="card converter-card">

      {/* Card header */}
      <div className="card-header">
        <span className="card-icon">💱</span>
        <div>
          <h2 className="card-title">Currency Converter</h2>
          <p className="card-subtitle">Real-time exchange rates</p>
        </div>
      </div>

      {/* Amount input */}
      <div className="field-group">
        <label className="field-label">Amount</label>
        <input
          className="amount-input"
          type="number"
          value={amount}
          min="0"
          onChange={e => setAmount(e.target.value)}
          placeholder="Enter amount…"
        />
      </div>

      {/* Currency selectors */}
      <div className="currency-row">

        <div className="currency-select-wrap">
          <label className="field-label">From</label>
          <CurrencySelect
            value={from}
            onChange={setFrom}
            currencies={currencies}
          />
        </div>

        <button
          className={`swap-btn ${shake ? "shake" : ""}`}
          onClick={handleSwap}
          title="Swap currencies"
        >
          ⇄
        </button>

        <div className="currency-select-wrap">
          <label className="field-label">To</label>
          <CurrencySelect
            value={to}
            onChange={setTo}
            currencies={currencies}
          />
        </div>

      </div>

      {/* Convert button */}
      <button
        className={`convert-btn ${loading ? "loading" : ""}`}
        onClick={handleConvert}
        disabled={loading}
      >
        {loading ? <span className="spinner" /> : "Convert"}
      </button>

      {/* Rate badge */}
      {rate && !loading && (
        <div className="rate-badge">
          1 {from} = <strong>{rate}</strong> {to}
        </div>
      )}

      {/* Result */}
      {result !== null && !loading && (
        <div className="result-box">
          <p className="result-label">{amount} {from} equals</p>
          <h3 className="result-value">{result.toLocaleString()} <span>{to}</span></h3>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="history-section">
          <div className="history-header">
            <h4 className="history-title">
              <span>🕒</span> Recent Conversions
            </h4>
            <button className="clear-history-btn" onClick={handleClearHistory} title="Clear history">
              🗑 Clear
            </button>
          </div>
          <ul className="history-list">
            {history.map((item, i) => (
              <li key={i} className="history-item">
                <span className="h-currencies">{item.from} → {item.to}</span>
                <span className="h-values">{item.amount} ≈ {
                  typeof item.result === "number"
                    ? item.result.toLocaleString()
                    : item.result
                }</span>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}

export default Converter;