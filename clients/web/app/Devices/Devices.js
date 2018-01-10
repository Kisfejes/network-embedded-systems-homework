import React, { Component } from 'react';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import TextField from 'material-ui/TextField';
import moment from 'moment';

import mqttClient from '../MQTTClient';
import DeviceWizard from './DeviceWizard/DeviceWizard';

import styles from './style';
import { fetchAPI } from '../util';

class Devices extends Component {
  constructor(props) {
    super(props);

    this.state = {
      devices: [],
      wizardOpen: false,
      wizardMode: 'CREATE',
      currentDevice: null
    };

    this.addDevice = this.addDevice.bind(this);
    this.refreshDevices = this.refreshDevices.bind(this);
  }

  async componentDidMount() {
    await this.refreshDevices();
  }

  async addDevice(deviceName) {
    console.log('Add device!');
    const newDeviceData = {
      name: deviceName
    };
    try {
      // Saving new device to the DB
      const newDevice = await fetchAPI('devices', 'create', newDeviceData);
      this.setState({
        currentDevice: newDevice
      });
      // Refresh device list from db
      const devices = await fetchAPI('devices', 'list');
      this.setState({ devices });
      return true;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async editDevice(device) {
    // TODO: check devie state
    this.setState({
      addDeviceModalOpen: true,
      addDeviceStepIndex: 2,
      currentDevice: device
    });
  }

  updateAccessConfig(deviceUID) {
    const accessConfigUpdateTopic = `device/service/update-access-config/${deviceUID}`;
    const client = mqttClient.getClient();
    client.publish(accessConfigUpdateTopic, '');
  }

  async deleteDevice(deviceId) {
    await fetchAPI('devices', 'delete', deviceId);
    const devices = await fetchAPI('devices', 'list');
    this.setState({ devices });
  }

  async refreshDevices() {
    const devices = await fetchAPI('devices', 'list');
    this.setState({
      devices
    });
  }

  renderDevices() {
    const { devices } = this.state;

    return (
      <Table
        selectable={false}
      >
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}
        >
          <TableRow>
            <TableHeaderColumn>UID</TableHeaderColumn>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>State</TableHeaderColumn>
            <TableHeaderColumn>Raspberry ID</TableHeaderColumn>
            <TableHeaderColumn>Registered Date</TableHeaderColumn>
            <TableHeaderColumn />
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}
        >
          {
            devices.map(device => (
              <TableRow
                key={device.UID}
              >
                <TableRowColumn>{device.UID}</TableRowColumn>
                <TableRowColumn>{device.name}</TableRowColumn>
                <TableRowColumn>{device.state}</TableRowColumn>
                <TableRowColumn>{device.raspberryId}</TableRowColumn>
                <TableRowColumn>{moment(device.registeredDate).format('YYYY.MM.DD. - HH:mm:ss')}</TableRowColumn>
                <TableRowColumn>
                  <IconMenu
                    iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                    anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                    targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                  >
                    <MenuItem
                      primaryText="Edit"
                      onClick={this.editDevice.bind(this, device)}
                    />
                    <MenuItem
                      primaryText="Update Access Config"
                      onClick={this.updateAccessConfig.bind(this, device.UID)}
                    />
                    <MenuItem
                      primaryText="Delete"
                      onClick={this.deleteDevice.bind(this, device.id)}
                    />
                  </IconMenu>
                </TableRowColumn>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    );
  }

  render() {
    const { devices, wizardOpen, wizardMode, currentDevice } = this.state;

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <span style={styles.headerText}>Devices</span>
          <RaisedButton
            label="Add"
            primary
            onClick={() => {
              this.setState({
                wizardOpen: true,
              });
            }}
          />
        </div>
        <Divider />
        <div style={styles.body}>
          {
            (devices.length === 0) ?
            (
              <div style={styles.bodyTextContainer}>
                {/* <span style={styles.bodyText}>{'It seems you dont have any device, click on "Add" button!'}</span> */}
              </div>
            ) :
            (this.renderDevices())
          }
        </div>
        {
          wizardOpen &&
          <DeviceWizard
            wizardOpen={wizardOpen}
            wizardMode={wizardMode}
            currentDevice={currentDevice}
            onReqClose={() => {
              this.setState({ wizardOpen: false });
            }}
            addDevice={this.addDevice}
            refreshDevices={this.refreshDevices}
          />
        }
      </div>
    );
  }
}

Devices.propTypes = {

};

export default Devices;
