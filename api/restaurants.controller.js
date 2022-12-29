import RestaurantsDAO from "../DAO/reataurants.dao.js";
//this file contains the functions for db call

export default class RestaurantController {
  static async apiGetRestaurants(req, res, next) {
    //this method will be responsible for the logic behind fetching the restaurants list

    try {
      const restaurantsPerPage = req.query.restaurantsPerPage
        ? parseInt(req.query.restaurantsPerPage, 10)
        : 0;
      // converting the restaurant per page value into integer

      const page = req.query.page ? parseInt(req.query.page, 10) : 0;
      // converting the restaurant per page value into integer

      let filters = {};
      // below we are basically adding the filter options based on what is passed
      if (req.query.cuisine) {
        filters.cuisine = req.query.cuisine;
      } else if (req.query.zipcode) {
        filters.zipcode = req.query.zipcode;
      } else if (req.query.name) {
        filters.name = req.query.name;
      }

      const { restaurantsList, totalNumRestaurants } =
        await RestaurantsDAO.getRestaurants({
          filters,
          page,
          restaurantsPerPage,
        });
      //we are calling the getrestaurants method from the DAO for fetching the restaurants list

      let response = {
        restaurants: restaurantsList,
        page: page,
        filters: filters,
        entries_per_page: restaurantsPerPage,
        total_results: totalNumRestaurants,
      };

      // we are constructing the response object which needs to be sent back to the client

      res.json(response);
    } catch (err) {
        res.status(500).json({
            error: `Something Went Wrong : ${err}`
        })
    }
  }

  static async apiGetRestaurantById(req,res,next){
    try{
      let id = req.params.id || {}
      let restaurant = await RestaurantsDAO.getRestaurantById(id)

      if(!restaurant) {
        res.status(404).json({
          error: 'Not Found'
        })
        return
      }
      res.status(200).json({
        restaurant
      })
    }catch(err){
      console.log(`api , ${err}`)
      res.status(500).json({
        error: err
      })
    }
  }

  static async apiGetRestaurantCuisines(req,res,next){
    try{
      let cuisines = await RestaurantsDAO.getCuisines()
      res.status(200).json({
        cuisines
      })
    }catch(err){
      console.log(`api , ${err}`)
      res.status(500).json({
        error: err
      })
    }
  }
}
