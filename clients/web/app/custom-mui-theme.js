import {
  indigo500, indigo700,
  indigo100, blueGrey500,
  grey400, grey900, grey100, grey500,
  white, darkBlack, fullBlack,
} from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';

export default {
  spacing,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: '#607D8B',
    primary2Color: '#CFD8DC',
    primary3Color: indigo100,
    accent1Color: '#448AFF',
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: '#212121',
    alternateTextColor: '#FFFFFF',
    canvasColor: white,
    borderColor: '#BDBDBD',
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: indigo500,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack,
  },
};
