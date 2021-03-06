var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');




var _addReview = function(req, res, hotel){

hotel.reviews.push({
	name: req.body.name,
	rating: parseInt(req.body.rating, 10),
	review: req.body.review
});


// saving a parent doc would save the subdoc automatically. But just the subdoc cant be saved.
// so work directly on the hotel model by using the method save to save the reivew sundoc.

hotel.save(function(err, hotelUpdated){
	if(err){
		res
			.status(500)
			.json(err);
	} else {
		
		res
			.status(201)
			// sending back just the review and not the entire doc.
			// so recently added review would be the last one.
			.json(hotelUpdated.reviews[hotelUpdated.reviews.length - 1]); 
				
	}
});

}

// Get all reviews for a hotel

module.exports.reviewsGetAll = function(req,res){
var hotelId = req.params.hotelId;
console.log("get hotelId", hotelId);
	Hotel
    	.findById(hotelId)
    	.select('reviews')// select allows to select which part of document do you want.
    	.exec(function(err,doc){ //entire subdoc hotel by id in doc
    		console.log("Returned doc: ",doc);
        	res
            	.status(200)
            	.json(doc.reviews);

    });
};

// Get single review for a hotel
module.exports.reviewsGetOne = function(req,res){
	var hotelId = req.params.hotelId;
	var reviewId = req.params.reviewId;
	console.log("get reviewId " + reviewId + "for hotelId" + hotelId);
	Hotel
    	.findById(hotelId)
    	.select('reviews')  // select allows to select which part of document do you want.
    	.exec(function(err,hotel){
    		console.log("Returned doc: ",hotel);
    		var review = hotel.reviews.id(reviewId);
        	res
            	.status(200)
            	.json(review);

    });
};


// Adding subdocs in mongodb.
// id and createdOn is automatically created for reviews.
module.exports.reviewsAddOne = function(req,res){
	var hotelId = req.params.hotelId;
	console.log("get hotelId", hotelId);
	Hotel
    	.findById(hotelId)
    	.select('reviews')
    	.exec(function(err, doc){
    		var response = {
    			status: 200,
    			message:[]
    		};
    		if(err){
    			console.log("Error finding the hotel");
    			response.status=500;
    			response.message=err;
    		} else if(!doc){
    			console.log("the hotel id not found",hotelId);
    			response.status=404;
    			response.message= {
    				"message": "The hotelid is not found " + hotelId
    			};
    			
    		} if (doc) {
    			_addReview(req, res, doc);
    		} else {
    		res
    			.status(response.status)
    			.json(response.message);	
    		}
    		
    	});


};



module.exports.reviewsUpdateOne = function(req, res){


var hotelId = req.params.hotelId;
  var reviewId = req.params.reviewId;
  console.log('PUT reviewId ' + reviewId + ' for hotelId ' + hotelId);

  Hotel
    .findById(hotelId)
    .select('reviews')
    .exec(function(err, hotel) {
      var thisReview;
      var response = {
        status : 200,
        message : {}
      };
      if (err) {
        console.log("Error finding hotel");
        response.status = 500;
        response.message = err;
      } else if(!hotel) {
        console.log("Hotel id not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "Hotel ID not found " + id
        };
      } else {
        // Get the review
        thisReview = hotel.reviews.id(reviewId);
        // If the review doesn't exist Mongoose returns null
        if (!thisReview) {
          response.status = 404;
          response.message = {
            "message" : "Review ID not found " + reviewId
          };
        }
      }
      if (response.status !== 200) {
        res
          .status(response.status)
          .json(response.message);
      } else {
        thisReview.name = req.body.name;
        thisReview.rating = parseInt(req.body.rating, 10);
        thisReview.review = req.body.review;
        hotel.save(function(err, hotelUpdated) {
          if (err) {
            res
              .status(500)
              .json(err);
          } else {
            res
              .status(204)
              .json();
          }
        });
      }
    });

    
};


module.exports.reviewsDeleteOne = function (req, res){

    var hotelId = req.params.hotelId;
  var reviewId = req.params.reviewId;
  console.log('PUT reviewId ' + reviewId + ' for hotelId ' + hotelId);

  Hotel
    .findById(hotelId)
    .select('reviews')
    .exec(function(err, hotel) {
      var thisReview;
      var response = {
        status : 200,
        message : {}
      };
      if (err) {
        console.log("Error finding hotel");
        response.status = 500;
        response.message = err;
      } else if(!hotel) {
        console.log("Hotel id not found in database", id);
        response.status = 404;
        response.message = {
          "message" : "Hotel ID not found " + id
        };
      } else {
        // Get the review
        thisReview = hotel.reviews.id(reviewId);
        // If the review doesn't exist Mongoose returns null
        if (!thisReview) {
          response.status = 404;
          response.message = {
            "message" : "Review ID not found " + reviewId
          };
        }
      }
      if (response.status !== 200) {
        res
          .status(response.status)
          .json(response.message);
      } else {
        hotel.reviews.id(reviewId).remove();
        hotel.save(function(err, hotelUpdated) {
          if (err) {
            res
              .status(500)
              .json(err);
          } else {
            res
              .status(204)
              .json();
          }
        });
      }
    });

    


}
