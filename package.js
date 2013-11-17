Package.describe({
  summary: "Returns diagnostics info on server internals via a connect route."
});

Package.on_use(function (api, where) {
  api.add_files('server-info.js', 'server');
});
