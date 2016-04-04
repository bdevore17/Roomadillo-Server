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

Parse.Cloud.define('userSwiped', function(request, response) {
	var roommate = new Roommate();
	roommate.id = request.params.roommate;
	var query = new Parse.Query(Parse.Object.extend('Swipe'));
	query.equalTo('roommate2',request.user);
	query.equalTo('roommate1',roommate);
	console.log("user swiped is running!");

	query.first().then((swipe) => {
    console.log("before save");
    if(swipe != null){
    	swipe.set('r2LikesR1',request.params.like);
    }
    else {
    	swipe = new Swipe();
      swipe.set('roommate1', request.user);
      swipe.set('roommate2', roommate);
      swipe.set('r1LikesR2',request.params.like);
    }
    return swipe.save(null, { useMasterKey: true });
  }).then((userDataAgain) => {
    console.log('after save');
    response.success('success!');
  }, (error) => {
    console.log(error);
    response.error(error);
  });
	//if(request.params)
});