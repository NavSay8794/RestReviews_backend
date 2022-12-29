import ReviewDAO from "../DAO/reviews.dao.js";

export default class ReviewsController {

    static apiPostReview = async (req,res,next)=>{
        try{
            const restaurantId = req.body.restaurant_id;
            const review = req.body.text
            const userInfo = {
                name: req.body.name,
                _id: req.body.user_id
            }

            const date = new Date()

            // for adding a review for a restaurant we need to get the restaurantId,
            // review as a text from frontend and the information of the user like name and id
            // we also need to add the date on which the review is made
            const reviewResponse = await ReviewDAO.addReview(restaurantId, userInfo, review, date)
            res.status(201).json({
                status: 'Success',
                reviewResponse
            })

        }catch(err){
            res.status(500).json({
                error: `Something Went Wrong : ${err}`
            })
        }
    }
    static apiUpdateReview = async (req,res,next)=>{
        try{
            const reviewId = req.body.review_id
            const text = req.body.text
            const date = new Date()

             // for updating a review for a restaurant we need to get the review id,
            // review as a text from frontend
            // we also need to add the date on which the review is updated

            const reviewResponse = await ReviewDAO.updateReview(reviewId, req.body.user_id, text, date)
            let {error} = reviewResponse

            if(error){
                res.status(400).json({
                    error
                })
            }

            if(reviewResponse.modifiedCount === 0){
                throw new Error(
                    "unable to update review - user may not be original poster"
                )
            }

            res.status(201).json({
                status: 'success'
            })

        }catch(err){
            res.status(500).json({
                error: `Something Went Wrong : ${err}`
            })
        }
    }
    static apiDeleteReview = async (req,res,next)=>{
        try{
            const reviewId = req.query.id;
            const userId = req.body.user_id
            // for http delete request it is non standard to have anything in the body

            const reviewResponse = await ReviewDAO.deleteReview(reviewId, userId)

            res.status(200).json({
                status: 'success',
                reviewResponse
            })

        }catch(err){
            res.status(500).json({
                error: `Something Went Wrong : ${err}`
            })
        }
    }
}