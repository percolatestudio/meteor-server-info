Package.describe({
  summary: "Returns diagnostics info on server internals via a connect route."
});

Npm.depends({connect: "2.9.0"});

Package.on_use(function (api, where) {
  api.use(['webapp', 'mongo-livedata'], 'server');
  api.add_files('server-info.js', 'server');

  if (api.export)
    api.export('ServerInfo', 'server');
});
