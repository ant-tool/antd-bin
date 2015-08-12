'use strict';

require('antd/lib/index.css');

var ProgressCircle = require('antd/lib/progress').Circle;
var React = require('react');

var MyProgress = React.createClass({
  getInitialState() {
    return {
      percent: 0
    };
  },
  componentDidMount: function() {
    var self = this;
    setInterval(function() {
      if (self.state.percent < 100) {
        self.state.percent += 4;
      }
      self.setState({
        percent: self.state.percent
      });
    }, 200);
  },
  render() {
    return <div>
      <ProgressCircle percent={this.state.percent} />
      foo
    </div>;
  }
});

module.exports = MyProgress;
