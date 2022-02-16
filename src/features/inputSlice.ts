import { 
  createSlice, 
  PayloadAction 
} from "@reduxjs/toolkit";

import {Data} from '../components/Input'

const initialData = {
  pendingOrder: 0,
  stopLoss: 0,
  takeProfit: 0
}

interface InputState{
  value: Data
  status: string
}

const initialState: InputState= {
  value: initialData,
  status: 'buy'
}

const inputSlice = createSlice({
  name: 'inputSlice',
  initialState,
  reducers: {
    addInput: (state, action: PayloadAction<Data>) => {
      state.value=action.payload
    },
    changeStatus: (state, action:PayloadAction<string>) => {
      state.status=action.payload
    }
  }
})
export const {addInput, changeStatus} = inputSlice.actions

const inputReducer = inputSlice.reducer;
export default inputReducer;