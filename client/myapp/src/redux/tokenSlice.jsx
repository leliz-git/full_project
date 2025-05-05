import { createSlice } from '@reduxjs/toolkit'
const i={
token:null,
user:{}
}
const tokenSlice = createSlice({
    name: 'token',
    initialState: i,
    reducers: {
        setToken(state, action) {
            console.log("rrrrrrr",action);
            state.user = action.payload.user
console.log();

            state.token = action.payload.token
            
        },
        logOut(state, action) {
            state.token = null;
            state.user = null;

        }
    }
})

export const { setToken, logOut } = tokenSlice.actions
export default tokenSlice.reducer