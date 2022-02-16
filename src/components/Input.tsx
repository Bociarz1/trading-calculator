// import hooks
import {
  useEffect,
  useRef,
  useState
} from 'react';

// import useDispatch
import { useDispatch } from 'react-redux'

// import mui elements
import {
  Box, 
  Button, 
  FormControl, 
  FormControlLabel, 
  FormLabel, 
  Grid, 
  Radio, 
  RadioGroup,
  TextField
} from '@mui/material';

// import mui icons
import DeleteIcon from '@mui/icons-material/Delete';
import CalculateIcon from '@mui/icons-material/Calculate';

// import my own created colors
import { colors } from '../App'

// import styles
import {makeStyles, Theme, useTheme} from '@material-ui/core/styles'

// import redux action
import { addInput, changeStatus } from '../features/inputSlice';

// set styles
const useStyles = makeStyles((theme: Theme) =>({
  boxContainer: {
    dispaly: 'flex',
  },
  orderGrid: {
    display: 'flex',
    justifyContent: 'center',
  },
  textAreaGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '10px',
    margin: '10px 0',
    height: 'auto',
    alignItems: 'center'
  },
  textField: {
    // input label when focused
    "& label.Mui-focused": {
      color: colors.grey
    },
    // focused color for input with variant='standard'
    "& .MuiInput-underline:after": {
      borderBottomColor: colors.grey
    },
    // focused color for input with variant='filled'
    "& .MuiFilledInput-underline:after": {
      borderBottomColor: colors.grey
    },
    // focused color for input with variant='outlined'
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: colors.grey
      }
    }
  },
  rowGrid: {
    display: 'flex',
    alignItems: 'center',
    gap: '5%'
  },
  deleteIcon: {
    borderRadius: '50%',
    '&:hover': {
      color: '#fff',
      backgroundColor: 'black',
      transition: '.3s'
    }
  }
}))

// ts types
export type Data = {
  pendingOrder: number
  stopLoss: number
  takeProfit: number
}

// initial hook value
const initialData = {
  pendingOrder: 0,
  stopLoss: 0,
  takeProfit: 0
}

// INPUT COMPONENT
function Input() {

  // styles
  const classes = useStyles();
  const { breakpoints } = useTheme()

  // toogle buy/sell hook
  const [radioValue, setRadioValue] = useState<string>("buy")
 
  // price data hooks
  const [closePrice, setClosePrice] = useState<number>(0);
  const [openPrice, setOpenPrice] = useState<number >(0);
  const [highPrice, setHighPrice] = useState<number>(0);
  const [lowPrice, setLowPrice] = useState<number>(0);
  const [atrPrice, setAtrPrice] = useState<number>(0); 
  const [spreadPrice, setSpreadPrice] = useState<number>(0);

  // dispatch data to output component hook
  const [data, setData] = useState<Data>(initialData)

  // useRef hooks to change focus on textFields
  const textFieldForClosePrice = useRef<HTMLLinkElement>(null);
  const textFieldForOpenPrice = useRef<HTMLLinkElement>(null);
  const textFieldForHighPrice = useRef<HTMLLinkElement>(null);
  const textFieldForLowPrice = useRef<HTMLLinkElement>(null);
  const textFieldForAtrPrice = useRef<HTMLLinkElement>(null);
  const textFieldForSpreadPrice = useRef<HTMLLinkElement>(null);

  // functions

  // change buy/sell radio
  const radioHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRadioValue((event.target as HTMLInputElement).value);
  }

  // handle buttons 
  const handleCalculateButtonClick = () => {
    console.log(`data to dispatch: ${data.pendingOrder}`);
    dispatch(addInput(data))
  }
  const handleDeleteButtonClick = () => {
    setClosePrice(0);
    setOpenPrice(0);
    setHighPrice(0);
    setLowPrice(0);
    setAtrPrice(0);
    setSpreadPrice(0);
    if (textFieldForClosePrice.current !== null) {
      textFieldForClosePrice.current.focus();
    }
  }
  
  //  calculations buy data
  const buyPendingOrder = (highPrice + lowPrice) / 2 + spreadPrice;
  const buyStopLoss = closePrice - atrPrice;
  const buyTakeProfit = (buyPendingOrder - buyStopLoss) * 4 + buyPendingOrder;

  //  calculations sell data
  const sellPendingOrder = (highPrice + lowPrice) / 2;
  const sellStopLoss = closePrice + atrPrice + spreadPrice;
  const sellTakeProfit = sellPendingOrder -(sellStopLoss - sellPendingOrder) * 4

  // declartion of dispatch hook
  const dispatch = useDispatch();

  // useEffect hook to dispatch data to output component
  useEffect(() =>{

    // dispatch to change style
    dispatch(changeStatus(radioValue)) 

      // setState
      if(radioValue === "buy") {
        setData(data => ({
          ...data,
          pendingOrder: buyPendingOrder,
          stopLoss: buyStopLoss,
          takeProfit: buyTakeProfit 
        }))
      }
      else if(radioValue === "sell"){
        setData(data => ({
          ...data,
          pendingOrder: sellPendingOrder,
          stopLoss: sellStopLoss,
          takeProfit: sellTakeProfit  
        }))
      }
  },
  [buyPendingOrder, buyStopLoss, buyTakeProfit, sellPendingOrder, sellStopLoss, sellTakeProfit, radioValue, dispatch])

  return ( 
    <Box className={classes.boxContainer}>

      {/* Type of order */}
      <Grid className={classes.orderGrid}>
        <FormControl>
          <FormLabel 
            id="radio-buttons"
            sx={{textAlign: 'center'}}
            focused={false}
          >
            Type of order
          </FormLabel>
          <RadioGroup 
            row
            value={radioValue}
            onChange={radioHandleChange}
          >
            <FormControlLabel 
              value="buy" 
              control={<Radio sx={{marginLeft: '10%'}}/>} 
              label="buy"
            />
            <FormControlLabel 
              value="sell" 
              control={<Radio sx={{
                '&, &.Mui-checked': {
                  color: colors.darkRed
                },
              marginLeft: '10%'
              }}/>} 
              label="sell" 
            />
          </RadioGroup>
        </FormControl>
      </Grid>

      {/* textfield area */}
      <Grid 
        className={classes.textAreaGrid} 
        sx={{flexDirection: 'column',}}
      >
        <Grid 
          className={classes.rowGrid}
        >
          <TextField
            id="closePrice"
            label="Close price"
            autoComplete='off'
            inputRef={textFieldForClosePrice}
            inputProps={{
              onKeyPress: event => {
                const { key } = event;
                if (key === "Enter") {
                  if (textFieldForOpenPrice.current !== null) {
                    textFieldForOpenPrice.current.focus();
                  }
                }
              }
            }}
            className={classes.textField}
            onChange={(event) => setClosePrice(parseFloat(event.target.value.replaceAll(',','.')))}
            value={closePrice === 0 ? '': closePrice}
          />
          <DeleteIcon 
            onClick={() => {
              setClosePrice(0);
              if (textFieldForClosePrice.current !== null) {
                textFieldForClosePrice.current.focus();
              }
            }}
            className={classes.deleteIcon}
            />
        </Grid>
        <Grid 
          className={classes.rowGrid}
        >
          <TextField
            id="openPrice"
            label="Open price"
            onChange={(event) => setOpenPrice((parseFloat(event.target.value.replaceAll(',','.'))))}
            autoComplete='off'
            inputRef={textFieldForOpenPrice}
            inputProps={{
              onKeyPress: event => {
                const { key } = event;
                if (key === "Enter") {
                  if (textFieldForHighPrice.current !== null) {
                    textFieldForHighPrice.current.focus();
                  }
                }
              }
            }}
            className={classes.textField}
            value={openPrice === 0 ? '': openPrice}
          />
          <DeleteIcon 
            onClick={() => {
              setOpenPrice(0);
              if (textFieldForOpenPrice.current !== null) {
                textFieldForOpenPrice.current.focus();
              }
            }}
            className={classes.deleteIcon}
            />
        </Grid>
        <Grid 
          className={classes.rowGrid}
        >
          <TextField
            id="HighPrice"
            label="High price"
            onChange={(event) => setHighPrice(parseFloat(event.target.value.replaceAll(',','.')))}
            autoComplete='off'
            inputRef={textFieldForHighPrice}
            inputProps={{
              onKeyPress: event => {
                const { key } = event;
                if (key === "Enter") {
                  if (textFieldForLowPrice.current !== null) {
                    textFieldForLowPrice.current.focus();
                  }
                }
              }
            }}
            className={classes.textField}
            value={highPrice === 0 ? '': highPrice}
          />
          <DeleteIcon 
            onClick={() => {
              setHighPrice(0);
              if (textFieldForHighPrice.current !== null) {
                textFieldForHighPrice.current.focus();
              }
            }}
            className={classes.deleteIcon}
            />
        </Grid>
        <Grid 
          className={classes.rowGrid}
        >
          <TextField
            id="LowPrice"
            label="Low price"
            onChange={(event) => setLowPrice(parseFloat(event.target.value.replaceAll(',','.')))}
            autoComplete='off'
            inputRef={textFieldForLowPrice}
            inputProps={{
              onKeyPress: event => {
                const { key } = event;
                if (key === "Enter") {
                  if (textFieldForAtrPrice.current !== null) {
                    textFieldForAtrPrice.current.focus();
                  }
                }
              }
            }}
            className={classes.textField}
            value={lowPrice === 0 ? '': lowPrice}
          />
          <DeleteIcon 
            onClick={() => {
              setLowPrice(0);
              if (textFieldForLowPrice.current !== null) {
                textFieldForLowPrice.current.focus();
              }
            }}
            className={classes.deleteIcon}
            />
        </Grid>
        <Grid 
          className={classes.rowGrid}
        >
           <TextField
            id="atrPrice"
            label="Atr price"
            onChange={(event) => setAtrPrice(parseFloat(event.target.value.replaceAll(',','.')))}
            autoComplete='off'
            inputRef={textFieldForAtrPrice}
            inputProps={{
              onKeyPress: event => {
                const { key } = event;
                if (key === "Enter") {
                  if (textFieldForSpreadPrice.current !== null) {
                    textFieldForSpreadPrice.current.focus();
                  }
                }
              }
            }}
            className={classes.textField}
            value={atrPrice === 0 ? '': atrPrice}
          />
          <DeleteIcon 
            onClick={() => {
              setAtrPrice(0);
              if (textFieldForAtrPrice.current !== null) {
                textFieldForAtrPrice.current.focus();
              }
            }}
            className={classes.deleteIcon}
            />
        </Grid>
        <Grid 
          className={classes.rowGrid}
        >
          <TextField
            id="SpreadPrice"
            label="Spread price"
            onChange={(event) => setSpreadPrice(parseFloat(event.target.value.replaceAll(',','.')))}
            autoComplete='off'
            inputRef={textFieldForSpreadPrice}
            inputProps={{
              onKeyPress: event => {
                const { key } = event;
                if (key === "Enter") {
                  handleCalculateButtonClick()              
                }
              }
            }}
            className={classes.textField}
            value={spreadPrice === 0 ? '': spreadPrice}
          />
          <DeleteIcon 
            onClick={() => {
              setSpreadPrice(0);
              if (textFieldForSpreadPrice.current !== null) {
                textFieldForSpreadPrice.current.focus();
              }
            }}
            className={classes.deleteIcon}
            />
        </Grid>  
      </Grid>

      {/* button */}
      <Grid 
        sx={{
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center'
        }}
      >
      <Button
        sx={{
          backgroundColor: (radioValue==='buy'? colors.darkBlue: colors.darkRed),
          color: '#fff',
          marginBottom: '10px',
          width: '40%',
          [breakpoints.down(600)]: {
            width: '40%',
          },
          [breakpoints.down(500)]: {
            width: '50%',
          },
          [breakpoints.down(400)]: {
            width: '60%',
          },
          '&:hover': {
            backgroundColor: '#fff',
            color: (radioValue==='buy'? colors.darkBlue: colors.darkRed)
          }
        }}
        onClick ={handleCalculateButtonClick}
        startIcon={<CalculateIcon/>}
      >
        Calculate
      </Button>
      <Button
        sx={{
          backgroundColor: colors.grey,
          color: '#fff',
          marginBottom: '10px',
          width: '40%',
          [breakpoints.down(600)]: {
            width: '40%',
          },
          [breakpoints.down(500)]: {
            width: '50%',
          },
          [breakpoints.down(400)]: {
            width: '60%',
          },
          '&:hover': {
            backgroundColor: '#fff',
            color: (radioValue==='buy'? colors.darkBlue: colors.darkRed)
          }
        }}
        onClick ={handleDeleteButtonClick}
        startIcon={<DeleteIcon/>}
      >
        Delete All
      </Button>
      </Grid>
    </Box>
   );
}
export default Input;