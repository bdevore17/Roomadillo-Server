
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.beforeSave(Parse.Object.extend("Roommate"), function(request, response) {
	if(request.object.get("viewed") == null) {
		request.object.set("viewed",[]);
	}
	response.success();
});
