import { Router } from 'express'
import {
  getBooks,
  getBookById,
  getHistory,
  getFavorites,
  addFavorite,
  removeFavorite,
  getReviews,
  addReview,
  saveProgress,
} from '../controllers/books.controller.js'

export const booksRouter = Router()

booksRouter.get('/', getBooks)
booksRouter.get('/history', getHistory)
booksRouter.get('/favorites', getFavorites)
booksRouter.get('/:id', getBookById)
booksRouter.post('/:id/favorite', addFavorite)
booksRouter.delete('/:id/favorite', removeFavorite)
booksRouter.get('/:id/reviews', getReviews)
booksRouter.post('/:id/reviews', addReview)
booksRouter.put('/:id/progress', saveProgress)
