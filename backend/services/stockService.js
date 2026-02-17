//This code Connects to a stock price website, asks for a stock price, and return the price. 

const axios = require ('axios');

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
//API endpoint for fetching stock data


exports.getCurrentStockPrice = async (symbol) => {
    try{
        const response = await axios.get(
            `https://www.alphavantage.co/query`,
            {
                params:{
                    function: "GLOBAL_QUOTE",
                    symbol: symbol,
                    apikey: API_KEY
                }
            }
        );

        const data = response.data["Global Quote"];
        if(!data || !data["05. price"]){
            throw new Error("Invalid API Response");
        }

        return parseFloat(data["05. price"]);
    }
    catch(error){
        console.error("Stock API Fetch error:", error.message);
        throw error;
    }
};