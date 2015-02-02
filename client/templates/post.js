Template.postList.helpers({
	posts: function(){
		return Posts.find({}, {sort: {submitted: -1}});
	}
});

Template.postItem.helpers({
	domain: function(){
		var a = document.createElement('a');
		a.href = this.url;
		return a.hostname;
	}
});

Template.postSubmit.events({
	"submit .post-submit-form": function(e){
		e.preventDefault();
		var post = {
			url: e.target.url.value,
			title: e.target.title.value
		};

		Meteor.call('postInsert', post, function(error, result) {
			if (error)
				return alert(error.reason);
			if (result.postExists)
				alert('This link has already been posted');
			Router.go('postPage', {_id: result._id});
		});
	}
});

Template.postEdit.events({
	"submit #post-edit-form": function(e){
		var params = {
			url: e.target.url.value,
			title: e.target.title.value
		};

		Posts.update(this._id, { $set: params }, function(error){
			if(error) console.log(error.reason);
			else Router.go("postPage", { _id: this._id });
		});

		return false;
	},
	"click #delete": function(e){
		if(confirm("Delete this post?")){
			Posts.remove(this._id);
			Router.go("postsList");
		}
		return false;
	}
});