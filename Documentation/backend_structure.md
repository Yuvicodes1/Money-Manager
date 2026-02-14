### models/       → Mongoose schemas
### controllers/  → Business logic
### routes/       → API endpoints
### middleware/   → Auth protection
### config/       → DB connection config

***backend/controllers/userController.js -> backend/models/User.js***

controller function for creating (or returning) a user in your backend.
This imports the User model you created earlier (the schema file). It allows you to interact with the database collection (create, find, update users).

### User → POST /api/users → MongoDB Atlas

