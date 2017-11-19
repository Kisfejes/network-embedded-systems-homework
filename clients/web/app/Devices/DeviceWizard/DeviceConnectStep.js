import React, { Component } from 'react';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';
import CheckCircle from 'material-ui/svg-icons/action/check-circle';

import mqttClient from '../../MQTTClient';
import Loader from '../../Loader/Loader';

const TOPIC_DEVICE_CONNECT = 'device/connect';

class DeviceConnectStep extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deviceConnected: false
    };

    this.messageHandler = this.messageHandler.bind(this);
  }

  componentDidMount() {
    console.log('didmount, subscribing to topic');
    const client = mqttClient.getClient();
    client.subscribe(TOPIC_DEVICE_CONNECT, (err) => {
      if (!err) {
        console.log('Subscribed to device/connect');
        client.on('message', this.messageHandler);
      } else {
        console.log(err);
      }
    });
  }

  componentWillUnmount() {
    console.log('unmount, unsubcribing from topic');
    const client = mqttClient.getClient();
    client.unsubscribe('device/connect', (err) => {
      if (!err) {
        client.removeListener('message', this.messageHandler);
        console.log('Unsubscribed from device/connect');
      } else {
        console.log(err);
      }
    });
  }

  messageHandler(topic, message) {
    const { deviceUID } = this.props;

    if (topic === TOPIC_DEVICE_CONNECT) {
      const msgObj = JSON.parse(message.toString());
      if (msgObj.UID === deviceUID) {
        this.setState({
          deviceConnected: true
        });
      }
    }
  }


  render() {
    const { deviceUID, stepBack, stepNext } = this.props;
    const { deviceConnected } = this.state;

    return (
      <div>
        <div>
          <div key="code-to-connect">{`rfid-access connect ${deviceUID}`}</div>,
          <div
            key="wait-for-connect"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'black',
              fontSize: '18px'
            }}
          >
            {
              (!deviceConnected) ?
              ([
                <span key="label-waiting">Waiting device to connect</span>,
                <Loader key="loader" />
              ]) :
              ([
                <CheckCircle key="label-ok" color="green" style={{ marginRight: '5px' }} />,
                <span key="label-connected">Device connected!</span>
              ])
            }
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <RaisedButton
            label="Back"
            onClick={stepBack}
          />,
          <RaisedButton
            label="Next"
            style={{ marginLeft: '10px' }}
            primary
            disabled={!deviceConnected}
            onClick={stepNext}
          />
        </div>
      </div>
    );
  }
}

DeviceConnectStep.propTypes = {
  deviceUID: PropTypes.string.isRequired,
  stepBack: PropTypes.func.isRequired,
  stepNext: PropTypes.func.isRequired,
};

export default DeviceConnectStep;
