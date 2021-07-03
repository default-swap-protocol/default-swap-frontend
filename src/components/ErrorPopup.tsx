import { Snackbar } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'

import { ErrorProps } from '@type/props'

const ErrorPopup = (props: ErrorProps) => {
  return (
    <Snackbar 
      open={props.error ? true : false} 
      autoHideDuration={6000} 
      onClose={props.handleCloseError}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center"
      }}
    >
      <Alert onClose={props.handleCloseError} severity="error">
        {props.error}
      </Alert>
    </Snackbar>
  )
};

export default ErrorPopup;