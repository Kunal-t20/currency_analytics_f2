import { useState, useRef, useEffect } from "react";
import ReactCountryFlag from "react-country-flag";
import "./CurrencySelect.css";

const currencyToCountry = {
    USD: "US", INR: "IN", EUR: "EU", GBP: "GB", JPY: "JP",
    AUD: "AU", CAD: "CA", CHF: "CH", CNY: "CN", HKD: "HK",
    SGD: "SG", KRW: "KR", NZD: "NZ", SEK: "SE", NOK: "NO",
    DKK: "DK", PLN: "PL", TRY: "TR", ZAR: "ZA", RUB: "RU",
    BRL: "BR", MXN: "MX", AED: "AE", SAR: "SA", THB: "TH",
    MYR: "MY", IDR: "ID", PHP: "PH"
};

// Full currency names for better search
const currencyName = {
    USD: "US Dollar", INR: "Indian Rupee", EUR: "Euro", GBP: "British Pound",
    JPY: "Japanese Yen", AUD: "Australian Dollar", CAD: "Canadian Dollar",
    CHF: "Swiss Franc", CNY: "Chinese Yuan", HKD: "Hong Kong Dollar",
    SGD: "Singapore Dollar", KRW: "South Korean Won", NZD: "New Zealand Dollar",
    SEK: "Swedish Krona", NOK: "Norwegian Krone", DKK: "Danish Krone",
    PLN: "Polish Zloty", TRY: "Turkish Lira", ZAR: "South African Rand",
    RUB: "Russian Ruble", BRL: "Brazilian Real", MXN: "Mexican Peso",
    AED: "UAE Dirham", SAR: "Saudi Riyal", THB: "Thai Baht",
    MYR: "Malaysian Ringgit", IDR: "Indonesian Rupiah", PHP: "Philippine Peso"
};

export default function CurrencySelect({ value, onChange, currencies }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const wrapRef = useRef(null);
    const inputRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (wrapRef.current && !wrapRef.current.contains(e.target)) {
                setOpen(false);
                setQuery("");
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 50);
    }, [open]);

    const filtered = currencies.filter(c => {
        const q = query.toLowerCase();
        return (
            c.toLowerCase().includes(q) ||
            (currencyName[c] || "").toLowerCase().includes(q)
        );
    });

    const handleSelect = (c) => {
        onChange(c);
        setOpen(false);
        setQuery("");
    };

    return (
        <div className="cs-wrap" ref={wrapRef}>

            {/* Trigger button */}
            <button
                className={`cs-trigger ${open ? "cs-trigger--open" : ""}`}
                onClick={() => setOpen(o => !o)}
                type="button"
            >
                {currencyToCountry[value] && (
                    <ReactCountryFlag
                        countryCode={currencyToCountry[value]}
                        svg
                        style={{ width: "1.4em", height: "1.4em", borderRadius: "3px" }}
                    />
                )}
                <span className="cs-code">{value}</span>
                <span className="cs-arrow">{open ? "▲" : "▼"}</span>
            </button>

            {/* Dropdown */}
            {open && (
                <div className="cs-dropdown">
                    {/* Search input */}
                    <div className="cs-search-wrap">
                        <span className="cs-search-icon">🔍</span>
                        <input
                            ref={inputRef}
                            className="cs-search"
                            type="text"
                            placeholder="Search currency or country…"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                        {query && (
                            <button className="cs-clear" onClick={() => setQuery("")}>✕</button>
                        )}
                    </div>

                    {/* List */}
                    <ul className="cs-list">
                        {filtered.length === 0 && (
                            <li className="cs-empty">No results for "{query}"</li>
                        )}
                        {filtered.map(c => (
                            <li
                                key={c}
                                className={`cs-item ${c === value ? "cs-item--active" : ""}`}
                                onClick={() => handleSelect(c)}
                            >
                                {currencyToCountry[c] ? (
                                    <ReactCountryFlag
                                        countryCode={currencyToCountry[c]}
                                        svg
                                        style={{ width: "1.3em", height: "1.3em", borderRadius: "2px", flexShrink: 0 }}
                                    />
                                ) : (
                                    <span className="cs-no-flag">🌐</span>
                                )}
                                <span className="cs-item-code">{c}</span>
                                <span className="cs-item-name">{currencyName[c] || ""}</span>
                                {c === value && <span className="cs-check">✓</span>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

        </div>
    );
}
