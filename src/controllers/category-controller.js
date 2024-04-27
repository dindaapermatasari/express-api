const knex = require('../database');
const { check, validationResult } = require('express-validator');
const { toSlug } = require('../helpers');

const index = async (req, res) => {
  const categories = await knex('categories');
  return res.status(200).json(categories);
};

const store = async (req, res) => {
  const { name } = req.body;
  await check('name').isString().notEmpty().isLength({ min: 3 }).run(req);
  const result = validationResult(req);
  if (!result.isEmpty())
    return res.status(400).json({ errors: result.array() });

  if (
    await knex('categories')
      .where('name', name)
      .then((data) => data.length)
  )
    return res
      .status(400)
      .json({ message: 'The name has already been taken.' });

  const category = await knex('categories').insert({
    name,
    slug: toSlug(name),
  });

  if (category.length == 0)
    return res.status(400).json({ message: 'Category failed to create' });

  return res.status(200).json({ message: 'Category created successfully' });
};

const show = async (req, res) => {
  const { slug } = req.params;
  const category = await knex('categories').where('slug', slug).first();
  if (!category) return res.status(404).json({ message: 'Category Not Found' });
  return res.status(200).json({ data: category });
};

const update = async (req, res) => {
  const { slug } = req.params;
  const { name } = req.body;
  await check('name').isString().notEmpty().isLength({ min: 3 }).run(req);

  const result = validationResult(req);
  if (!result.isEmpty())
    return res.status(400).json({ errors: result.array() });

  const category = await knex('categories').where({ slug }).first();
  if (!category) return res.status(400).json({ message: 'Category Not Found' });

  if (
    await knex('categories')
      .where('name', name)
      .then((data) => data.length)
  )
    return res
      .status(400)
      .json({ message: 'The name has already been taken.' });

  const new_category = await knex('categories')
    .where('slug', slug)
    .update({
      name,
      slug: toSlug(name),
    });

  if (new_category.length == 0)
    return res.status(400).json({ message: 'Category failed to update' });

  return res.status(200).json({ message: 'Category updated successfully' });
};

const destroy = async (req, res) => {
  const { slug } = req.params;
  const category = await knex('categories').where('slug', slug).first();
  if (!category) return res.status(404).json({ message: 'Category Not Found' });

  const deleted_category = await knex('categories').where('slug', slug).del();

  if (deleted_category.length == 0)
    return res.status(400).json({ message: 'Category failed to delete' });

  return res.status(200).json({ message: 'Category deleted successfully' });
};

module.exports = { index, store, show, update, destroy };
