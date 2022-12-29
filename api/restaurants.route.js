import express from 'express'
import restaurantController from './restaurants.controller.js'
import reviewsController from './reviews.controller.js'

const router = express.Router()

router.route('/').get(restaurantController.apiGetRestaurants)
router.route('/id/:id').get(restaurantController.apiGetRestaurantById)
router.route('/cuisines').get(restaurantController.apiGetRestaurantCuisines)
//creating post put delete route
router
    .route('/review')
    .post(reviewsController.apiPostReview)
    .put(reviewsController.apiUpdateReview)
    .delete(reviewsController.apiDeleteReview)

export default router