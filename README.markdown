# Meteor Server Info

[Meteor](http://meteor.com) package for querying a meteor app for diagnostics information.

The package sets up a route (By default at /info) that returns a json object containing useful debugging about your running Meteor app.

This is really useful for querying your application state from an external source, such as shell scripts that may forward the data to cloudwatch or other logs.

Some example output:

```
{
    "extras": {
      "commit": "fb5954a395612c260d78d4a44df7bee12131c5ef"
    },
    "counts": {
        "nCollectionsWithLRSes": {
            "foos": 1,
            "bars": 1,
            "meteor_accounts_loginServiceConfiguration": 1,
            "notifications": 1,
            "users": 3
        },
        "nDocuments": {
            "foos": 1,
            "bars": 3,
            "meteor_accounts_loginServiceConfiguration": 1,
            "users": 1
        },
        "nLiveResultsSets": 7,
        "nObserveHandles": 7,
        "nSessions": null,
        "nSockets": 1,
        "nSocketsWithLivedataSessions": 0,
        "nSubs": {
            "base": 1,
            "meteor.loginServiceConfiguration": 1
        }
    },
    "ec2": {
        "ami-id": "XXX",
        "ami-launch-index": "0",
        "ami-manifest-path": "(unknown)",
        "ancestor-ami-ids": "unavailable",
        "availability-zone": "us-west-1a",
        "block-device-mapping": "ami",
        "instance-action": "none",
        "instance-id": "XXX",
        "instance-type": "m1.medium",
        "kernel-id": "XXX",
        "local-hostname": "XXX",
        "local-ipv4": "XXX",
        "mac": "unavailable",
        "product-codes": "unavailable",
        "profile": "default-paravirtual",
        "public-hostname": "XXX",
        "public-ipv4": "XXX",
        "ramdisk-id": "unavailable",
        "reserveration-id": "unavailable",
        "security-groups": "web",
        "user-data": "unavailable"
    }
}
```

## Installation

Meteor ServerInfo can be installed with [Meteorite](https://github.com/oortcloud/meteorite/). From inside a Meteorite-managed app:

``` sh
$ mrt add server-info
```

## Usage

Install the package, then access /info on your running application. By default, the route is protected by a username/password combinbation of insecure:secure-me that you should promptly change.

From the command line, you could run `curl http://insecure:secure-me@localhost:3000/info`.

## Configuration

You can set the path and http basic authentication credentials like

```
ServerInfo.settings = {
  path: '/info',
  user: 'insecure',
  password: 'secureme',
  extras: undefined //a function or any other data to add
};
```

*extras* is an optional field that will be returned as part of the json object. If you provide a function, it will be evaluated and it's return value will be added to the json object.

## License 

MIT. (c) Percolate Studio