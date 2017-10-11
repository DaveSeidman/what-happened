const Rsync = require('rsync');
const webpack = require('webpack');
const config = require('./config.json');
const webpackConfig = require('./webpack.config');

const rsync = new Rsync()
  .shell('ssh')
  .flags('aruz')
  .source(['./dist', './server.js', './config.json'])
  .destination(`${config.aws.user}@${config.aws.host}:/home/ec2-user/what-happened`);

console.log('bundling site with webpack');
webpack(webpackConfig, (err, stats) => {
  if (err) { return console.log('webpack error:', err); }

  console.log('webpack bundled successfully');

  rsync.execute((err, code, cmd) => {
    if (err) { return console.log('rsync error', err); }

    console.log('successfully moved files to server');
  });
});
