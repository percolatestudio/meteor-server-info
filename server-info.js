ServerInfo = {
  settings: {
    path: '/info',
    user: 'insecure',
    password: 'secureme'
  },

  get: function() {
    return {
      ec2: getEc2Metadata(),
      commit: getCommit(),
      counts: getConnectionCounts()
    };
  }
}

if(typeof(Fiber)=="undefined") Fiber = Npm.require('fibers');

var connectHandlers = WebApp.connectHandlers;
var connect = Npm.require("connect");
var child_process = Npm.require('child_process');
var Future = Npm.require('fibers/future');

connectHandlers
  .use(connect.query())
  .use(connect.bodyParser())
  .use(connect.basicAuth(function(user, password){
    return ServerInfo.settings.user === user 
      && ServerInfo.settings.password == password;
  }))
  .use(function(req, res, next) {
    if (req.url !== ServerInfo.settings.path)
      return next();

    Fiber(function () {
      res.setHeader('content-type', 'application/json');
      return res.end(JSON.stringify(ServerInfo.get()));
    }).run();
});

// returns the parsed result of running the ec2metadata command or nothing if
// the command fails
function getEc2Metadata() {
  try {
    var command = 'ec2metadata';
    var future = new Future();
    child_process.exec(command, future.resolver());
    var data = future.wait();
  } catch(exc) {
    console.log('ServerInfo: ec2metadata unavailable');
    return;
  }

  var lines = data.split('\n');

  var ec2 = {};
  _.each(lines, function(line) {
    var vals = line.split(': ');

    // only add lines of the form 'key: value\n'
    if (vals.length == 2)
      ec2[vals[0]] = vals[1];
  });

  return ec2;
}

// XXX: refactor this out to be generic
// returns the commit hash of it exists in settings.public or nothing.
function getCommit() {
  if (Meteor.settings.public)
    return Meteor.settings.public.commit;
}

// get a count of the current # of connections and each named sub
function getConnectionCounts() {
  var results = {
    nSockets: 0,
    nSocketsWithLivedataSessions: 0,
    nSubs: {},
    nDocuments: {},
    nLiveResultsSets: 0,
    nObserveHandles: 0,
    nCollectionsWithLRSes: {},
  };
  
  var initKey = function(part, key) {
    part[key] = part[key] || 0;
  }
  
  // check out the connections and what we know about them
  _.each(Meteor.default_server.stream_server.open_sockets, function(socket) {
    results.nSockets += 1;
    
    if (socket.meteor_session)
      results.nSocketsWithLivedataSessions += 1;
  });
  
  // check out the sessions
  _.each(Meteor.default_server.sessions, function(session, id) {
    results.nSessions += 1;
    
    _.each(session._namedSubs, function(info) {
      initKey(results.nSubs, info._name)
      results.nSubs[info._name] += 1;
      
      _.each(info._documents, function(docs, type) {
        initKey(results.nDocuments, type);
        results.nDocuments[type] += _.keys(docs).length;
      });
    });
  });
  
  // check out the LRSes
  _.each(MongoInternals.defaultRemoteCollectionDriver().mongo._liveResultsSets, function(resultSet, key) {
    results.nLiveResultsSets += 1;
    results.nObserveHandles += _.values(resultSet._observeHandles).length;
    
    var collectionName = resultSet._cursorDescription.collectionName;
    initKey(results.nCollectionsWithLRSes, collectionName)
    results.nCollectionsWithLRSes[collectionName] += 1;
  });
  
  
  return results;
}