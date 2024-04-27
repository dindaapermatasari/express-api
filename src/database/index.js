require('dotenv').config();

const environment = process.env.APP_ENV || 'production';
const config = require('../../knexfile')[environment];

module.exports = require('knex')(config);
