import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
    Navbar, Nav, NavDropdown,
    Image, Button, Modal, Form
} from 'react-bootstrap';
import { logOut, logIn } from '../reducers/userReducer.js';
import { signUpMutation } from '../api/mutations.js';

import './css/AppNavbar.css';

function LoginModal(props){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const onChangeUsername = (e) => setUsername(e.target.value);
    const onChangePassword = (e) => setPassword(e.target.value);
    const onHide = () => {
        setUsername('');
        setPassword('');
        props.onClose();
    };
    const handleLogIn = () => {
        dispatch(logIn({
            username,
            password
        }));
        onHide();
    };
    const onKeyUp = (e) => {
        if (e.keyCode === 13) {
            handleLogIn();
        }
    };

    return (
        <Modal show={props.show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Log In</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control name="username" type="text" placeholder="username"
                            value={username} onChange={onChangeUsername} onKeyUp={onKeyUp} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control name="password" type="password" placeholder="password"
                            value={password} onChange={onChangePassword} onKeyUp={onKeyUp} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleLogIn}>Log in</Button>
            </Modal.Footer>
        </Modal>
    );
}

function SignUpModal(props){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const onChangeUsername = (e) => setUsername(e.target.value);
    const onChangePassword = (e) => setPassword(e.target.value);
    const onHide = () => {
        setUsername('');
        setPassword('');
        props.onClose();
    };
    const handleSignUp = async () => {
        try {
            await signUpMutation(username, password);
            dispatch(logIn({
                username,
                password
            }));
            onHide();
        }
        catch (err) {
            dispatch(showAlert(err.message, 'danger'));
        }
    };
    const onKeyUp = (e) => {
        if (e.keyCode === 13) {
            handleLogIn();
        }
    };

    return (
        <Modal show={props.show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Sign Up</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control name="username" type="text" placeholder="username"
                            value={username} onChange={onChangeUsername} onKeyUp={onKeyUp} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control name="password" type="password" placeholder="password"
                            value={password} onChange={onChangePassword} onKeyUp={onKeyUp} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleSignUp}>Sign up</Button>
            </Modal.Footer>
        </Modal>
    );
}


function AppNavbar(props) {
    const [visible, setVisible] = useState(true);
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const dispatch = useDispatch();
    const userId = useSelector(state => state.user.id);
    const userName = useSelector(state => state.user.name);
    const avatarSrc = useSelector(state => state.user.avatar);

    const handleDropdown = (eventKey) => {
        switch (eventKey) {
            case 'logout':
                dispatch(logOut());
                break;
        }
    };
    const toggleShowLogin = () => setShowLoginModal(!showLoginModal);
    const toggleShowSignUp = () => setShowSignUpModal(!showSignUpModal);
    const handleScroll = () => {
        const currentScrollPos = window.pageYOffset;
        setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 70);
        setPrevScrollPos(currentScrollPos);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevScrollPos, visible, handleScroll]);

    const avatarImg = avatarSrc ? <Image roundedCircle src={avatarSrc} style={{width: '35px'}} /> : null;

    return (
        <Navbar fixed="top" style={{top: visible ? 0 : '-70px'}} id="app-navbar" variant="dark">
            <Navbar.Brand>[Logo]</Navbar.Brand>
            { userId ?
                (
                    <React.Fragment>
                        <Nav className="mr-auto ml-auto">
                            <Link className="nav-link" to="/">Home</Link>
                            <Link className="nav-link" to={`/user/${userName}`}>Profile</Link>
                            <Link className="nav-link" to={`/user/${userName}/cartoonList`}>Cartoon List</Link>
                            <Link className="nav-link" to={'/search/cartoons'}>Browse Cartoons</Link>
                        </Nav>
                        <NavDropdown onSelect={handleDropdown} alignRight title={avatarImg}>
                            <NavDropdown.Item eventKey="logout">Log out</NavDropdown.Item>
                        </NavDropdown>
                    </React.Fragment>
                )
                :
                (
                    <Nav className="mr-auto ml-auto">
                        <Link className="nav-link" to={'/search/cartoons'}>Browse Cartoons</Link>
                        <Nav.Link onClick={toggleShowLogin}>Log In</Nav.Link>
                        <Button onClick={toggleShowSignUp}>Sign Up</Button>
                    </Nav>
                )
            }
            <LoginModal show={showLoginModal} onClose={toggleShowLogin} />
            <SignUpModal show={showSignUpModal} onClose={toggleShowSignUp} />
        </Navbar>
    );
};

export default AppNavbar;