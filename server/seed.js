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
      postId: _.sample(allPosts)._id
    });
  }
});