import React, { Component } from 'react';
import RFIDIcon from 'material-ui/svg-icons/communication/rss-feed';
import Paper from 'material-ui/Paper';
import Dock from 'react-dock';

import Users from './Users/Users';
import Dashboard from './Dashboard/Dashboard';
import Devices from './Devices/Devices';
import DevTools from './DevTools/DevTools';

import mqttClient from './MQTTClient';

import customTheme from './custom-mui-theme';
import styles from './style';

const LEFT_MENU_CHOICES = [
  'Dashboard', 'Devices', 'Users'
];

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedMenu: LEFT_MENU_CHOICES[0],
      isDockVisible: true,
      dockPosition: 'bottom'
    };

    this.keydown = this.keydown.bind(this);
  }


  componentDidMount() {
    mqttClient.connect('mqtt://127.0.0.1:3300');

    document.addEventListener('keydown', this.keydown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keydown);
  }

  keydown(event) {
    if (event.key === 'h' && event.ctrlKey) {
      this.setState({
        isDockVisible: !this.state.isDockVisible,
      });
    }
  }

  renderContent() {
    const { selectedMenu } = this.state;

    switch (selectedMenu) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Users':
        return <Users />;
      case 'Devices':
        return <Devices />;
      default:
        return null;
    }
  }

  renderMenuItems() {
    const { selectedMenu } = this.state;

    return LEFT_MENU_CHOICES.map(leftMenuChoice =>
      (
        <div
          style={{ ...styles.leftMenuItem }}
          onClick={() => { this.setState({ selectedMenu: leftMenuChoice }); }}
          key={leftMenuChoice}
        >
          {(selectedMenu === leftMenuChoice) ? (
            <div style={{
              position: 'absolute',
              top: '0px',
              left: '0px',
              bottom: '0px',
              width: '5px',
              backgroundColor: customTheme.palette.primary1Color
            }}
            />) : null}
          <span>{leftMenuChoice}</span>
        </div>
      )
    );
  }

  render() {
    return (
      <div style={styles.container}>
        <div style={styles.leftMenu}>
          <div style={styles.leftMenuHeader}>
            <RFIDIcon style={styles.logoIcon} />
            <span style={styles.logoText}>RFID Access Control</span>
          </div>
          <div style={styles.leftMenuItems}>
            {this.renderMenuItems()}
          </div>
        </div>
        <div style={styles.content}>
          <Paper style={styles.contentInner}>
            {this.renderContent()}
          </Paper>
        </div>
        <Dock
          position={this.state.dockPosition}
          isVisible={this.state.isDockVisible}
          dimMode={'none'}
        >
          {<DevTools />}
        </Dock>
      </div>
    );
  }
}

export default App;
