import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Root from './App';
import customMuiThemeDesc from './custom-mui-theme';

const customTheme = getMuiTheme(customMuiThemeDesc);

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();


const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <MuiThemeProvider muiTheme={customTheme}>
        <Component />
      </MuiThemeProvider>
    </AppContainer>,
    document.getElementById('root'),
  );
};

render(Root);

if (module.hot) {
  module.hot.accept('./App', () => {
    const newApp = require('./App').default;
    render(newApp);
  });
}
