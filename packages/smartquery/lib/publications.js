Meteor.startup(function () {
  
  var collections = Mongo.Collection.getAll();

  collections.forEach(function (collection) {
    var collection = collection.instance;
    Meteor.publish(Smartquery.getPublicationName(collection), function (selector, options) {
      return collection.find(selector, options);
    });
  });

});