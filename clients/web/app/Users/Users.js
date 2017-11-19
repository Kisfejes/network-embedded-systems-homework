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

import styles from './style';
import { fetchAPI } from '../util';
import UserEditCreate from './UserEditCreate/UserEditCreate';

class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
      users: []
    };

    this.refreshUsers = this.refreshUsers.bind(this);
  }

  async componentDidMount() {
    await this.refreshUsers();
  }

  async refreshUsers() {
    const users = await fetchAPI('users', 'list');
    this.setState({
      users
    });
  }

  async editUser() {
    console.log('edit user');
  }

  async deleteUser(user) {
    await fetchAPI('users', 'delete', user);
    await this.refreshUsers();
  }

  renderUsers() {
    const { users } = this.state;

    return (
      <Table
        selectable={false}
      >
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}
        >
          <TableRow>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Rfid</TableHeaderColumn>
            <TableHeaderColumn />
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}
        >
          {
            users.map(user => (
              <TableRow
                key={user.id}
              >
                <TableRowColumn>{user.name}</TableRowColumn>
                <TableRowColumn>{user.rfid}</TableRowColumn>
                <TableRowColumn>
                  <IconMenu
                    iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                    anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                    targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                  >
                    <MenuItem
                      primaryText="Edit"
                      onClick={this.editUser.bind(this, user)}
                    />
                    <MenuItem
                      primaryText="Delete"
                      onClick={this.deleteUser.bind(this, user.id)}
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
    const { users, modalOpen } = this.state;

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <span style={styles.headerText}>Users</span>
          <RaisedButton
            label="Create"
            primary
            onClick={() => { this.setState({ modalOpen: true }); }}
          />
        </div>
        <Divider />
        <div style={styles.body}>
          {
            (users.length === 0) ?
            (
              <div style={styles.bodyTextContainer}>
                <span style={styles.bodyText}>{'It seems you dont have any user, click to the "Create" button!'}</span>
              </div>
            ) :
            (this.renderUsers())
          }
        </div>
        {
          modalOpen &&
          <UserEditCreate
            onReqClose={() => { this.setState({ modalOpen: false }); }}
            refreshUsers={this.refreshUsers}
          />
        }
      </div>
    );
  }
}

Users.propTypes = {

};

export default Users;
