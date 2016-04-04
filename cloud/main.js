
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
	var Roommate = Parse.Object.extend('Roommate');
	var roommate = new Roommate();
	roommate.id = request.params.roommate;
	var query = new Parse.Query(Parse.Object.extend('Swipe'));
	query.equalTo('roommate2',request.user);
	query.equalTo('roommate1',roommate);
	console.log("user swiped is running!");

	query.first().then((swipe) => {
    console.log("before save");
    //swipe.set("status",2);
    //userData.set("verificationCode", randomNumber);
    return swipe.save(null, { useMasterKey: true });
  }).then((userDataAgain) => {
    console.log('after save');
    response.success('whatever you want to return');
  }, (error) => {
    console.log(error);
    response.error(error);
  });
	//if(request.params)
});