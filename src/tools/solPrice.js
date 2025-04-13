const axios = require('axios');

async function getSolPrice() {
  try {
    const response = await axios.get('https://data.solanatracker.io/price');
    return {
      price: response.data.price,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching SOL price:', error);
    throw new Error('Failed to fetch SOL price');
  }
}

module.exports = {
  getSolPrice
};