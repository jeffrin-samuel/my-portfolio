const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const Enquiry = require('./models/Enquiry');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve your portfolio's static files from the "public" folder
// Put index.html, style.css, script.js, images/ all inside public/
app.use(express.static(path.join(__dirname, 'public')));

// ── MongoDB Connection ────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB (enquiryDB)'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    });

// ── Validation Rules ──────────────────────────────────────────────────────────
const contactValidationRules = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters')
        .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters')
        .matches(/^[a-zA-Z\s\-']+$/).withMessage('Name can only contain letters, spaces, hyphens and apostrophes'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email address'),

    body('phone')
        .optional({ checkFalsy: true })
        .trim()
        .matches(/^\+?[0-9\s\-\(\)]{6,20}$/).withMessage('Please enter a valid phone number'),

    body('subject')
        .trim()
        .notEmpty().withMessage('Subject is required')
        .isLength({ min: 3 }).withMessage('Subject must be at least 3 characters')
        .isLength({ max: 100 }).withMessage('Subject cannot exceed 100 characters'),

    body('message')
        .trim()
        .notEmpty().withMessage('Message is required')
        .isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
        .isLength({ max: 1000 }).withMessage('Message cannot exceed 1000 characters'),
];

// ── Routes ────────────────────────────────────────────────────────────────────

// POST /api/contact — validate and save enquiry to MongoDB
app.post('/api/contact', contactValidationRules, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
        });
    }

    try {
        const { name, email, phone, subject, message } = req.body;

        const enquiry = new Enquiry({
            name,
            email,
            phone: phone?.trim() || 'Not provided',
            subject,
            message
        });

        const saved = await enquiry.save();
        console.log(`📩 New enquiry saved — ID: ${saved._id} | From: ${name} <${email}>`);

        res.status(201).json({
            success: true,
            message: "Your message has been received! I'll get back to you soon.",
            data: {
                id: saved._id,
                name: saved.name,
                email: saved.email,
                submittedAt: saved.submittedAt
            }
        });

    } catch (err) {
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => ({ field: e.path, message: e.message }));
            return res.status(422).json({ success: false, message: 'Validation failed', errors });
        }
        console.error('❌ Server error:', err.message);
        res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' });
    }
});

// GET /api/contact — fetch all saved enquiries (for your reference/admin use)
app.get('/api/contact', async (req, res) => {
    try {
        const enquiries = await Enquiry.find().sort({ submittedAt: -1 });
        res.json({ success: true, count: enquiries.length, data: enquiries });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Fallback — serve index.html for any unknown routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});