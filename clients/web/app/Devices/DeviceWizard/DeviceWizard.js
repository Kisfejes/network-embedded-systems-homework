import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Dialog from 'material-ui/Dialog';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import DeviceConnectStep from './DeviceConnectStep';

import { generateRandomDeviceName, fetchAPI } from '../../util';
import styles from './style.js';

class DeviceWizard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      wizardStepIndex: 0,
      newDeviceName: generateRandomDeviceName(),
      currentDevice: null
    };
  }

  renderWizardContent() {
    const { wizardStepIndex, newDeviceName } = this.state;
    const { addDevice, currentDevice, onReqClose } = this.props;

    switch (wizardStepIndex) {
      case 0:
        return (
          <div>
            <div>
              <span style={{ marginRight: '10px' }}>Device Name:</span>
              <TextField
                name="deviceName"
                hintText="Device Name"
                value={newDeviceName}
                onChange={(event) => { this.setState({ newDeviceName: event.target.value }); }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <RaisedButton
                label="Add"
                primary
                onClick={async () => {
                  const addDeviceResult = await this.props.addDevice(newDeviceName);
                  // const addDeviceResult = true;
                  if (addDeviceResult) {
                    this.setState({ wizardStepIndex: wizardStepIndex + 1 });
                  }
                }}
              />
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <div>
              <div style={{ fontSize: '18px', color: 'black', marginBottom: '5px' }}>Raspberry Pi 3</div>
              <div>curl s3.aws.com/install_rpi3_linux.sh | bash</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <RaisedButton
                label="Next"
                primary
                onClick={() => {
                  this.setState({ wizardStepIndex: wizardStepIndex + 1 });
                }}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <DeviceConnectStep
            deviceUID={currentDevice.UID}
            stepBack={() => {
              this.setState({ wizardStepIndex: wizardStepIndex - 1 });
            }}
            stepNext={async () => {
              this.setState({ wizardStepIndex: wizardStepIndex + 1 });
              await this.props.refreshDevices();
            }}
          />
        );
      case 3:
        return (
          <div>
            <div>
              <span>Device successfully added!</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <RaisedButton
                label="Finish"
                primary
                onClick={onReqClose}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  render() {
    const { wizardStepIndex } = this.state;
    const { wizardOpen, onReqClose, currentDevice } = this.props;

    const dialogTitle = (wizardStepIndex === 0) ? 'Add device' : `Add device ${currentDevice.name}`;

    return (
      <Dialog
        title={dialogTitle}
        titleStyle={{ paddingBottom: '0px' }}
        modal={false}
        open={wizardOpen}
        onRequestClose={onReqClose}
        bodyStyle={{ overflow: 'scroll' }}
      >
        <div style={styles.stepper}>
          <Stepper activeStep={wizardStepIndex}>
            <Step>
              <StepLabel>Device data</StepLabel>
            </Step>
            <Step>
              <StepLabel>Installing client to the device</StepLabel>
            </Step>
            <Step>
              <StepLabel>Connecting device</StepLabel>
            </Step>
            <Step>
              <StepLabel>Device added</StepLabel>
            </Step>
          </Stepper>
        </div>
        <div style={styles.stepperContent}>
          { this.renderWizardContent() }
        </div>
      </Dialog>
    );
  }
}

DeviceWizard.propTypes = {
  wizardOpen: PropTypes.bool.isRequired,
  wizardMode: PropTypes.string.isRequired,
  onReqClose: PropTypes.func.isRequired,
  addDevice: PropTypes.func.isRequired,
  refreshDevices: PropTypes.func.isRequired,
  currentDevice: PropTypes.any
};

export default DeviceWizard;
