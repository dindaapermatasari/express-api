const express = require('express');
const categoryController = require('../controllers/category-controller');
const articleController = require('../controllers/article-controller');

const route = express.Router();

route.get('/', (req, res) => {
  res.send('Birds home page');
});

// Route for category
route.get('/categories', categoryController.index);
route.post('/categories', categoryController.store);
route.get('/categories/:slug', categoryController.show);
route.put('/categories/:slug', categoryController.update);
route.delete('/categories/:slug', categoryController.destroy);

// Route for article
route.get('/articles', articleController.index);
route.post('/articles', articleController.store);
route.get('/articles/:slug', articleController.show);
route.put('/articles/:slug', articleController.update);
route.delete('/articles/:slug', articleController.destroy);

module.exports = route;
