const { toSlug } = require('../../helpers');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('articles').del();

  const response = await fetch('https://jsonplaceholder.typicode.com/posts');
  let posts = await response.json();

  posts = posts.map((post) => {
    return {
      title: post.title,
      slug: toSlug(post.title),
      body: post.body,
    };
  });
  await knex('articles').insert(posts);
};
