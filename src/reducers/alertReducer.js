import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    show: false,
    message: '',
    variant: 'success'
};

const alertSlice = createSlice({
    name: 'alert',
    initialState,
    reducers: {
        showAlert: {
            reducer(state, action) {
                state.show = true;
                state.message = action.payload.message;
                state.variant = action.payload.variant;
            },
            prepare(message, variant) {
                return {
                    payload: {
                        message,
                        variant
                    }
                };
            }
        },
        hideAlert(state){
            state.show = false;
        }
    }
});

export const { showAlert, hideAlert } = alertSlice.actions;
export default alertSlice.reducer;
