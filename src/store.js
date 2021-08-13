import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userReducer.js';
import alertReducer from './reducers/alertReducer.js';

const store = configureStore({
    reducer: {
        user: userReducer,
        alert: alertReducer
    }
});

export default store;