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



## Installing for FRONTEND

```
npm install axios react-router-dom recharts
npm install -D tailwindcss@3.4.4 postcss autoprefixer
npx tailwindcss init -p
```


## Why These Dependencies Are Needed

You installed two types of dependencies:
1. **Runtime dependencies** → Required for the app to run  
2. **Development dependencies** → Tools used during development (styling/build)

## 1. Runtime Dependencies

### axios
Purpose: Make HTTP requests from frontend to backend or external APIs.
Example:
```js
axios.get("http://localhost:5000/api/stocks")
````
Why needed:

* Fetch data from backend
* Easier than `fetch()`
* Automatic JSON handling
* Better error handling and timeouts

### react-router-dom
Purpose: Navigation between pages in a React Single Page Application (SPA).
Example:

```jsx
<Route path="/dashboard" element={<Dashboard />} />
```

Why needed:

* Enables multiple pages without reload
* Handles routes like `/login`, `/dashboard`, `/stocks`
* Required for modern React apps

### recharts

Purpose: Create charts and graphs in React.

Used for:

* Line charts
* Bar charts
* Pie charts
* Analytics dashboards

Why needed:

* Visualizing stock data
* Portfolio analytics
* Performance graphs

---

## 2. Development Dependencies

Installed with `-D` because they are only needed during development.

### tailwindcss

Purpose: Utility-first CSS framework for styling UI.

Example:

```jsx
<button className="bg-blue-500 p-2">
```

Why needed:

* Faster UI development
* Responsive design
* Modern dashboard styling
* Less custom CSS required

### postcss

Purpose: CSS processing engine used by Tailwind.

Pipeline:

```
Tailwind → PostCSS → Final CSS
```

Why needed:

* Converts Tailwind classes into actual CSS
* Required for Tailwind to function

### autoprefixer

Purpose: Adds browser compatibility prefixes automatically.

Example:

```
-webkit-
-moz-
-ms-
```

Why needed:

* Ensures CSS works across browsers
* Saves manual effort

## 3. Tailwind Initialization Command

Command:

```
npx tailwindcss init -p
```

Creates:

* `tailwind.config.js`
* `postcss.config.js`

`-p` means: also create PostCSS config automatically.

---

### Summary

| Dependency       | Purpose               |
| ---------------- | --------------------- |
| axios            | API requests          |
| react-router-dom | Page navigation       |
| recharts         | Charts & graphs       |
| tailwindcss      | Styling framework     |
| postcss          | CSS processing        |
| autoprefixer     | Browser compatibility |

### Simple Architecture

Frontend needs:
1. Data fetching → axios
2. Navigation → react-router
3. UI → tailwind / charts

You installed the correct setup for a MERN dashboard app.

```
::contentReference[oaicite:0]{index=0}
```
