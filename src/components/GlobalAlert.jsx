import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Fade } from 'react-bootstrap';
import { hideAlert } from '../reducers/alertReducer';

import './css/GlobalAlert.css';

export default function GlobalAlert() {
    const show = useSelector(state => state.alert.show);
    const message = useSelector(state => state.alert.message);
    const variant = useSelector(state => state.alert.variant);
    const dispatch = useDispatch();

    if (show) {
        clearTimeout(GlobalAlert.timer);
        GlobalAlert.timer = setTimeout(() => dispatch(hideAlert()), 2000);
    }

    return (
        <div id="global-alert-container">
            <Alert id="global-alert" show={show} variant={variant}>
                {message}
            </Alert>
        </div>
    );
}

GlobalAlert.timer = null;