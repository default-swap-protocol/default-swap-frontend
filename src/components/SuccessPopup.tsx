import { Snackbar } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import { makeStyles } from '@material-ui/core/styles'
import lightblue from '@material-ui/core/colors/lightBlue';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: lightblue[100],
    color: 'black'
  }
}));

const SuccessPopup = (props) => {
  const classes = useStyles();

  return (
    <Snackbar 
      open={props.message ? true : false} 
      autoHideDuration={6000} 
      onClose={props.handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center"
      }}
    >
      <Alert className={classes.root} onClose={props.handleClose} severity="success">
        {props.message}
      </Alert>
    </Snackbar>
  )
};

export default SuccessPopup;