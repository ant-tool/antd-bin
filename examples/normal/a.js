'use strict';

require('antd/lib/index.css');

var ProgressCircle = require('antd/lib/progress').Circle;

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
    return <ProgressCircle percent={this.state.percent} />;
  }
});

React.render(
  <MyProgress />
  , document.getElementById('components-progress-demo-circle-dynamic'));
