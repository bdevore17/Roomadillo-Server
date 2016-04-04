
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.beforeSave(Parse.Object.extend("Roommate"), function(request, response) {
	if(request.object.get("viewed") == null) {
		request.object.set("viewed",[]);
	}
	response.success();
});

Parse.Cloud.define('userSwiped', function(request, response) {
	var roommate = new Parse.Object.extend('Roommate');
	roommate.id = request.params.roommate;
	var query = new Parse.Query(Parse.Object.extend('Swipe'));
	query.equalTo('roommate2',request.user);
	query.equalTo('roommate1',roommate);
	query.first({
    success: function(swipe) {
    	swipe.set("r2LikesR1",request.params.like);
    	swipe.save().then(function() {
        	response.success("succcess!");
    	});
    },
    error: function(error) {
    	console.log(error);
        response.error("error from userSwiped");
    // error is an instance of Parse.Error.
    }
    });
	//if(request.params)
});