## Meteor Server Info

[Meteor](http://meteor.com) package for querying a meteor app for diagnostics information.

### Usage

Install the package, then run `curl http://insecure:secure-me@localhost:3000/info`

### Configuration

You can set the path and http basic authentication credentials like

```
ServerInfo.settings = {
  path: '/info',
  user: 'insecure',
  password: 'secureme'
};
```