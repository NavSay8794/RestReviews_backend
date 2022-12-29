import mongodb from 'mongodb'

const objectId = mongodb.ObjectId

let reviews;

export default class ReviewsDao {
    static async injectDB(conn){
        if(reviews){
            return;
        }
        try{
            reviews =  await conn.db(process.env.RESTREVIEWS_NS).collection("reviews")
        }catch(err){
            console.error(`unable to establish connection handles in userDAO: ${err}`)
        }
    }

    static async addReview(restaurantId, user , review, date){
        try{
            const reviewDoc = {
                name: user.name,
                user_id : user._id,
                date: date,
                text: review,
                restaurant_id: objectId(restaurantId) 
            }

            return await reviews.insertOne(reviewDoc)
        }catch(err){
            console.log(`Unable to post review ${err}`)
            return {error: err}
        }
    }

    static async updateReview(reviewId, userId, text,date){
        try{
            const updateResponse = await reviews.updateOne(
                {
                    _id: objectId(reviewId),
                    user_id: userId
                },
                {
                    $set:{
                        text: text,
                        date: date
                    }
                }
            )
            return updateResponse
        }catch(err){
            console.error(`Unable to update review: ${err}`)
            return {error: err}
        }
    }

    static async deleteReview(reviewId, userId){
        try{
            const deleteResponse = await reviews.deleteOne({
                _id: objectId(reviewId),
                user_id: userId
            })

            return deleteResponse
        }catch(err){
            console.error(`Unable to delete the review : ${err}`)
            return {error: err}
        }
    } 
}