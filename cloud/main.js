var Roommate = Parse.Object.extend('Roommate');
var Swipe = Parse.Object.extend('Swipe');


Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.beforeSave(Parse.Object.extend('Roommate'), function(request, response) {
	if(request.object.get('viewed') == null) {
		request.object.set('viewed',[]);
	}
	response.success();
});

Parse.Cloud.beforeSave(Parse.User, function(request, response) {
  console.log("beginning of beforeSave");
  if(request.object.get('viewed') == null) {
    request.object.set('viewed',[]);
  }
  if(phoneNumber == null){
    response.success();
    return;
  }
  console.log(request.object.get('phoneNumber').substring(0,1));
  if(parseInt(request.object.get('phoneNumber').substring(0,1)) == null) {
    var phoneNumber = request.object.get('phoneNumber');
    var cleanPhoneNumber = "";
    for(var i =0; i<phoneNumber.length; i++){
      if(isNaN(parseInt(phoneNumber[i].substr(0,1)))){
        
      }
      else {
        cleanPhoneNumber = cleanPhoneNumber + phoneNumber[i];
      }
    }
    request.object.set('phoneNumber',cleanPhoneNumber);
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
  roommate.id = request.params.roommateId;
  var userRoomate = request.user.get("roommate");
  var q1 = new Parse.Query(Parse.Object.extend('Swipe'));
  q1.equalTo('roommate2', userRoomate);
  q1.equalTo('roommate1', roommate);
  var q2 = new Parse.Query(Parse.Object.extend('Swipe'));
  q2.equalTo('roommate1', userRoomate);
  q2.equalTo('roommate2',roommate);

  var matchQuery = Parse.Query.or(q2,q1);
  matchQuery.equalTo('r1LikesR2', true);
  matchQuery.equalTo('r2LikesR1', true);
  matchQuery.first().then((swipe) => {
    if(swipe != null){
      var query = new Parse.Query(Parse.User);
      query.equalTo('roommate', roommate);
      return query.first();
        // return swipe.destroy(null, {useMasterKey: true});
    }
    else {
      response.error("Match not found");
    }
    return swipe.save(null, { useMasterKey: true });
  }).then((userData) => {
      response.success(userData.get('phoneNumber'));
  }, (error) => {
    console.log(error);
    response.error(error);
  });
});