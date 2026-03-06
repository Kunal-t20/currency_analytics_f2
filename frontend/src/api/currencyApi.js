import axios from "axios";

const BASE_URL = "https://currency-analytics-f2.onrender.com";

export const convertCurrency = async (from, to, amount) => {
  const response = await axios.get(`${BASE_URL}/convert`, {
    params: {
      from_currency: from,
      to_currency: to,
      amount: amount
    }
  });

  return response.data;
};

export const getCurrencies = async () => {
  const response = await axios.get(
    "https://api.frankfurter.app/currencies"
  );

  return response.data;
};