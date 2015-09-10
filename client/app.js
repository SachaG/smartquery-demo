var postsLimit = 2;
var commentsLimit = 2;
var commentsLimits = {};

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