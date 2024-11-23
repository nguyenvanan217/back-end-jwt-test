const { Role, User, Genres, Book, Transactions } = require("./models");

// Seed roles
async function seedRoles() {
  await Role.bulkCreate([
    { name: "Admin" },
    { name: "Staff" },
    { name: "Member" },
  ]);
  console.log("Roles added!");
}

// Seed genres
async function seedGenres() {
  await Genres.bulkCreate([
    { name: "Fiction" },
    { name: "Science" },
    { name: "Biography" },
  ]);
  console.log("Genres added!");
}

// Seed users
async function seedUsers() {
  await User.bulkCreate([
    {
      email: "admin@example.com",
      password: "admin123",
      username: "admin",
      roleId: 1,
    },
    {
      email: "staff@example.com",
      password: "staff123",
      username: "staff",
      roleId: 2,
    },
    {
      email: "member@example.com",
      password: "member123",
      username: "member",
      roleId: 3,
    },
  ]);
  console.log("Users added!");
}

// Seed books
async function seedBooks() {
  await Book.bulkCreate([
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      genreId: 1,
      quantity: 10,
      cover_image: "gatsby.jpg",
    },
    {
      title: "A Brief History of Time",
      author: "Stephen Hawking",
      genreId: 2,
      quantity: 5,
      cover_image: "time.jpg",
    },
    {
      title: "Steve Jobs",
      author: "Walter Isaacson",
      genreId: 3,
      quantity: 7,
      cover_image: "jobs.jpg",
    },
  ]);
  console.log("Books added!");
}

// Seed transactions
async function seedTransactions() {
  await Transactions.bulkCreate(
    [
      {
        bookId: 1,
        userId: 3,
        borrow_date: "2024-11-23 02:46:58",
        return_date: null,
        status: "Borrowed",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        bookId: 2,
        userId: 2,
        borrow_date: "2024-11-23 02:46:58",
        return_date: null,
        status: "Borrowed",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    { ignoreDuplicates: true }
  );
  console.log("Transactions added!");
}

// Seed all data
async function seedAll() {
  try {
    await seedRoles();
    await seedGenres();
    await seedUsers();
    await seedBooks();
    await seedTransactions();
    console.log("All data seeded successfully!");
  } catch (err) {
    console.error("Error seeding data:", err);
  }
}

// Run the seeding process
seedAll();
