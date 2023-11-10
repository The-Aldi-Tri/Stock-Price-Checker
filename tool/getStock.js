const axios = require("axios");

const getStock = async (symbol) => {
  const url =
    "https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/" +
    symbol +
    "/quote";

  const response = await axios.get(String(url));

  return response.data;
};

module.exports = getStock;
