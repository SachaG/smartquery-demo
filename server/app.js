// generate dummy content
Meteor.startup(function () {

  Posts.remove({});
  Comments.remove({});

  for (i = 1; i <= 30; i++) {
    var published = !!(i%2);
    Posts.insert({
      title: Fake.sentence(6),
      body: Fake.paragraph(3),
      published: published
    });
  }

  var allPosts = Posts.find().fetch();

  for (i = 1; i <= 200; i++) {
    Comments.insert({
      body: Fake.paragraph(3),
      postId: _.sample(allPosts)._id
    });
  }
});

// publish posts
// Meteor.publish('posts', function(limit) {
//   Meteor._sleepForMs(2000);
//   return Posts.find({}, {limit: limit});
// });

// Smartquery.addRule(function (document, userId) {
//   return document.published === true;
// });