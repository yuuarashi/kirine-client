import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Switch, Route, NavLink, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Navbar, Nav, Container, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import CartoonList from './CartoonList.jsx';
import { fetchUserByNameQuery } from '../api/queries.js';
import { enumFormatShort } from '../api/utils.js';
import { showAlert } from '../reducers/alertReducer.js';

import './css/UserPage.css';

function ProfileOverview(props) {
    const favs = props.profileOwner.favourites?.map((f, i) => (
        <React.Fragment key={f.id}>
        <OverlayTrigger placement="top" overlay={(
            <Tooltip>
                <div className="overview-fav-tooltip">
                    <div className="overview-fav-title">{f.title}</div>
                    <div className="overview-fav-info">{`${f.year} \u00b7 ${enumFormatShort(f.format)}`}</div>
                </div>
            </Tooltip>
        )}>
            <Link className="overview-fav" to={`/cartoon/${f.id}`}>
                <img src={f.coverImage} />
            </Link>
        </OverlayTrigger>
        {i % 4 === 3 && <br />}
        </React.Fragment>
    ));

    const stats = props.profileOwner.stats;
    const days = (stats?.totalMinutes / (60 * 24)).toFixed(1);
    const perc = (stats?.completed / (stats?.completed + stats?.watching) * 100) || 0;
    const gradient = [
        ['#b368e6', 0],
        ['', perc],
        ['#151f2e', perc + 10]
    ];
    const statBarStyle = {
        background: `linear-gradient(to right, ${gradient.map(p => `${p[0]} ${p[1]}%`).join(', ')})`
    };

    return (
        <Container style={{ marginTop: '50px' }}>
            <Row>
                <Col lg={6}>
                    <h5 style={{ fontSize: '12pt', margin: '0 0 1rem 1rem' }}>Favourites</h5>
                    <div className="overview-favs-container">
                        {favs}
                    </div>
                </Col>
                <Col lg={6}>
                    <h5 style={{ fontSize: '12pt', margin: '0 0 1rem 1rem' }}>Stats</h5>
                    <Container className="overview-stats-container">
                        <Row className="overview-stats-header">
                            <Col lg={6}>
                                <div>Days: {days}</div>
                            </Col>
                            <Col lg={6}>
                                <div>Average score: {stats?.avgScore}</div>
                            </Col>
                        </Row>
                        <Row className="overview-stats-details">
                            <Col lg={3} className="overview-stats-labels">
                                <div>Watching:</div>
                                <div>Completed:</div>
                                <div>Dropped:</div>
                                <div>Paused:</div>
                                <div>Planning:</div>
                            </Col>
                            <Col lg={3} className="overview-stats-numbers">
                                <div>{stats?.watching}</div>
                                <div>{stats?.completed}</div>
                                <div>{stats?.dropped}</div>
                                <div>{stats?.paused}</div>
                                <div>{stats?.planning}</div>
                            </Col>
                            <Col lg={3} className="overview-stats-labels">
                                <div>Titles:</div>
                                <div>Episodes:</div>
                            </Col>
                            <Col lg={3} className="overview-stats-numbers">
                                <div>{stats?.totalCartoons}</div>
                                <div>{stats?.totalEpisodes}</div>
                            </Col>
                        </Row>
                    </Container>
                    <div className="overview-stats-bar" style={statBarStyle}></div>
                </Col>
            </Row>
        </Container>
    );
}

class UserPage extends React.Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired
    };

    constructor() {
        super();
        this.state = {
            profileOwner: {}
        };
    }

    async componentDidMount() {
        try {
            const data = await fetchUserByNameQuery(this.props.match.params.name);
            this.setState({
                profileOwner: data.User
            });
        }
        catch (err) {
            this.props.dispatch(showAlert(err.message, 'danger'));
        }
    }

    async componentDidUpdate(prevProps) {
        if (this.props.match.params.name !== prevProps.match.params.name) {
            try {
                const data = await fetchUserByNameQuery(this.props.match.params.name);
                this.setState({
                    profileOwner: data.User
                });
            }
            catch (err) {
                this.props.dispatch(showAlert(err.message, 'danger'));
            }
        }
    }

    render() {
        const bannerPlaceholder = {
            height: `${400 * (window.innerWidth / 1900)}px`
        };

        return (
            <div>
                <div className="user-banner-container">
                    {this.state.profileOwner.bannerImage ?
                        (<img className="user-banner" src={this.state.profileOwner.bannerImage} />)
                        :
                        (<div style={bannerPlaceholder} />)
                    }
                    <div className="user-banner-shadow"></div>
                    <img className="user-avatar" src={this.state.profileOwner.avatar} />
                    <div className="user-name">{this.state.profileOwner.name}</div>
                </div>
                <Navbar id="user-navbar" variant="dark">
                    <Nav className="mr-auto ml-auto">
                        <NavLink exact
                            to={this.props.match.url}
                            className="nav-link"
                            activeClassName="nav-link selected">
                            Overview
                        </NavLink>
                        <NavLink
                            to={`${this.props.match.url}/cartoonList`}
                            className="nav-link"
                            activeClassName="nav-link selected">
                            Cartoon List
                        </NavLink>
                    </Nav>
                </Navbar>
                <Switch>
                    <Route exact path={this.props.match.path}>
                        <ProfileOverview profileOwner={this.state.profileOwner} />
                    </Route>
                    <Route exact path={`${this.props.match.path}/cartoonList`}>
                        <CartoonList username={this.state.profileOwner.name} />
                    </Route>
                </Switch>
            </div>
        );
    }
}

export default withRouter(connect()(UserPage));