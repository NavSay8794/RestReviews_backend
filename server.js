import express from 'express'
import cors from 'cors';
import restaurants from './api/restaurants.route.js'

const app = express()

//handles cross origin resource sharing
app.use(cors())

// server can accept json in req body
app.use(express.json())

app.use('/api/v1/restaurants' , restaurants)

app.use('*' , (req,res)=>{
    res.status(404).json({
        error: 'Page Not Found hehe'
    })
})


export default app