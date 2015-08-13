'use strict';

require('antd/lib/index.css');

var MyProgress = require('./progress');
var React = require('react');

React.render(
  <MyProgress />
  , document.getElementById('components-progress-demo-circle-dynamic'));
