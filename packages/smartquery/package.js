Package.describe({
  name: "smartquery",
  summary: "Smartquery",
  version: "0.1.0"
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.0");
  
  api.use([
    'standard-app-packages',
    'dburles:mongo-collection-instances@0.3.4'
  ]);

  api.addFiles([
    'lib/smartquery.js'
  ], ['client', 'server']);

  api.addFiles([
  ], ['client']);

  api.addFiles([
    'lib/publications.js'
  ], ['server']);

  api.export("Smartquery");

});
