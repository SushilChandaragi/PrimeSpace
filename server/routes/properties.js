const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/properties
// @desc    Get all properties
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { type, status, location } = req.query;
    let query = {};

    if (type) query.type = type;
    if (status) query.status = status;
    if (location) query.location = { $regex: location, $options: 'i' };

    const properties = await Property.find(query).sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/properties/:id
// @desc    Get single property
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/properties
// @desc    Create new property
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, location, price, description, type, status, bedrooms, bathrooms, area, image } = req.body;

    const property = await Property.create({
      title,
      location,
      price,
      description,
      type,
      status,
      bedrooms,
      bathrooms,
      area,
      image,
      createdBy: req.user._id
    });

    res.status(201).json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/properties/:id
// @desc    Update property
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(property);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/properties/:id
// @desc    Delete property
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Property removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
