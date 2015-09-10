// ----------------------------------------------------------------------------------------- //
// --------------------------------------- BOTH -------------------------------------------- //
// ----------------------------------------------------------------------------------------- //

Posts = new Mongo.Collection("posts");
Comments = new Mongo.Collection("comments");

// ----------------------------------------------------------------------------------------- //
// -------------------------------------- CLIENT ------------------------------------------- //
// ----------------------------------------------------------------------------------------- //

if (Meteor.isClient) {

  var postsLimit = 2;
  var commentsLimit = 2;
  var commentsLimits = {};

  // Stats

  Template.stats.helpers({
    postCount: function () {
      return Posts.find().count();
    },
    commentCount: function () {
      return Comments.find().count();
    }
  });

  // Posts

  Template.posts.created = function () {
    this.limit = new ReactiveVar(postsLimit);
  };

  Template.posts.helpers({
    // the posts cursor
    posts: function () {
      var limit = Template.instance().limit.get();
      var cursor = Posts.find({}, {limit: limit});
      return SmartQuery.create("posts", cursor);
    },
    postClass: function () {
      return this.published ? "published" : "not-published";
    }
  });

  Template.posts.events({
    'click .load-more-posts': function (event, instance) {
      event.preventDefault();
      var limit = instance.limit.get();
      limit += postsLimit;
      instance.limit.set(limit);
    }
  });

  // Comments

  Template.comments.onCreated(function () {
    // initialize limit to default value, or value stored in commentsLimits global array
    var limit = !!commentsLimits[this.data.postId] ? commentsLimits[this.data.postId] : commentsLimit;
    this.limit = new ReactiveVar(limit);
  });

  Template.comments.helpers({
    comments: function () {
      var limit = Template.instance().limit.get();
      var cursor = Comments.find({postId: this.postId}, {limit: limit});
      return SmartQuery.create("comments_for_"+this.postId, cursor);
    }
  });

  Template.comments.events({
    'click .load-more-comments': function (event, instance) {
      event.preventDefault();
      var limit = instance.limit.get();
      limit += commentsLimit;
      instance.limit.set(limit);
    }
  });

  Template.comments.onDestroyed(function () {
    // save comments limit for this thread in global array
    commentsLimits[this.data.postId] = this.limit.get();
  });

}

// ----------------------------------------------------------------------------------------- //
// -------------------------------------- SERVER ------------------------------------------- //
// ----------------------------------------------------------------------------------------- //

if (Meteor.isServer) {

  // generate dummy content
  Meteor.startup(function () {

    Posts.remove({});
    Comments.remove({});

    for (i = 1; i <= 30; i++) {
      var published = !!(i%2);
      Posts.insert({
        title: Fake.sentence(3),
        body: Fake.paragraph(5),
        published: published
      });
    }

    var allPosts = Posts.find().fetch();

    for (i = 1; i <= 200; i++) {
      Comments.insert({
        body: Fake.paragraph(3),
        postId: _.sample(allPosts)._id,
        privateField: _.random(100)
      });
    }

    // make all users "admin" for demo purposes
    Meteor.users.update({}, {$set: {isAdmin: true}}, {multi: true});

  });

  SmartQuery.addRule(Posts, {
    filter: function (document) {
      var user = Meteor.users.findOne(this.userId);
      return (user && user.isAdmin) || document.published === true;
    }
  });

  SmartQuery.addRule(Comments, {
    fields: function () {
      return ["_id", "body", "postId"];
    }
  });

}