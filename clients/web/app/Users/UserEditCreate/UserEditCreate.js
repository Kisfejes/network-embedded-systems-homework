import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';

import TagReader from './TagReader';

import styles from './style';
import { generateRandomUserName, fetchAPI } from '../../util';

class UserEditCreate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: this.props.initUserData.userName || generateRandomUserName(),
      rfid: this.props.initUserData.rfid,
      devices: [],
      selectedDevices: this.props.initUserData.accessToDevices || [],
      tagReaderOpen: false
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
  }

  async saveUser() {
    const { userName, rfid, selectedDevices } = this.state;

    await fetchAPI('users', 'update', {
      name: userName,
      rfid,
      deviceIds: selectedDevices
    }, this.props.initUserData.userId);
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
    const { userName, rfid, tagReaderOpen } = this.state;
    const { mode } = this.props;

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
              <FlatButton
                label="Read from scanner"
                onClick={() => { this.setState({ tagReaderOpen: true }); }}
                primary
              />
            </div>
          </div>
          <div>
            <div style={{ color: 'black', fontSize: '18px' }}>Give access</div>
            { this.renderDevices() }
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <RaisedButton
              label={mode === 'CREATE' ? 'Create' : 'Save'}
              primary
              style={{ marginRight: '10px' }}
              onClick={
                async () => {
                  if (mode === 'CREATE') {
                    await this.createUser();
                  } else {
                    await this.saveUser();
                  }
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
        {
          tagReaderOpen &&
          <TagReader
            open={tagReaderOpen}
            close={() => { this.setState({ tagReaderOpen: false }); }}
            deviceList={this.state.devices.map(device => ({
              UID: device.UID,
              name: device.name
            }))}
            setTag={(UID) => { this.setState({ rfid: UID }); }}
          />
        }
      </Dialog>
    );
  }
}

UserEditCreate.propTypes = {
  onReqClose: PropTypes.func.isRequired,
  refreshUsers: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['CREATE', 'EDIT']).isRequired,
  initUserData: PropTypes.shape({
    userId: PropTypes.number,
    userName: PropTypes.string,
    rfid: PropTypes.string,
    accessToDevices: PropTypes.array
  })
};

export default UserEditCreate;
