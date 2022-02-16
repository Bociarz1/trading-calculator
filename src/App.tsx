// import components
import Input from './components/Input';
import Output from './components/Output';

// import mui elements
import {
  Container,
  Box,
  Typography
} from '@mui/material';

// import styles
import { makeStyles } from '@mui/styles';

// import useSelector hook
import { useSelector } from 'react-redux';

// import types
import { RootState } from './app/store';

// set colors
export const colors = {
  darkBlue: '#2196f3',
  lightBlue: '#cfe8fc',
  darkRed: '#f50057',
  lightRed: '#fccfcf',
  grey: '#424242',
  white: '#fff'
}

// set styles
const useStyles = makeStyles({
  mainText: {
    textAlign: 'center',
    color: colors.white
  },
})

// APP COMPONENT
function App() {

  // useSelector to change background color
  const status = useSelector((state:RootState) => state.input.status)

  //useStyles 
  const classes = useStyles();

  return (
    <Container maxWidth="sm" >
      <Box 
        sx= {{
          minHeight: '100vh',
          backgroundColor: status === 'buy' 
          ? colors.lightBlue 
          : colors.lightRed
         }}
      >
        {/* Main text element */}
        <Typography
          component="div" 
          gutterBottom
          className={classes.mainText}
          sx= {{
           backgroundColor: status === 'buy' ? 
            colors.darkBlue 
            : colors.darkRed
           }}
        >
         Trading calculator
        </Typography>
        {/* Input data container */}
        <Input/>
        {/* Output data container */}
        <Output />
      </Box>
    </Container>
  );
}

export default App;
