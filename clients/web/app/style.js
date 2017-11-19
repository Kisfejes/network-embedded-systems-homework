import customTheme from './custom-mui-theme';

export default {
  container: {
    display: 'flex',
    height: '100%'
  },
  leftMenu: {
    width: '200px',
    flexShrink: 0,
    backgroundColor: 'white',
    boxSizing: 'border-box',
    borderRight: '1px solid ' + customTheme.palette.borderColor
  },
  leftMenuHeader: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '10px',
    padding: '10px 10px 0px 5px'
  },
  logoText: {
    fontSize: '22px'
  },
  logoIcon: {
    width: '46px',
    height: '46px'
  },
  leftMenuItem: {
    marginBottom: '5px',
    cursor: 'pointer',
    padding: '5px 0px 5px 10px',
    boxSizing: 'border-box',
    position: 'relative'
  },
  content: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center'
  },
  contentInner: {
    // width: '600px',
    flexGrow: 1,
    display: 'flex',
    // boxSizing: 'border-box',
    margin: '10px 50px'
  }
};
