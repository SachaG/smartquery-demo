Meteor.startup(function () {
  
  var collections = Mongo.Collection.getAll();

  collections.forEach(function (collection) {
    var collection = collection.instance;
    Meteor.publish(Smartquery.getPublicationName(collection), function (id, selector, options) {

      // publish count for total selector count, without limit
      var unlimitedOptions = _.clone(options);
      delete unlimitedOptions.options;
      Counts.publish(this, id, collection.find(selector, unlimitedOptions));
      
      return collection.find(selector, options);
    });
  });

});