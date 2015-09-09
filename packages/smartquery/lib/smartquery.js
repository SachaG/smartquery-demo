Smartquery = {
  subscriptions: {}
};

Smartquery.addRule = function (rule) {

}

Smartquery.getPublicationName = function (collection) {
  return "Smartquery_"+collection._name;
}

if (Meteor.isClient) {
  
  Smartquery.find = function (id, cursor) {

    // var collection = this;

    console.log(id)

    var sub;
    var collection = Mongo.Collection.get(cursor.collection.name);
    var selector = cursor.matcher._selector;
    
    var options = {};

    if (typeof cursor.fields !== "undefined") { options.fields = cursor.fields; }
    if (typeof cursor.limit !== "undefined")  { options.limit = cursor.limit; }
    if (typeof cursor.skip !== "undefined")   { options.skip = cursor.skip; }
    if (cursor.sorter !== null)               { options.sort = cursor.sorter; }

    if (!!Smartquery.subscriptions[id]) {
      sub = Smartquery.subscriptions[id];
    } else {
      sub = Meteor.subscribe(Smartquery.getPublicationName(collection), selector, options);
      // var subFunction = function () {
      //   return Meteor.subscribe(Smartquery.getPublicationName(collection), selector, options, function () {
      //     console.log(id+' stopped')
      //   }, function () {
      //     console.log(id+' ready')
      //   });
      // };
      // sub = Tracker.nonreactive(subFunction);
      Smartquery.subscriptions[id] = sub;
    }

    // if (!!Smartquery.subscriptions[id]) {
    //   console.log(1)
    //   var sub = Smartquery.subscriptions[id];
    // } else {
    //   console.log(2)
    //   var sub = Meteor.subscribe(Smartquery.getPublicationName(collection), selector, options);
    //   Smartquery.subscriptions[id] = sub;
    // }

    // console.log(sub)

    return {
      sub: sub,
      ready: function () {
        return sub.ready()
      },
      cursor: cursor
    };
  }

}