import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { useDispatch, connect, useSelector } from 'react-redux';
import {
    Container, Row, Col,
    Card,  Media,
    Dropdown, Button, ButtonGroup
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import AddCartoonModal from './AddCartoonModal.jsx';
import { fetchCartoonByIdQuery } from '../api/queries.js';
import { enumFormat } from '../api/utils.js';
import { toggleFavMutation, editListEntryMutation } from '../api/mutations.js';
import { showAlert } from '../reducers/alertReducer.js';

import './css/CartoonPage.css';

function fuzzyDateToString(fuzzyDate) {
    const monthNames =
        [ , 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
    if (!fuzzyDate?.year) return null;
    if (!fuzzyDate.month) return fuzzyDate.year;
    if (!fuzzyDate.day) return `${monthNames[fuzzyDate.month]} ${fuzzyDate.year}`;
    return `${monthNames[fuzzyDate.month]} ${fuzzyDate.day}, ${fuzzyDate.year}`;
}

function CartoonHeader(props) {
    const dispatch = useDispatch();
    const viewerId = useSelector(state => state.user.id);
    const [showModal, setShowModal] = useState(false);

    const favButtonColor = (props.cartoon.isFavourite) ? '#ff8a82' : 'white';
    const addToListCaption = (props.cartoon.userEntry?.status) ?
        enumFormat(props.cartoon.userEntry.status) : 'Add to List';
    
    const favButtonHandler = async () => {
        try {
            await toggleFavMutation(props.cartoon.isFavourite, props.cartoon.id);
            const message = `${props.cartoon.isFavourite ? 'Removed from' : 'Added to' } favourites.`;
            props.toggleFav();
            dispatch(showAlert(message, 'success'));
        }
        catch (err) {
            dispatch(showAlert(err.message, 'danger'));
        }
    };
    const addToListHandler = () => setShowModal(true);
    const addToListHide = () => setShowModal(false);
    const setAsStatus = async status => {
        try {
            await editListEntryMutation({
                cartoonId: props.cartoon.id,
                status
            });
            dispatch(showAlert('List entry updated', 'success'));
        }
        catch (err) {
            dispatch(showAlert(err.message, 'danger'));
        }
    };
    const setAsWatchingHandler = () => setAsStatus('WATCHING');
    const setAsPlanningHandler = () => setAsStatus('PLANNING');

    return (
        <Container>
            <Row>
                <Col lg={3}>
                    <Card>
                        <Card.Img variant="top" src={props.cartoon.coverImage} />
                        <Card.Body>
                            <div className="cartoon-header-buttons">
                            <Dropdown as={ButtonGroup}>
                                <Button disabled={!viewerId} variant="primary" id="btn-add-to-list" onClick={addToListHandler}>
                                    {addToListCaption}
                                </Button>
                                <Dropdown.Toggle disabled={!viewerId} split variant="primary" id="dropdown-add-to-list" />
                                <Dropdown.Menu>
                                    <Dropdown.Item onSelect={setAsWatchingHandler}>Set as Watching</Dropdown.Item>
                                    <Dropdown.Item onSelect={setAsPlanningHandler}>Set as Planning</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onSelect={addToListHandler}>Open List Editor</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Button disabled={!viewerId} variant="danger" id="btn-add-favourite" onClick={favButtonHandler}>
                                <FontAwesomeIcon icon={faHeart} color={favButtonColor} />
                            </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col lg={9}>
                    <div className="cartoon-description">
                        <h5>{props.cartoon.title}</h5>
                        <p>{props.cartoon.description}</p>
                    </div>
                </Col>
            </Row>
            <AddCartoonModal show={showModal} onHide={addToListHide} cartoonId={props.cartoon.id} />
        </Container>
    );
};

function CartoonInfoBox(props) {
    const content = {
        'Format': enumFormat(props.cartoon.format),
        'Status': enumFormat(props.cartoon.status),
        'Episodes': props.cartoon.episodes,
        'Episode Duration': (props.cartoon.duration) ? `${props.cartoon.duration} mins` : null,
        'Start Date': fuzzyDateToString(props.cartoon.startDate),
        'End Date': fuzzyDateToString(props.cartoon.endDate),
        'Year': props.cartoon.year,
        'Average Score': props.cartoon.avgScore,
        'Popularity': props.cartoon.popularity,
        'Favourites': props.cartoon.favourites,
        'Country of Origin': props.cartoon.countryOfOrigin?.map(c => enumFormat(c)).join(', '),
        'Studios': props.cartoon.studios?.join(', '),
        'Genres': props.cartoon.genres?.map(g => enumFormat(g)).join(', ')
    };
    const fields = Object.entries(content).map(([k, v], i) => (
        <Card.Body key={i}>
            <Card.Title>{k}</Card.Title>
            <Card.Text>{v ? v : 'TBD'}</Card.Text>
        </Card.Body>
    ));
    return (
        <div className="cartoon-info-box">
            <Card>
                {fields}
            </Card>
            <Button id="edit-button" onClick={props.editCartoon}>Edit</Button>
        </div>
    );
}

const RelatedCartoonMedia = (props) => (
    <Media>
        <Link to={`/cartoon/${props.relatedId}`}>
            <img className="mr-3" height="110px" src={props.coverImage} />
        </Link>
        <Media.Body>
            <p className="cartoon-relation-type">{props.reltype}</p>
            <p className="cartoon-relation-title">{props.relatedTitle}</p>
            <p className="cartoon-relation-status">{props.relatedStatus}</p>
        </Media.Body>
    </Media>
);

function CartoonRelations(props) {
    const seasons = props.cartoon.seasons?.map(s => (
        <React.Fragment key={s.seasonCartoon.id}>
        <Col lg={6}>
            <RelatedCartoonMedia
                relatedId={s.seasonCartoon.id}
                coverImage={s.seasonCartoon.coverImage}
                reltype={`Season ${s.seasonNumber}`}
                relatedTitle={s.seasonCartoon.title}
                relatedStatus={enumFormat(s.seasonCartoon.status)} />
        </Col>
        </React.Fragment>
    ));
    const relations = props.cartoon.related?.map(r => (
        <React.Fragment key={r.relatedCartoon.id}>
        <Col lg={6}>
            <RelatedCartoonMedia
                relatedId={r.relatedCartoon.id}
                coverImage={r.relatedCartoon.coverImage}
                reltype={enumFormat(r.relationType)}
                relatedTitle={r.relatedCartoon.title}
                relatedStatus={`${enumFormat(r.relatedCartoon.format)} \u00b7 ${enumFormat(r.relatedCartoon.status)}`} />
        </Col>
        </React.Fragment>
    ));
    
    return (
        <Container>
            { (props.cartoon.format === 'MULTI_SEASON_SERIES' && seasons.length > 0) ? (
                <React.Fragment>
                <h5 className="cartoon-relation-header">Seasons</h5>
                <Row>
                    {seasons}
                </Row>
                <hr />
                </React.Fragment>
            ) : null }

            { (props.cartoon.format === 'SEASON' && props.cartoon.mainSeries) ? (
                <React.Fragment>
                <h5 className="cartoon-relation-header">Main Series</h5>
                <Row>
                    <Col lg={6}>
                    <RelatedCartoonMedia
                        relatedId={props.cartoon.mainSeries.id}
                        coverImage={props.cartoon.mainSeries.coverImage}
                        reltype=""
                        relatedTitle={props.cartoon.mainSeries.title}
                        relatedStatus={enumFormat(props.cartoon.mainSeries.status)} />
                    </Col>
                </Row>
                <hr />
                </React.Fragment>
            ) : null }

            { relations?.length > 0 ? (
                <React.Fragment>
                <h5 className="cartoon-relation-header">Relations</h5>
                <Row>
                    {relations}
                </Row>
                </React.Fragment>
            ) : null }
        </Container>
    );
}

class CartoonPage extends React.Component {
    static propTypes = {
        match: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired
    };

    constructor() {
        super();
        this.state = {
            cartoon: {}
        };

        this.toggleFav =  this.toggleFav.bind(this);
        this.editCartoon = this.editCartoon.bind(this);
    }

    async componentDidMount() {
        try {
            const data = await fetchCartoonByIdQuery(this.props.match.params.id);
            this.setState({
                cartoon: data.Cartoon
            });
            window.scroll(0, 0);
        }
        catch (err) {
            this.props.dispatch(showAlert(err.message, 'danger'));
        }
    }

    async componentDidUpdate(prevProps) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            try {
                const data = await fetchCartoonByIdQuery(this.props.match.params.id);
                this.setState({
                    cartoon: data.Cartoon
                });
                window.scroll(0, 0);
            }
            catch (err) {
                this.props.dispatch(showAlert(err.message, 'danger'));
            }
        }
    }

    toggleFav() {
        const newCartoon = {
            ...this.state.cartoon,
            isFavourite: !this.state.cartoon.isFavourite
        };
        this.setState({ cartoon: newCartoon });
    }

    editCartoon() {
        this.props.history.push(`/edit/cartoon/${this.props.match.params.id}`);
    }

    render() {
        const bannerPlaceholder = {
            height: `${400 * (window.innerWidth / 1900)}px`
        };

        return (
            <>
                <div className="cartoon-banner">
                    {this.state.cartoon.bannerImage ?
                        (<img src={this.state.cartoon.bannerImage} />)
                        :
                        (<div style={bannerPlaceholder} />)
                    }
                    <div className="cartoon-banner-shadow"></div>
                </div>
                <div className="cartoon-header">
                    <CartoonHeader cartoon={this.state.cartoon} toggleFav={this.toggleFav} />
                </div>
                <Container className="cartoon-info">
                    <Row>
                        <Col lg={3}>
                            <CartoonInfoBox cartoon={this.state.cartoon} editCartoon={this.editCartoon} />
                        </Col>
                        <Col lg={9}>
                            <CartoonRelations cartoon={this.state.cartoon} />
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default withRouter(connect()(CartoonPage));