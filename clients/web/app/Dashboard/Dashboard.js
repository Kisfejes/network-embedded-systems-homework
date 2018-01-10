import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';


import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import { fetchAPI } from '../util';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logs: [],
      users: [],
      devices: [],
      filterDevice: null,
      filterUser: null
    };
  }

  async componentDidMount() {
    await this.getLogs();
  }

  async getLogs() {
    let filter = null;

    if (this.state.filterDevice || this.state.filterUser) {
      filter = {};
      filter.deviceId = this.state.filterDevice;
      filter.userId = this.state.filterUser;
    }
    console.log(filter);

    const rawLogs = await fetchAPI('accesslogs', 'list', filter);
    this.setState({
      logs: rawLogs.map(rawLog => ({
        userName: rawLog.User.name,
        deviceName: rawLog.Device.name,
        accessDate: rawLog.accessDate,
        access: rawLog.access
      }))
    });

    const users = await fetchAPI('users', 'list');
    this.setState({
      users
    });

    const devices = await fetchAPI('devices', 'list');
    this.setState({
      devices
    });
  }

  renderLogs() {
    return this.state.logs.map(log => (
      <TableRow key={log.accessDate}>
        <TableRowColumn>{log.userName}</TableRowColumn>
        <TableRowColumn>{log.deviceName}</TableRowColumn>
        <TableRowColumn>{moment(log.accessDate).format('YYYY.MM.DD. - HH:mm:ss')}</TableRowColumn>
        <TableRowColumn>{log.access ? 'Allowed' : 'Denied'}</TableRowColumn>
      </TableRow>
    ));
  }

  render() {
    return (
      <div>
        <div>
          <div>
            <span>User</span>
            <SelectField
              value={this.state.filterUser}
              onChange={async (event, index, value) => {
                this.setState({
                  filterUser: value
                }, async () => {
                  await this.getLogs();
                });
              }}
            >
              <MenuItem key={-1} value={null} primaryText={'No filter'} />
              { this.state.users.map(user => (
                <MenuItem key={user.id} value={user.id} primaryText={user.name} />
              ))}
            </SelectField>
          </div>
          <div>
            <span>Device</span>
            <SelectField
              value={this.state.filterDevice}
              onChange={async (event, index, value) => {
                this.setState({
                  filterDevice: value
                }, async () => {
                  await this.getLogs();
                });
              }}
            >
              <MenuItem key={-1} value={null} primaryText={'No filter'} />
              { this.state.devices.map(device => (
                <MenuItem key={device.id} value={device.id} primaryText={device.name} />
              ))}
            </SelectField>
          </div>
        </div>
        <div>
          <Table
            selectable={false}
          >
            <TableHeader
              displaySelectAll={false}
              adjustForCheckbox={false}
            >
              <TableRow>
                <TableHeaderColumn>User</TableHeaderColumn>
                <TableHeaderColumn>Device</TableHeaderColumn>
                <TableHeaderColumn>Date</TableHeaderColumn>
                <TableHeaderColumn>Access confirm</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody
              displayRowCheckbox={false}
            >
              { this.renderLogs() }
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {

};

export default Dashboard;
