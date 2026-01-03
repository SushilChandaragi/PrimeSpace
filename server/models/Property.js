const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  type: {
    type: String,
    enum: ['Sale', 'Rent'],
    required: [true, 'Property type is required']
  },
  status: {
    type: String,
    enum: ['Available', 'Sold', 'Rented'],
    default: 'Available'
  },
  bedrooms: {
    type: Number,
    default: 2
  },
  bathrooms: {
    type: Number,
    default: 1
  },
  area: {
    type: Number,
    required: [true, 'Area in sq.ft is required']
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Property', PropertySchema);
