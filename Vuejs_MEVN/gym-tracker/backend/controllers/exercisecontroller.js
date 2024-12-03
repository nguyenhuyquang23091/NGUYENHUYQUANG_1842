// controllers/exerciseController.js
const Exercise = require('../models/Exercise');
//image controller//
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

const myurl = process.env.MONGO_URI || 'mongodb://localhost:27017/';
let dbConnection;

// Retrieve all exercises from the database
const getAllExercises = async (req, res) => {
    try {
        const exercises = await Exercise.find({}); // Find all exercises in the collection
        res.status(200).json(exercises); // Send the exercises as a JSON response
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle any server errors
    }
};

// Retrieve a single exercise by its ID
const getExercise = async (req, res) => {
    try {
        const exercise = await Exercise.findById(req.params.id); // Find an exercise by its ID
        if (!exercise) {
            return res.status(404).json({ message: 'Exercise not found' }); // Respond if no exercise is found
        }
        res.status(200).json(exercise); // Send the exercise as a JSON response
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle any server errors
    }
};

// Create a new exercise in the database
const createExercise = async (req, res) => {
    try {
        let newExercise = {...req.body};
        if (req.file){
            newExercise.imageUrl = `/uploads/${req.file.filename}`;
        }
        const exercise = await Exercise.create(newExercise); // Create a new exercise using request data
        res.status(201).json(exercise); // Send the created exercise as a JSON response
    } catch (error) {
        res.status(400).json({ message: error.message }); // Handle validation or other client errors
    }
};

// Update an existing exercise by its ID
const updateExercise = async (req, res) => {
    try {
        let updateData = {...req.body};
        if (req.file) {
            updateData.imageUrl = `/uploads/${req.file.filename}`;

        }
        const exercise = await Exercise.findByIdAndUpdate(
            req.params.id, // ID of the exercise to update
            updateData, // New data for the exercise
            { new: true, runValidators: true } // Return the updated exercise and validate data
        );
        if (!exercise) {
            return res.status(404).json({ message: 'Exercise not found' }); // Respond if no exercise is found
        }
        res.status(200).json(exercise); // Send the updated exercise as a JSON response
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle any server errors
    }
};

// Delete an exercise by its ID
const deleteExercise = async (req, res) => {
    try {
        const exercise = await Exercise.findByIdAndDelete(req.params.id); // Find and delete the exercise by ID
        if (!exercise) {
            return res.status(404).json({ message: 'Exercise not found' }); // Respond if no exercise is found
        }
        res.status(200).json({ message: 'Exercise deleted' }); // Confirm deletion
    } catch (error) {
        res.status(500).json({ message: error.message }); // Handle any server errors
    }
};
//Image Controller//
async function connectToDatabase(){
    if(dbConnection) return dbConnection;
    try {
        const client = await MongoClient.connect(myurl);
        dbConnection = client.db('gym-tracker');
        console.log('Connected to MongoDB');
        return dbConnection;

    } catch (err) {
        console.error('Error connecting to MongoDB', err);
        throw err;
    }
}
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}
// Configure multer storage with filename and path
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
// Set up multer with file type restrictions
const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
        }
        cb(null, true);
    }
});

// Export all controller functions for use in routes
module.exports = {
    getAllExercises,
    getExercise,
    createExercise,
    updateExercise,
    deleteExercise,
    upload,
    connectToDatabase,
};
