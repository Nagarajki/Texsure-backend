let Sequelize = require("sequelize");
let dotenv = require("dotenv");

dotenv.config();
const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: process.env.DATABASE_DIALECT,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
  },
);


// const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER,process.env.DATABASE_PASSWORD, {
//   dialect: process.env.DATABASE_DIALECT,
//   port: 5432,
// });

async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    console.log("DB connected.");
  } catch (error) {
    console.error("Unable to connect to the DB:", error);
  }
}

// Call the function to connect to the database
connectToDatabase();

global.sequelize = sequelize;
module.exports = sequelize;
