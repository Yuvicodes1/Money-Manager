const mongoose = require('mongoose'); // Import mongoose for MongoDB interactions

const UserSchema = new mongoose.Schema({
    firebaseUID:{
        type: String, 
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
    },
    name:{
        type: String,
        required: true,
    }},
    {
        timestamps: true,
    });

    //defines Mongoose model for User collection, timestamps option adds createdAt and updatedAt fields automatically

module.exports = mongoose.model("User", UserSchema);// Export the User model for use in other parts of the application