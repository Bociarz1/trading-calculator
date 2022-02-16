// import mui elements
import {
  Grid,
  Alert,
  AlertTitle,
} from '@mui/material';

// import useSelector hook
import { useSelector } from 'react-redux';

// import type
import { RootState } from '../app/store';

// import styles
import {makeStyles, Theme} from '@material-ui/core/styles'

// set styles
const useStyles = makeStyles((theme: Theme) =>({
  outputGrid: {
    display: 'flex',
    justifyContent: 'center',
    paddingBottom: '15px'
  },
  alert: {
    width: '90%',
  },
}))

// OUTPUT COMPONENT
function Output() {

  // useStyles
  const classes = useStyles();

  // useSelector
  const output = useSelector((state:RootState) => state.input.value)

  return ( 
    <Grid 
      container
      className={classes.outputGrid}
    >
      { output.pendingOrder ?
        <Alert 
        severity="info"
        className={classes.alert}
        sx={{
          backgroundColor: '#fff',
        }}
        >
        <AlertTitle >Your position information</AlertTitle>
        PENDING ORDER: <strong>{output.pendingOrder.toFixed(5)}</strong> <br/>
        STOP LOSS: <strong>{output.stopLoss.toFixed(5)}</strong> <br/>
        TAKE PROFIT: <strong>{output.takeProfit.toFixed(5)}</strong>
      </Alert>
      : null
      }
    </Grid>
  );
}

export default Output;