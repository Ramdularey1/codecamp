import { createSlice } from "@reduxjs/toolkit";

const allSliceProblem = createSlice({
    name:'allProblems',
    initialState:{
        allProblems:[]
    },
    reducers:{
        updateAllProblems: (state, action) => {
            state.allProblems = action.payload
        }
    }
})

export const {updateAllProblems}  = allSliceProblem.actions;
export default allSliceProblem.reducer;