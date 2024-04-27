const knex = require('../database');
const { check, validationResult } = require('express-validator');
const { toSlug } = require('../helpers');

const index = async (req, res) => {
  const articles = await knex('articles');
  return res.status(200).json(articles);
};

const store = async (req, res) => {
  const { title, body } = req.body;

  await check('title').isString().notEmpty().isLength({ min: 3 }).run(req);
  await check('body').isString().notEmpty().run(req);

  const result = validationResult(req);
  if (!result.isEmpty())
    return res.status(400).json({ errors: result.array() });

  if (
    await knex('articles')
      .where('title', title)
      .then((data) => data.length)
  )
    return res
      .status(400)
      .json({ message: 'The title has already been taken.' });

  const article = await knex('articles').insert({
    title,
    slug: toSlug(title),
    body,
  });

  if (article.length == 0)
    return res.status(400).json({ message: 'Article failed to create' });

  return res.status(200).json({ message: 'Article created successfully' });
};

const show = async (req, res) => {
  const { slug } = req.params;
  const article = await knex('articles').where('slug', slug).first();
  if (!article) return res.status(404).json({ message: 'Article Not Found' });
  return res.status(200).json({ data: article });
};

const update = async (req, res) => {
  const { slug } = req.params;
  const { title, body } = req.body;

  await check('title').isString().notEmpty().isLength({ min: 3 }).run(req);
  await check('body').isString().notEmpty().run(req);

  const result = validationResult(req);
  if (!result.isEmpty())
    return res.status(400).json({ errors: result.array() });

  const article = await knex('articles').where({ slug }).first();
  if (!article) return res.status(400).json({ message: 'Article Not Found' });

  if (
    await knex('articles')
      .where('title', title)
      .then((data) => data.length)
  )
    return res
      .status(400)
      .json({ message: 'The title has already been taken.' });

  const new_article = await knex('articles')
    .where('slug', slug)
    .update({
      title,
      slug: toSlug(title),
      body,
    });

  if (new_article.length == 0)
    return res.status(400).json({ message: 'Article failed to update' });

  return res.status(200).json({ message: 'Article updated successfully' });
};

const destroy = async (req, res) => {
  const { slug } = req.params;
  const article = await knex('articles').where('slug', slug).first();
  if (!article) return res.status(404).json({ message: 'Article Not Found' });

  const deleted_article = await knex('articles').where('slug', slug).del();

  if (deleted_article.length == 0)
    return res.status(400).json({ message: 'Article failed to delete' });

  return res.status(200).json({ message: 'Article deleted successfully' });
};

module.exports = { index, store, show, update, destroy };
