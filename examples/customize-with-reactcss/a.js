'use strict';

var React = require('react');
var ReactCSS = require('reactcss');

class Button extends ReactCSS.Component {

  classes() {
    return {
      'default': {
        button: {
          background: '#4A90E2'
        }
      },
      'disabled-true': {
        button: {
          background: '#bbb'
        },
        span: {
          color: '#999'
        }
      }
    }
  }

  render() {
    return (
      <div is="button" onClick={this.props.onClick}>
        <span is="span">
          { this.props.label }
        </span>
      </div>
    )
  }
}

var App = React.createClass({

  getInitialState: function () {
    return { disabled: false };
  },

  toggleHandler() {
    this.setState({
      disabled: !this.state.disabled
    })
  },

  render() {
    return (
      <Button label="click to toggle" disabled={this.state.disabled} onClick={this.toggleHandler} />
    );
  }
});

React.render(<App />, document.getElementById('app'));
