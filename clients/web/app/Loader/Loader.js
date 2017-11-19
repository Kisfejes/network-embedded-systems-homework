import React, { Component } from 'react';

const stateLabels = ['', '.', '..', '...'];

export default class Loading extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: 0,
      interval: null
    };
  }

  componentWillMount() {
    const interval = setInterval(this.changeLoadingState, 500);
    this.setState({
      interval
    });
  }

  componentWillUnmount() {
    const { interval } = this.state;
    if (interval !== null) {
      clearInterval(interval);
    }
  }

  changeLoadingState = () => {
    const { loading } = this.state;
    if (loading + 1 < stateLabels.length) {
      this.setState({
        loading: loading + 1
      });
    } else {
      this.setState({
        loading: 0
      });
    }
  }

  render() {
    const { loading } = this.state;

    return (
      <div style={{ width: '30px' }}>
        { stateLabels[loading] }
      </div>
    );
  }
}
