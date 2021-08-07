const Joi = require('joi');
const {
  storeBookHandler,
  listBookHandler,
  detailBookHandler,
  updateBookHandler,
  deleteBookHandler,
  errorHandler,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: storeBookHandler,
    options: {
      validate: {
        payload: Joi.object({
          name: Joi.string().required().error(new Error('Gagal menambahkan buku. Mohon isi nama buku')),
          year: Joi.number(),
          author: Joi.string(),
          summary: Joi.string(),
          publisher: Joi.string(),
          pageCount: Joi.number(),
          readPage: Joi.number(),
          reading: Joi.boolean().truthy('1').falsy('0'),
        }),
        failAction: errorHandler,
      },
    },
  },
  {
    method: 'GET',
    path: '/books',
    handler: listBookHandler,
    options: {
      validate: {
        query: Joi.object({
          name: Joi.string().optional(),
          reading: Joi.boolean().truthy('1').falsy('0').optional(),
          finished: Joi.boolean().truthy('1').falsy('0').optional(),
        }),
        failAction: errorHandler,
      },
    },
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: detailBookHandler,
    options: {
      validate: {
        params: Joi.object({
          bookId: Joi.string(),
        }),
        failAction: errorHandler,
      },
    },
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: updateBookHandler,
    options: {
      validate: {
        params: Joi.object({
          bookId: Joi.string(),
        }),
        payload: Joi.object({
          name: Joi.string().required().error(new Error('Gagal memperbarui buku. Mohon isi nama buku')),
          year: Joi.number(),
          author: Joi.string(),
          summary: Joi.string(),
          publisher: Joi.string(),
          pageCount: Joi.number(),
          readPage: Joi.number(),
          reading: Joi.boolean().truthy('1').falsy('0'),
        }),
        failAction: errorHandler,
      },
    },
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookHandler,
    options: {
      validate: {
        params: Joi.object({
          bookId: Joi.string(),
        }),
        failAction: errorHandler,
      },
    },
  },
];

module.exports = routes;
