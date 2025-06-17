// queries.js
const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017"; // or your Atlas URI
const client = new MongoClient(uri);

async function run() {
  await client.connect();
  const db = client.db("plp_bookstore");
  const books = db.collection("books");

  // 📌 Find all books in a specific genre
  console.log(await books.find({ genre: "Programming" }).toArray());

  // 📌 Find books published after 2010
  console.log(await books.find({ published_year: { $gt: 2010 } }).toArray());

  // 📌 Find books by a specific author
  console.log(await books.find({ author: "Paulo Coelho" }).toArray());

  // 📌 Update the price of a specific book
  await books.updateOne({ title: "Clean Code" }, { $set: { price: 40 } });

  // 📌 Delete a book by its title
  await books.deleteOne({ title: "The Alchemist" });

  // ✅ ADVANCED QUERIES

  // Find in-stock books published after 2010
  console.log(await books.find({ in_stock: true, published_year: { $gt: 2010 } }).toArray());

  // Projection: title, author, price
  console.log(await books.find({}, { projection: { title: 1, author: 1, price: 1, _id: 0 } }).toArray());

  // Sort by price ascending
  console.log(await books.find().sort({ price: 1 }).toArray());

  // Sort by price descending
  console.log(await books.find().sort({ price: -1 }).toArray());

  // Pagination (page 2 with 5 per page)
  console.log(await books.find().skip(5).limit(5).toArray());

  await client.close();
}

run().catch(console.error);


// queries.js
use('plp_bookstore');

// Task 2: Basic Queries
db.books.find({ genre: "Fiction" });  // Books by genre
db.books.find({ published_year: { $gt: 2015 } });  // Books after a certain year
db.books.find({ author: "Chinua Achebe" });  // Books by author
db.books.updateOne({ title: "Things Fall Apart" }, { $set: { price: 10.99 } });  // Update price
db.books.deleteOne({ title: "Old Book Title" });  // Delete by title

// Task 3: Advanced Queries
db.books.find({ in_stock: true, published_year: { $gt: 2010 } });  // In stock and after 2010
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 });  // Projection
db.books.find().sort({ price: 1 });  // Sort ascending
db.books.find().sort({ price: -1 }); // Sort descending
db.books.find().skip(5).limit(5);  // Pagination (page 2)

// Task 4: Aggregation
db.books.aggregate([
  { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }
]);

db.books.aggregate([
  { $group: { _id: "$author", totalBooks: { $sum: 1 } } },
  { $sort: { totalBooks: -1 } },
  { $limit: 1 }
]);

db.books.aggregate([
  {
    $group: {
      _id: {
        $concat: [
          { $toString: { $subtract: [ { $subtract: ["$published_year", { $mod: ["$published_year", 10] }] }, 0 ] } },
          "s"
        ]
      },
      count: { $sum: 1 }
    }
  }
]);

// Task 5: Indexing
db.books.createIndex({ title: 1 });
db.books.createIndex({ author: 1, published_year: 1 });
db.books.find({ title: "Things Fall Apart" }).explain("executionStats");
