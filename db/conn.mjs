import dotenv from 'dotenv'; //brings in dotenv for access to env variables
import { MongoClient } from 'mongodb'; // bringsin mongoClient to connect to DB


dotenv.config(); //Sets up env variable connection

const connectionString = process.env.mongoURI; // grabs connectionstring from env variables
const client = new MongoClient(connectionString); // creates a new mongo client with connection string

let conn; // variable to store connection in

try {               // try to connect
  conn = await client.connect(); // call upon mongoClient connect method, this connect to our DB
 // console.log(`MongoDB Connected...`);// if we connect we console log that we have been connected
} catch (err) {//catch any errors
  console.error(err);// console loggin errors
}


let db = conn.db('sample_training'); //chosing which cluster/db you want to access and save connected db to db variable
export default db; // export connected db