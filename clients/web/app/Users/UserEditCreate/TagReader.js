import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dialog from 'material-ui/Dialog';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

import mqttClient from '../../MQTTClient';

class TagReader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDevice: null,
      scannedTag: ''
    };

    this.subscribedTopic = null;
    this.scanForTag = this.scanForTag.bind(this);
    this.messageHandler = this.messageHandler.bind(this);
  }

  componentDidMount() {
    console.log('tag reader did mount');
  }

  componentWillUnmount() {
    if (this.subscribedTopic) {
      const client = mqttClient.getClient();
      console.log('Remove previous listener');
      client.unsubscribe(this.subscribedTopic);
      console.log(this.messageHandler);
      client.removeListener('message', this.messageHandler);
    }
  }

  messageHandler(topic, message) {
    this.subscribedTopic = `device/read-tag/${this.state.selectedDevice}`;

    if (topic === this.subscribedTopic) {
      const obj = JSON.parse(message.toString());
      this.setState({
        scannedTag: obj.UID
      });
    }
  }

  scanForTag() {
    if (!this.state.selectedDevice) {
      return;
    }

    const client = mqttClient.getClient();
    const topic = `device/read-tag/${this.state.selectedDevice}`;

    console.log('current subscribed:', this.subscribedTopic);
    if (this.subscribedTopic) {
      console.log('Remove previous listener');
      client.unsubscribe(this.subscribedTopic);
      console.log(this.messageHandler);
      client.removeListener('message', this.messageHandler);
    }

    client.subscribe(topic, (err) => {
      if (!err) {
        console.log(`Subscribed to ${topic}`);
        client.on('message', this.messageHandler);
      } else {
        console.log(err);
      }
    });
  }

  render() {
    const { open, close, deviceList } = this.props;
    const { scannedTag } = this.state;

    return (
      <Dialog
        open={open}
        onRequestClose={close}
      >
        <div>Select Device</div>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <SelectField
            floatingLabelText="Device"
            value={this.state.selectedDevice}
            onChange={(event, index, value) => { this.setState({ selectedDevice: value }); }}
          >
            {
              (deviceList.map(device => (
                <MenuItem
                  key={device.UID}
                  value={device.UID}
                  primaryText={device.name}
                />
              )))
            }
          </SelectField>
          <RaisedButton
            style={{ marginLeft: '10px' }}
            label="Scan"
            primary
            onClick={this.scanForTag}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
          <span style={{ width: '200px', color: 'black', marginRight: '10px' }}>
            TAG: {scannedTag}
          </span>
          <RaisedButton
            style={{ marginLeft: '10px' }}
            label="Ok"
            primary
            onClick={() => {
              this.props.setTag(this.state.scannedTag);
              this.props.close();
            }}
          />
        </div>
      </Dialog>
    );
  }
}

TagReader.propTypes = {
  open: PropTypes.bool.isRequired,
  deviceList: PropTypes.arrayOf(PropTypes
  .shape({
    UID: PropTypes.string,
    name: PropTypes.string
  })).isRequired,
  close: PropTypes.func.isRequired,
  setTag: PropTypes.func.isRequired
};

export default TagReader;
