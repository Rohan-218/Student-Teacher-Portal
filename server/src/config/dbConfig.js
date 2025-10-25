require('dotenv').config();
const { Sequelize } = require('sequelize');

let sequelize;

if (process.env.DATABASE_URL) {
  // 🔹 Use Render Postgres if DATABASE_URL is set
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Render DB uses self-signed certificates
      },
    },
    pool: {
      max: 5,
      min: 0,
      acquire: (process.env.DB_TIMEOUT || 30) * 1000,
      idle: 10000,
    },
  });
} else {
  // 🔹 Fallback to local PostgreSQL
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: (process.env.DB_TIMEOUT || 30) * 1000,
        idle: 10000,
      },
    }
  );
}

sequelize
  .authenticate()
  .then(() => console.log('✅ Database connection established successfully.'))
  .catch((err) => console.error('❌ Unable to connect to the database:', err));

module.exports = sequelize;
