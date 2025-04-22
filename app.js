const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const uri = "mongodb+srv://darshilshah7551:darshil@user.bxcrkji.mongodb.net/?retryWrites=true&w=majority&appName=User";

const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db('sample_mflix');
    const movies = database.collection('users');

    // Query for a movie that has the title 'Back to the Future'
    const query = { name: 'Ned Stark' };
    const movie = await movies.findOne(query);

    console.log(movie);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);