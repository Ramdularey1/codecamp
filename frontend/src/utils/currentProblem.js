import { createSlice } from "@reduxjs/toolkit";

const currentProblemSlice = createSlice({
    name: 'currentProblem',
    initialState: {
        currentProblem: {}
    },
    reducers: {
        updateCurrentProblem: (state, action) => {
            state.currentProblem = action.payload;
        }
    }
});

export const { updateCurrentProblem } = currentProblemSlice.actions;
export default currentProblemSlice.reducer;
