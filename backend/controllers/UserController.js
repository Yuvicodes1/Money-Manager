const User = require("../models/User");
// Controller function to create or update a user based on Firebase UID, 
// imports user model we created in models/User.js to interact with MongoDB.

//creating a function named createUser that takes in request and response objects as parameters. 
// This function will handle the logic for creating a new user or updating an existing user. 

exports.createUser = async (req, res) => {
    try{
        const { firebaseUID, email, name } = req.body; // Extract firebaseUID, email, and name from the request body

        if(!firebaseUID || !email || !name){
            return res.status(400).json({ message: "firebaseUID, email, and name are required" }); //HTTP 400 (Bad Request).
        }

        //checking if user already exists 
        const existingUser = await User.findOne({ firebaseUID });

        if (existingUser) {
            return res.status(200).json(existingUser);
        }

        // Create new user
        const newUser = await User.create({
            firebaseUID,
            email,
            name
        });
        res.status(201).json(newUser);
    }
    catch (error) {
        console.error(error);
        res.stauts(500).json({ message: "Server error" });
    }
};


// What This Controller Does - 
// Extracts data from request body
// Validates required fields
// Checks duplicate user
// Creates user if not exists
// Sends proper HTTP response