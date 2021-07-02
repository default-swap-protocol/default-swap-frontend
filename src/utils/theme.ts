import { createMuiTheme } from '@material-ui/core/styles'
import { Shadows } from "@material-ui/core/styles/shadows"
import { grey } from '@material-ui/core/colors'

// Custom theme for material ui components
let customShadows = new Array<string>(25);
customShadows.fill('none')
customShadows[1] = '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
customShadows[2] = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
customShadows[3] = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
customShadows[4] = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
customShadows[5] = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
customShadows[6] = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
customShadows[3] = '0 35px 60px -15px rgba(0, 0, 0, 0.3)';
const theme = createMuiTheme({
  palette: {
    primary: {
      // light: '#FAFFF9',
      main: '#3531a2',
      // dark: '#23614E'
    },
    text: {
      primary: '#1F2433',
      secondary: grey[700],
    },
  },
  typography: {
    body1: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
      textTransform: 'none',
    },
    body2: {
      textTransform: 'none',
      fontColor: grey[700]
    }
  },
  shadows: customShadows as Shadows,
  props: {
    MuiButton: {
      style: {
        borderRadius: '5px',
        paddingTop: '8px',
        paddingBottom: '8px',
        textTransform: 'none'
      }
    },
    MuiCircularProgress: {
      size: 25,
      color: 'primary'
    },
    MuiDialog: {
      style: {
        borderRadius: '5px'
      }
    },
    MuiCard: {
      style: {
        backgroundColor: 'white',
        borderRadius: '5px'
      }
    },
    MuiPaper: {
      style: {
        backgroundColor: 'white',
        borderRadius: '5px'
      }
    },
    MuiTab: {
      style: {
        textTransform: 'none'
      }
    }
  },
  overrides: {
    MuiTextField: {
      root: {
        '& .Mui-disabled': {
          color: 'black'
        }
      }
    },
    MuiListItem: {
      root: {
        borderRadius: '5px',
        '&$selected': {
          backgroundColor: '#2E8C76',
          '& p': {
            color: 'white'
          },
          '&:hover': {
            backgroundColor: '#2E8C76',
            '& p': {
              color: 'white'
            },
          }
        },
      }
    }
  }
});

export default theme;