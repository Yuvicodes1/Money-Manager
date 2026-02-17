# Node.js and npm – Clear Conceptual Explanation

## The Original Problem

Originally:

- JavaScript only worked in browsers.
- Backend development required Java, Python, PHP, etc.
- Companies had to use:
  - JavaScript for frontend
  - Another language for backend

This increased complexity. Node.js solved this problem.

---

# 🌳 What is Node.js?

## Definition

**Node.js is a JavaScript Runtime Environment.**

Breaking that down:

- **JavaScript** = Programming language
- **Runtime** = Software that executes code
- **Environment** = Provides tools like file system access, networking, etc.

👉 Node.js allows JavaScript to run outside the browser (on your computer or server).

---

## ⚙️ What Makes Node.js Special?

Node.js is built on:

- **V8 Engine** (Chrome’s JavaScript engine)
- Written in C++
- Extremely fast

But the real power comes from:
 Non-Blocking, Event-Driven Architecture
Traditional servers (blocking):
1. Receive request
2. Wait for database response
3. Then handle next request

Node.js (non-blocking):
1. Start database query
2. Don’t wait
3. Handle other requests
4. When query finishes → send response

This is powered by:
- Event Loop
- Asynchronous I/O


## 🚀 Why This Matters

Node.js is great for:
- APIs
- Chat applications
- Real-time apps
- Streaming
- High-traffic systems

---

# What is npm?
Definition

**npm = Node Package Manager**

It manages external libraries (called packages).

Instead of writing everything yourself, you install ready-made solutions.

Examples:
- Express (backend framework)
- React
- Mongoose
- JWT
- Tailwind

---

**It downloads packages from npm registry and stores it in** 
- node_modules/


## Request Codes
### Sends 500 - Internal Server Error to client.
### Sends 400 - sends HTTP 400 (Bad Request).
### Sends 401 - Unauthorised
### Sends 404 - Not Found
### Sends 200 - OK
### Sends 201 - 201 = Created (correct REST practice).

### We use ```res.status()``` to send the HTTP status code along with the response so the client (frontend, mobile app, Postman, etc.) knows what happened.

```res.status(code).json(data);``` : here res is respose object, status is HTTPS status code, json() -> sends data back as json. 


# What is AXIOS?
Axios is a popular, promise-based JavaScript library used to make asynchronous HTTP requests from browsers or Node.js to servers. It acts as a client-side library to easily fetch data from APIs, supporting GET, POST, and other methods while automatically transforming JSON data

**Our Architecture**
- ***React Frontend  →  Node Backend  →  Database*** <>
- Axios is used : ***React → (Axios request) → Node API***


Browsers already have fetch(), but Axios is easier and more powerful.
### Advantages of Axios:
- ✅ Simpler syntax
- ✅ Automatic JSON conversion
- ✅ Better error handling
- ✅ Request interceptors
- ✅ Works in Node + Browser
- ✅ Timeout support
- ✅ Widely used in industry

**USE** -
```
//THIS sends a GET request to our backewnd
import axios from "axios";

axios.get("http://localhost:5000/")
  .then(res => console.log(res.data))
  .catch(err => console.error(err));
```

### HTTPS methods supported by AXIOS :
- GET ```axios.get("/api/stocks");```
- POST 
```axios.post("/api/stocks", {
  name: "Apple",
  price: 180
});
```
- PUT ```axios.put("/api/stocks/1", {...});```
- DELETE ```axios.delete("/api/stocks/1");``` 

### Typical MERN Flow with AXIOS

```
React Button Click
        ↓
Axios POST request
        ↓
Node API receives
        ↓
MongoDB updated
        ↓
Response sent
        ↓
React UI updates
```
