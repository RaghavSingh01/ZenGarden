// scripts/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

// Import your models (adjust paths if needed)
const User = require('../models/userModel');
const Dish = require('../models/dishModel');
const Menu = require('../models/menuModel');
const Inventory = require('../models/inventoryModel');
const Reservation = require('../models/reservationModel');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('Missing MONGO_URI in .env');
  process.exit(1);
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const hash = (pwd) => bcrypt.hashSync(pwd, 12);

async function connect() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');
}

async function clearCollections() {
  // Preserve indexes, just delete documents
  await Promise.all([
    User.deleteMany({}),
    Dish.deleteMany({}),
    Menu.deleteMany({}),
    Inventory.deleteMany({}),
    Reservation.deleteMany({})
  ]);
  console.log('🧹 Cleared existing documents');
}

function makeUsers() {
  const base = [
    { name: 'Admin User', email: 'admin@example.com', role: 'admin' },
    { name: 'Head Chef', email: 'chef@example.com', role: 'chef' }
  ];
  const extras = Array.from({ length: 10 }).map(() => ({
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    role: 'user'
  }));
  const all = [...base, ...extras].map(u => ({
    ...u,
    isActive: true,
    password: 'Password@123' // will be hashed on save hook too, but we hash here to skip select:false issues
  }));
  return all;
}

function makeMenuItems(createdBy) {
  const catalog = [
    // Starters
    { name: 'Tomato Basil Soup', category: 'starter', price: 149, tags: ['veg'], allergens: ['dairy'] },
    { name: 'Chicken Wings (6 pc)', category: 'starter', price: 249, tags: ['spicy'], allergens: [] },
    { name: 'Garlic Bread', category: 'starter', price: 129, tags: ['veg'], allergens: ['gluten'] },
    // Mains
    { name: 'Margherita Pizza', category: 'main course', price: 349, tags: ['veg'], allergens: ['gluten', 'dairy'] },
    { name: 'Paneer Tikka Masala', category: 'main course', price: 329, tags: ['veg', 'north indian'], allergens: ['dairy'] },
    { name: 'Butter Chicken', category: 'main course', price: 369, tags: ['north indian'], allergens: ['dairy', 'nuts'] },
    { name: 'Veg Biryani', category: 'main course', price: 299, tags: ['veg', 'rice'], allergens: [] },
    { name: 'Chicken Biryani', category: 'main course', price: 349, tags: ['rice'], allergens: [] },
    // Desserts
    { name: 'Gulab Jamun (2 pc)', category: 'dessert', price: 119, tags: ['veg'], allergens: ['dairy'] },
    { name: 'Chocolate Brownie', category: 'dessert', price: 169, tags: ['veg'], allergens: ['gluten', 'nuts'] },
    // Beverages
    { name: 'Masala Lemonade', category: 'beverage', price: 99, tags: [], allergens: [] },
    { name: 'Cold Coffee', category: 'beverage', price: 149, tags: [], allergens: ['dairy'] }
  ];

  return catalog.map((c, i) => ({
    name: c.name,
    description: c.description || '',
    price: c.price,
    category: c.category,
    isAvailable: true,
    image: '',
    tags: c.tags,
    allergens: c.allergens,
    popular: ['Margherita Pizza', 'Butter Chicken', 'Chicken Biryani'].includes(c.name),
    sku: `MENU-${1000 + i}`,
    costPrice: Math.max(20, Math.round(c.price * 0.4)),
    isArchived: false,
    createdBy: createdBy?._id,
    updatedBy: createdBy?._id
  }));
}

function makeDishes(createdBy) {
  const dishes = [
    {
      name: 'Margherita Pizza',
      category: 'main-course',
      price: 349,
      ingredients: ['flour', 'tomato', 'mozzarella', 'basil'],
      description: 'Classic Neapolitan-style pizza with fresh tomatoes, mozzarella, and basil.'
    },
    {
      name: 'Butter Chicken',
      category: 'main-course',
      price: 369,
      ingredients: ['chicken', 'butter', 'cream', 'spices'],
      description: 'Creamy tomato-based curry with tender chicken and aromatic spices.'
    },
    {
      name: 'Paneer Tikka Masala',
      category: 'main-course',
      price: 329,
      ingredients: ['paneer', 'tomato', 'cream', 'spices'],
      description: 'Grilled paneer in a rich, spiced tomato and cream gravy.'
    },
    {
      name: 'Veg Biryani',
      category: 'main-course',
      price: 299,
      ingredients: ['rice', 'vegetables', 'spices'],
      description: 'Fragrant basmati rice cooked with mixed vegetables and biryani spices.'
    },
    {
      name: 'Chicken Biryani',
      category: 'main-course',
      price: 349,
      ingredients: ['rice', 'chicken', 'spices'],
      description: 'Dum-cooked basmati rice layered with spiced chicken.'
    },
    {
      name: 'Tomato Basil Soup',
      category: 'appetizer',
      price: 149,
      ingredients: ['tomato', 'basil', 'cream'],
      description: 'Silky tomato soup finished with basil and a touch of cream.'
    },
    {
      name: 'Garlic Bread',
      category: 'appetizer',
      price: 129,
      ingredients: ['bread', 'garlic', 'butter'],
      description: 'Toasted bread topped with garlic butter and herbs.'
    },
    {
      name: 'Gulab Jamun',
      category: 'dessert',
      price: 119,
      ingredients: ['khoya', 'sugar', 'cardamom'],
      description: 'Soft milk-solid dumplings soaked in cardamom sugar syrup.'
    },
    {
      name: 'Chocolate Brownie',
      category: 'dessert',
      price: 169,
      ingredients: ['flour', 'cocoa', 'butter', 'nuts'],
      description: 'Rich chocolate brownie with a fudgy center and nuts.'
    },
    {
      name: 'Cold Coffee',
      category: 'beverage',
      price: 149,
      ingredients: ['coffee', 'milk', 'sugar'],
      description: 'Iced blended coffee with milk and sugar.'
    }
  ];

  return dishes.map(d => ({
    name: d.name,
    description: d.description, // required by schema
    price: d.price,
    category: d.category,
    ingredients: d.ingredients,
    isAvailable: true,
    preparationTime: 20,
    image: '',
    createdBy: createdBy?._id
  }));
}

function makeInventory(updater) {
  const items = [
    { ingredient: 'flour', unit: 'kg' },
    { ingredient: 'tomato', unit: 'kg' },
    { ingredient: 'mozzarella', unit: 'kg' },
    { ingredient: 'basil', unit: 'g' },
    { ingredient: 'chicken', unit: 'kg' },
    { ingredient: 'cream', unit: 'ml' },
    { ingredient: 'butter', unit: 'kg' },
    { ingredient: 'paneer', unit: 'kg' },
    { ingredient: 'rice', unit: 'kg' },
    { ingredient: 'vegetables', unit: 'kg' },
    { ingredient: 'spices', unit: 'g' },
    { ingredient: 'bread', unit: 'pcs' },
    { ingredient: 'khoya', unit: 'kg' },
    { ingredient: 'cocoa', unit: 'g' },
    { ingredient: 'nuts', unit: 'g' },
    { ingredient: 'coffee', unit: 'g' },
    { ingredient: 'milk', unit: 'ml' },
    { ingredient: 'sugar', unit: 'g' }
  ];

  return items.map((x, i) => ({
    ingredient: x.ingredient,
    quantity: 50 + (i * 5), // simple stock numbers
    unit: x.unit,
    lowStockAlert: x.unit === 'g' ? 500 : x.unit === 'ml' ? 2000 : 5,
    lastUpdated: new Date(),
    updatedBy: updater?._id
  }));
}

function makeReservations(users) {
  const statuses = ['pending', 'confirmed', 'cancelled', 'completed'];
  const now = Date.now();
  return Array.from({ length: 36 }).map(() => {
    const user = pick(users);
    const daysOffset = faker.number.int({ min: -7, max: 14 });
    const date = new Date(now + daysOffset * 86400000);
    // Reservation expects a Date in reservationTime and a tableNumber and guests
    const hour = faker.number.int({ min: 10, max: 22 });
    const minute = faker.number.int({ min: 0, max: 1 }) * 30;
    date.setHours(hour, minute, 0, 0);

    return {
      user: user?._id,
      tableNumber: faker.number.int({ min: 1, max: 20 }),
      reservationTime: date,
      guests: faker.number.int({ min: 1, max: 8 }),
      status: pick(statuses),
      specialRequests: Math.random() > 0.8 ? faker.lorem.sentence() : ''
    };
  });
}

async function run() {
  await connect();
  await clearCollections();

  // Create users with hashed password; pre-save hook will hash too if using save()
  // We’ll use .create to trigger hooks; insertMany bypasses middleware by default.
  const rawUsers = makeUsers();
  const users = [];
  for (const u of rawUsers) {
    const doc = new User(u);
    // doc.password will be hashed by pre('save')
    await doc.save();
    users.push(doc);
  }
  const admin = users.find(u => u.role === 'admin');
  const chef = users.find(u => u.role === 'chef');
  console.log(`👤 Users: ${users.length} (admin: ${admin?.email}, chef: ${chef?.email}, default password: Password@123)`);

  // Menu (your "Menu" model)
  const menuDocs = await Menu.insertMany(makeMenuItems(admin || chef || users[0]));
  console.log(`🍽 Menu items: ${menuDocs.length}`);

  // Dishes (your "Dish" model)
  const dishDocs = await Dish.insertMany(makeDishes(chef || admin || users[0]));
  console.log(`🥘 Dishes: ${dishDocs.length}`);

  // Inventory
  const invDocs = await Inventory.insertMany(makeInventory(chef || admin || users[0]));
  console.log(`📦 Inventory items: ${invDocs.length}`);

  // Reservations referencing users
  const resvDocs = await Reservation.insertMany(makeReservations(users));
  console.log(`📅 Reservations: ${resvDocs.length}`);

  await mongoose.disconnect();
  console.log('✅ Seeding complete');
}

run().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});