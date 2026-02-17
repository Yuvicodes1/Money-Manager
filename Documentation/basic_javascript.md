- **const** : assign a variable that cannot be changed later. 
- **require** : load a library / module in this file. 

```const API_KEY = process.env.ALPHA_VANTAGE_KEY;```
- **process** - it is a global object in Node.js that contains information about the running program. 
- **process.env** - env are environment variables that come from env file.

```exports.getCurrentStockPrice = async (symbol) => {```
- **export** - exports means: Make this function available to other files.

- **async** - ***very important*** this means that the function works asynchronous operations and returns a promise. This is important as the API may take time to respond and prgoram should not freeze while that happens. 


### Code
```
const response = await axios.get(
  `https://www.alphavantage.co/query`,
  {
    params: {
      function: "GLOBAL_QUOTE",
      symbol: symbol,
      apikey: API_KEY
    }
  }
);
```
- **await** - waits intil the api is finished and gives result. 
- **URL** - URL being called is the 'The Stock Data Provider' 
- **params** - are the final querry parameters. The final URL Thus becomes ```https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=XXXX```

#### What each parameter means - 
- 1. function: "GLOBAL_QUOTE" Tells API: Give me current stock price.
- 2. symbol: stock name like AAPL , TSLA etc
- 3. apikey: API_KEY :Authentication key so API knows you are allowed to use it.


