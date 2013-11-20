Package.describe({
  summary: "Returns diagnostics info on server internals via a connect route."
});

Npm.depends({connect: "2.9.0"});

Package.on_use(function (api, where) {
  api.use(['webapp'], 'server');
  api.add_files('server-info.js', 'server');
});
