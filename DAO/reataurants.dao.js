import mongoDb from 'mongodb'
const objectId = mongoDb.ObjectId

let restaurants;

export default class RestaurantsDAO{
    static async injectDB(conn){
        //this method is used for initially connecting to the database
        //this method will be called as soon as the server starts. 
        //We will get a reference to our restaurants db - line 1
        //conn is the connection that is made to the mongodb

        if(restaurants){
            //if restaurants reference is already filled we are returning undefined ...i.e. not doing anything
            return
        }
        try{
            //if restaurants ref is not filled then we get the reference to that specific db 
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants")
            // here we are trying to connect to the sample_restaurants and get the collection restaurants 
        }catch(err){
            console.log(`Unable to establish a collection handle in restaurantsDAO: ${err}`)
        }
    }

    static async getRestaurants({
        filters = null,
        page = 0,
        restaurantsPerPage = 20
    }= {})
    {
        console.log('this is entered')
        // this function getRestaurants will be called when we want to get list all the restaurants
        // from the database.
        // the method takes an options object which has filter option , page option and 
        // how many restaurants to be displayed per page option for fetching the restaurants
        
        let query;
        // this query constructed to be passed on for fetching the list of restaurants from db
        //it will remain empty unless the getRestaurants is called with filters 

        if(filters){
            //here there are multiple options for filters based on which the query will be created and
            // the data can be fetched based on that filtered query

            if("name" in filters){
                //search by name
                query = {$text : {$search : filters["name"]}}
                // doing text search - need to specify in atlas which fields come in text search

            }else if("cuisine" in filters){
                //search by cuisine
                
                query = {"cuisine" : {$eq: filters["cuisine"]}}
                // if cuisine in the db EQUALS the cuisine passed in the filter return result based on cuisine

            }else if("zipcode" in filters){
                //search by zipcode

                query = {"address.zipcode" : {$eq: filters["zipcode"]}}
                // if zipcode in the db EQUALS the zipcode passed in the filter return result based on zipcode
            }
        }

        let cursor

        try{
            console.log('this is entered 2')
            cursor = await restaurants.find(query)
            //restaurants is a reference made to the specfic collection and we are finding restaurants
            // based on the query we constructed

        }catch(err){
            console.error(`Unable to issue find command: ${err}`)
            return {
                restaurantsList:[], totalNumberOfRestaurants : 0
            }
        }

        const displayCursor = cursor.limit(21).skip(21*page)
        // here we are limiting the number of restaurants that can be displayed.
        try{
            const restaurantsList = await displayCursor.toArray()
            // we basically set the limited list to an Array

            const totalNumberOfRestaurants = await restaurants.countDocuments(query)
            // countDocuments(filter) - Gets the number of documents matching the filter. 

            return {
                restaurantsList,
                totalNumberOfRestaurants
            }
        }catch(err){
            console.error(`Unable to convert cursor to array or problem counting documents, ${err}`)
            return {
                restaurantsList : [],
                totalNumberOfRestaurants: 0
            }
        }
    }
    

    static async getRestaurantById (id){
        try{
            //creating a pipeline to match different collections together
            const pipeline = [
                {
                    // this is a keyword for having an exact match of the id of restaurant
                    $match:{
                        _id: objectId(id)
                    }
                },
                {
                    //this works similar to vlookup or references to other collections
                    //lookup is part of the mongodb aggregation pipeline
                    $lookup:{
                        // from specifies collection name
                        from: "reviews",
                        let:{
                            id: "$_id"
                        },
                        pipeline:[
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$restaurant_id", "$$id"],
                                    },
                                },
                            },
                            {
                                $sort:{
                                    date: -1
                                },
                            },
                        ],
                        as: "reviews",
                    },
                },
                // {
                //     $addFields: {
                //         review: "$reviews"
                //     },
                // },
            ]

            return await restaurants.aggregate(pipeline).next()
        }catch(err){
            console.error(`Something went wrong in getRestaurantById: ${err}`)
            throw err
        }
    }

    static async getCuisines(){
        let cuisines = []
        try{
            cuisines = await restaurants.distinct("cuisine")
            console.log(cuisines)
            return cuisines
        }catch(err){
            console.error(`Unable to get cuisines ${err}`)
            return cuisines
        }
    }

}