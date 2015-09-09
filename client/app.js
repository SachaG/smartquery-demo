// Posts

Template.posts.created = function () {
  this.limit = new ReactiveVar(5);
};

Template.posts.helpers({
  // the posts cursor
  posts: function () {
    var limit = Template.instance().limit.get();
    var cursor = Posts.find({}, {limit: limit});
    return Smartquery.find("posts", cursor);
  },
  isReady: function () {
    return this.sub.ready();
  }
});

Template.posts.events({
  'click .load-more': function (event, instance) {
    event.preventDefault();
    var limit = instance.limit.get();
    limit += 5;
    instance.limit.set(limit);
  }
});

// Comments

Template.comments.created = function () {
  this.limit = new ReactiveVar(3);
};


Template.comments.helpers({
  comments: function () {
    var limit = Template.instance().limit.get();
    var cursor = Comments.find({postId: this.postId}, {limit: limit});
    return Smartquery.find("comments_for_"+this.postId, cursor);
  },
  isReady: function () {
    return this.sub.ready();
  }
});

Template.comments.events({
  'click .load-more': function (event, instance) {
    event.preventDefault();
    var limit = instance.limit.get();
    limit += 3;
    instance.limit.set(limit);
  }
});