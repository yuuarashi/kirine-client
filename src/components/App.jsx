import React from 'react';
import { useDispatch } from 'react-redux';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';
import GlobalAlert from './GlobalAlert.jsx';
import AppNavbar from './AppNavbar.jsx';
import CartoonPage from './CartoonPage.jsx';
import UserPage from './UserPage.jsx';
import CartoonSearch from './CartoonSearch.jsx';
import CartoonEdit from './CartoonEdit.jsx';
import HomePage from './HomePage.jsx';
import { fetchViewer } from '../reducers/userReducer.js';

import './css/App.css';

function App(props) {
    const dispatch = useDispatch();
    dispatch(fetchViewer());

    return (
        <Router>
            <AppNavbar />
            <Switch>
                <Route exact path="/">
                    <HomePage />
                </Route>
                <Route exact path="/cartoon/:id">
                    <CartoonPage />
                </Route>
                <Route path="/user/:name">
                    <UserPage />
                </Route>
                <Route path="/search/cartoons">
                    <CartoonSearch />
                </Route>
                <Route path="/edit/cartoon/:id">
                    <CartoonEdit />
                </Route>
                <Route exact path="/add/cartoon">
                    <CartoonEdit new />
                </Route>
            </Switch>
            <div style={{ marginTop: '100px' }}></div>
            <GlobalAlert />
        </Router>
    );
}

export default App;