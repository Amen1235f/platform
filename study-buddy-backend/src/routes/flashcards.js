const express = require('express');
const jwt = require('jsonwebtoken');
const Flashcard = require('../models/FlashCard');
const router = express.Router();

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Assuming "Bearer <token>"

    if (!token) return res.sendStatus(403); // Forbidden

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expired, please log in again' });
            }
            return res.sendStatus(403); // Other errors
        }
        req.user = user; // Attach user info to request
        next();
    });
};


// Create Flashcard
router.post('/', authenticateToken, async (req, res) => {
    const { question, answer } = req.body;

    try {
        const flashcard = await Flashcard.create({
            question,
            answer,
            userId: req.user.id // Link the flashcard to the authenticated user
        });
        res.status(201).json({ message: 'Flashcard created successfully', flashcard });
    } catch (error) {
        res.status(400).json({ message: 'Error creating flashcard', error: error.message });
    }
});

// Get Flashcards for the authenticated User
router.get('/', authenticateToken, async (req, res) => {
    try {
        const flashcards = await Flashcard.findAll({
            where: { userId: req.user.id } // Get flashcards for the authenticated user
        });
        res.status(200).json(flashcards);
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving flashcards', error: error.message });
    }
});
// Get a specific Flashcard by ID
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const flashcard = await Flashcard.findByPk(req.params.id);
        
        // Check if the flashcard exists and belongs to the authenticated user
        if (!flashcard || flashcard.userId !== req.user.id) {
            return res.status(404).json({ message: 'Flashcard not found or does not belong to the user' });
        }

        res.status(200).json(flashcard);
    } catch (error) {
        res.status(400).json({ message: 'Error retrieving flashcard', error: error.message });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    const { question, answer } = req.body;

    try {
        const flashcard = await Flashcard.findByPk(req.params.id);
        if (!flashcard) return res.status(404).json({ message: 'Flashcard not found' });

        // Ensure the flashcard belongs to the authenticated user
        if (flashcard.userId !== req.user.id) {
            console.log('User ID mismatch:', flashcard.userId, req.user.id);  // Log user mismatch
            return res.sendStatus(403); // Forbidden
        }

        flashcard.question = question;
        flashcard.answer = answer;
        await flashcard.save();

        res.status(200).json({ message: 'Flashcard updated successfully', flashcard });
    } catch (error) {
        res.status(400).json({ message: 'Error updating flashcard', error: error.message });
    }
});


// Delete Flashcard
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const flashcard = await Flashcard.findByPk(req.params.id);
        if (!flashcard) return res.status(404).json({ message: 'Flashcard not found' });

        await flashcard.destroy();
        res.status(200).json({ message: 'Flashcard deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting flashcard', error: error.message });
    }
});

module.exports = router;
