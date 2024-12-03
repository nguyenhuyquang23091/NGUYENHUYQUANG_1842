const express = require('express');
const router = express.Router();
const {
    getAllExercises,
    getExercise,
    createExercise,
    updateExercise,
    deleteExercise,
    upload
} = require('../controllers/exercisecontroller'); 

//CRUD ROute//
router.get('/', getAllExercises);
router.get('/:id', getExercise);
router.post('/', upload.single('image'), createExercise);
router.put('/:id', upload.single('image'), updateExercise);
router.delete('/:id', deleteExercise);
module.exports = router;