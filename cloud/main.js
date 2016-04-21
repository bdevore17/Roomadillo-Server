var Roommate = Parse.Object.extend('Roommate');
var Swipe = Parse.Object.extend('Swipe');


Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.beforeSave(Parse.Object.extend("Roommate"), function(request, response) {
	if(request.object.get("viewed") == null) {
		request.object.set("viewed",[]);
	}
	response.success();
});

Parse.Cloud.beforeSave(Parse.User, function(request, response) {
  if(request.object.get("viewed") == null) {
    request.object.set("viewed",[]);
  }
  response.success();
});

Parse.Cloud.define('userSwiped', function(request, response) {
	var roommate = new Roommate();
	roommate.id = request.params.roommate;
	var query = new Parse.Query(Parse.Object.extend('Swipe'));
	query.equalTo('roommate2',request.user.get('roommate'));
	query.equalTo('roommate1',roommate);
	console.log("user swiped is running!");
  var matchFound = false;
	query.first().then((swipe) => {
    if(swipe != null){
    	swipe.set('r2LikesR1',request.params.like);
      matchFound = (swipe.get('r1LikesR2') == true && swipe.get('r2LikesR1') == true);
      if(!matchFound)
        return swipe.destroy(null, {useMasterKey: true});
    }
    else {
    	swipe = new Swipe();
      swipe.set('roommate1', request.user.get('roommate'));
      swipe.set('roommate2', roommate);
      swipe.set('r1LikesR2',request.params.like);
    }
    return swipe.save(null, { useMasterKey: true });
  }).then((userDataAgain) => {
    response.success(matchFound);
  }, (error) => {
    console.log(error);
    response.error(error);
  });
	//if(request.params)
});

Parse.Cloud.define('getUserInfo', function(request, response) {
  var roommate = new Roommate();
  // parameters: roommate id 
  //check swipes for match
  //query user for roommate matching roommate id
  //respond with JSON RMSID and phone number
});



