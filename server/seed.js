const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Property = require('./models/Property');

// Sample Properties from Belgaum/Karnataka
const sampleProperties = [
  {
    title: 'Luxury Villa in Tilakwadi',
    location: 'Tilakwadi, Belgaum',
    price: 8500000,
    description: 'Stunning 4BHK villa with modern amenities, garden, and car parking. Located in the heart of Tilakwadi with excellent connectivity.',
    type: 'Sale',
    status: 'Available',
    bedrooms: 4,
    bathrooms: 3,
    area: 2400,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'
  },
  {
    title: 'Modern Apartment in Shahapur',
    location: 'Shahapur, Belgaum',
    price: 15000,
    description: 'Well-furnished 2BHK apartment ideal for families. Close to schools, hospitals, and markets.',
    type: 'Rent',
    status: 'Available',
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
  },
  {
    title: 'Commercial Space in Camp Area',
    location: 'Camp, Belgaum',
    price: 12000000,
    description: 'Prime commercial property in the bustling Camp area. Perfect for retail stores or offices.',
    type: 'Sale',
    status: 'Available',
    bedrooms: 0,
    bathrooms: 2,
    area: 1800,
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'
  },
  {
    title: 'Cozy 3BHK in Vadgaon',
    location: 'Vadgaon, Belgaum',
    price: 4500000,
    description: 'Beautiful 3BHK flat in a gated community with 24/7 security, power backup, and children play area.',
    type: 'Sale',
    status: 'Available',
    bedrooms: 3,
    bathrooms: 2,
    area: 1450,
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
  },
  {
    title: 'Budget-Friendly Flat in Angol',
    location: 'Angol, Belgaum',
    price: 8000,
    description: 'Affordable 1BHK flat suitable for bachelors or small families. Near bus stop and local market.',
    type: 'Rent',
    status: 'Available',
    bedrooms: 1,
    bathrooms: 1,
    area: 650,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
  },
  {
    title: 'Farmhouse in Kangrali',
    location: 'Kangrali, Belgaum',
    price: 15000000,
    description: 'Spacious farmhouse with 2 acres of land, fruit orchards, and stunning views of the Western Ghats.',
    type: 'Sale',
    status: 'Available',
    bedrooms: 5,
    bathrooms: 4,
    area: 4500,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'
  },
  {
    title: 'Premium Flat in Goaves',
    location: 'Goaves, Belgaum',
    price: 5500000,
    description: 'Newly constructed 2BHK with modern fittings, modular kitchen, and balcony with city view.',
    type: 'Sale',
    status: 'Sold',
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'
  },
  {
    title: 'Office Space in Khanapur Road',
    location: 'Khanapur Road, Belgaum',
    price: 25000,
    description: 'Ready-to-use office space with AC, conference room, and ample parking. Ideal for startups.',
    type: 'Rent',
    status: 'Available',
    bedrooms: 0,
    bathrooms: 1,
    area: 800,
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    // Clear existing data
    await User.deleteMany({});
    await Property.deleteMany({});
    console.log('Cleared existing data...');

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@primespace.com',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('Admin user created: admin@primespace.com / admin123');

    // Create sample properties
    const propertiesWithCreator = sampleProperties.map(prop => ({
      ...prop,
      createdBy: adminUser._id
    }));

    await Property.insertMany(propertiesWithCreator);
    console.log(`${sampleProperties.length} sample properties added!`);

    console.log('\n=== Database Seeded Successfully ===');
    console.log('Admin Login: admin@primespace.com / admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
