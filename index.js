import app from "./server.js";

import mongodb from 'mongodb';
import dotenv from 'dotenv'
dotenv.config()

import RestaurantsDAO from "./DAO/reataurants.dao.js";
import ReviewsDao from "./DAO/reviews.dao.js";

const mongoCLient = mongodb.MongoClient

const port = process.env.PORT || 8000

mongoCLient.connect(
    process.env.RESTREVIEWS_DB_URI , 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        maxPoolSize: 50,
        waitQueueTimeoutMS: 2500
    }
)
    .catch(err =>{
        console.log(err.stack)
        // process.exit()
    })
    .then(async client =>{
        await RestaurantsDAO.injectDB(client)
        await ReviewsDao.injectDB(client)
        //here client acts as a connection string that we inject in the db

        app.listen(port , ()=>{
            console.log('Server is Running and Connected to Db')
        })
    })

