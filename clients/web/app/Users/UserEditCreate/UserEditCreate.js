import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

import styles from './style';
import { generateRandomUserName, fetchAPI } from '../../util'

class UserEditCreate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: generateRandomUserName(),
      rfid: '',
      devices: [],
      selectedDevices: []
    };
  }

  async componentDidMount() {
    const devices = await fetchAPI('devices', 'list');
    if (devices) {
      this.setState({
        devices
      });
    }
  }

  async createUser() {
    const { userName, rfid, selectedDevices } = this.state;

    const newUser = await fetchAPI('users', 'create', {
      name: userName,
      rfid,
      deviceIds: selectedDevices
    });
    console.log(newUser);
  }

  renderDevices() {
    const { devices, selectedDevices } = this.state;

    return devices.map((device) => (
      <Checkbox
        key={device.id}
        label={device.name}
        checked={selectedDevices.includes(device.id)}
        onCheck={
          () => {
            if (selectedDevices.includes(device.id)) {
              const index = this.state.selectedDevices.indexOf(device.id);
              this.setState({
                selectedDevices: [
                  ...this.state.selectedDevices.slice(0, index),
                  ...this.state.selectedDevices.slice(index + 1)]
              });
            } else {
              this.setState({
                selectedDevices: [
                  ...this.state.selectedDevices,
                  device.id
                ]
              });
            }
          }
        }
      />
    ));
  }

  render() {
    const { userName, rfid } = this.state;

    return (
      <Dialog
        title="Create User"
        open
        onRequestClose={this.props.onReqClose}
        autoScrollBodyContent
      >
        <div>
          <div>
            <div style={styles.block}>
              <span style={styles.blockLabel}>User Name:</span>
              <TextField
                name="deviceName"
                hintText="User Name"
                value={userName}
                onChange={(event) => { this.setState({ userName: event.target.value }); }}
              />
            </div>
            <div style={styles.block}>
              <span style={styles.blockLabel}>RFID:</span>
              <TextField
                name="deviceName"
                hintText="RFID"
                value={rfid}
                onChange={(event) => { this.setState({ rfid: event.target.value }); }}
              />
            </div>
          </div>
          <div>
            <div style={{ color: 'black', fontSize: '18px' }}>Give access</div>
            { this.renderDevices() }
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <RaisedButton
              label="Create"
              primary
              style={{ marginRight: '10px' }}
              onClick={
                async () => {
                  await this.createUser();
                  await this.props.refreshUsers();
                  this.props.onReqClose();
                }
              }
            />
            <RaisedButton
              onClick={this.props.onReqClose}
              label="Cancel"
            />
          </div>
        </div>
      </Dialog>
    );
  }
}

UserEditCreate.propTypes = {
  onReqClose: PropTypes.func.isRequired,
  refreshUsers: PropTypes.func.isRequired
};

export default UserEditCreate;
