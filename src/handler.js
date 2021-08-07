const { nanoid } = require('nanoid');
const books = require('./books');

const storeBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid();
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };
  books.push(newBook);

  const isPushed = books.filter((book) => book.id === id).length > 0;

  if (isPushed) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    }).code(201);
  }

  return h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  }).code(500);
};

const listBookHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let listBooks = books;
  if (typeof name !== 'undefined') {
    listBooks = listBooks.filter((book) => new RegExp(name, 'i').test(book.name));
  }
  if (typeof reading !== 'undefined') {
    listBooks = listBooks.filter((book) => book.reading === reading);
  }
  if (typeof finished !== 'undefined') {
    listBooks = listBooks.filter((book) => book.finished === finished);
  }

  listBooks = listBooks.map((book) => (
    { id: book.id, name: book.name, publisher: book.publisher }));

  return h.response({
    status: 'success',
    data: {
      books: listBooks,
    },
  }).code(200);
};

const detailBookHandler = (request, h) => {
  const { bookId } = request.params;

  const filteredBook = books.find((book) => book.id === bookId);

  if (typeof filteredBook !== 'undefined') {
    return h.response({
      status: 'success',
      data: {
        book: filteredBook,
      },
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  }).code(404);
};

const updateBookHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex === -1) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    }).code(404);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  books[bookIndex] = {
    ...books[bookIndex],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  };

  return h.response({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  }).code(200);
};

const deleteBookHandler = (request, h) => {
  const { bookId } = request.params;

  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex === -1) {
    return h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
  }

  books.splice(bookIndex, 1);

  return h.response({
    status: 'success',
    message: 'Buku berhasil dihapus',
  }).code(200);
};

function errorHandler(request, h, err) {
  return h.response({
    status: err.output.statusCode === 400 ? 'fail' : 'error',
    message: err.output.payload.message,
  })
    .code(err.output.statusCode)
    .takeover();
}

module.exports = {
  storeBookHandler,
  listBookHandler,
  detailBookHandler,
  updateBookHandler,
  deleteBookHandler,
  errorHandler,
};
