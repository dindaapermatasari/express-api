const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const knex = require('knex');

// Inisialisasi aplikasi Express
const app = express();

dotenv.config()

const db = knex({
    client: process.env.DB_CONNECTION,
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    },
});

db.raw('SELECT 1')
    .then(() => console.log('Connected to database'))
    .catch(err => console.error('Error connecting to database:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/articles', require('./routes/article'));
app.use('/categories', require('./routes/category'));
app.use('/users', require('./routes/user'));
app.use('/comments', require('./routes/comment'));
app.use('/images', require('./routes/image'));

// Mulai server
const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
