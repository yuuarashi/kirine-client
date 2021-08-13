import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    Container, Row, Col,
    Tab, Nav, Form, Button
} from 'react-bootstrap';
import CartoonEditGeneral from './CartoonEditGeneral.jsx';
import { CartoonEditRelations, CartoonEditSeasons } from './CartoonEditRelations.jsx';
import { fetchCartoonByIdEditQuery, fetchBasicCartoonInfoQuery } from '../api/queries.js';
import { addCartoonMutation, updateCartoonMutation } from '../api/mutations.js';
import { showAlert } from '../reducers/alertReducer.js';

import './css/CartoonEdit.css';

function CartoonEditImages(props) {
    return (
        <Container className="cartoon-edit-section">
            <h5>Cover</h5>
            <Form>
                <Form.Control name="coverImage" value={props.cover} placeholder="Cover image URL"
                    onChange={props.onChange} />
                <img src={props.cover} className="cover" />
            </Form>
            <h5>Banner</h5>
            <Form>
                <Form.Control name="bannerImage" value={props.banner} placeholder="Banner image URL"
                    onChange={props.onChange} />
                <img src={props.banner} className="banner" />
            </Form>
        </Container>
    );
}

class CartoonEdit extends React.Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired,
        new: PropTypes.bool
    }

    constructor() {
        super();
        this.state = {
            cartoon: {
                id: null,
                title: '',
                format: 'SINGLE_SEASON_SERIES',
                status: 'RELEASING',
                year: '',
                episodes: '',
                duration: '',
                description: '',
                startDate: {
                    year: '',
                    month: '',
                    day: ''
                },
                endDate: {
                    year: '',
                    month: '',
                    day: ''
                },
                genres: [],
                synonyms: [],
                countryOfOrigin: [],
                coverImage: '',
                bannerImage: '',
                mainSeries: null,
                seasons: [],
                related: []
            }
        };

        this.genericOnChange = this.genericOnChange.bind(this);
        this.subfieldOnChange = this.subfieldOnChange.bind(this);
        this.synonymsOnChange = this.synonymsOnChange.bind(this);
        this.synonymsRemoveBlanks = this.synonymsRemoveBlanks.bind(this);
        this.multiselectOnChange = this.multiselectOnChange.bind(this);
        this.addRelationById = this.addRelationById.bind(this);
        this.removeRelationById = this.removeRelationById.bind(this);
        this.addSeasonById = this.addSeasonById.bind(this);
        this.removeSeasonById = this.removeSeasonById.bind(this);
        this.setMainSeries = this.setMainSeries.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    async componentDidMount() {
        window.scroll(0, 0);
        
        if (this.props.new) return;

        try {
            const data = await fetchCartoonByIdEditQuery(this.props.match.params.id);
            this.setState({
                cartoon: data.Cartoon
            });
        }
        catch (err) {
            this.props.dispatch(showAlert(err.message, 'danger'));
        }
    }

    genericOnChange(e) {
        e.preventDefault();
        const newCartoon = { ...this.state.cartoon };
        newCartoon[e.target.name] = e.target.value;
        this.setState({
            cartoon: newCartoon
        });
    }

    subfieldOnChange(e) {
        e.preventDefault();
        const newCartoon = { ...this.state.cartoon };
        const [field, subfield] = e.target.name.split('.');
        newCartoon[field][subfield] = e.target.value;
        this.setState({
            cartoon: newCartoon
        });
    }

    synonymsOnChange(i, e) {
        e.preventDefault();
        const newCartoon = { ...this.state.cartoon };
        newCartoon.synonyms[i] = e.target.value;
        this.setState({
            cartoon: newCartoon
        });
    }

    synonymsRemoveBlanks() {
        const newCartoon = { ...this.state.cartoon };
        newCartoon.synonyms = newCartoon.synonyms.filter(s => s.length > 0);
        this.setState({
            cartoon: newCartoon
        });
    }

    multiselectOnChange(name, selectedOptions) {
        const newCartoon = { ...this.state.cartoon };
        newCartoon[name] = selectedOptions.map(o => o.value);
        this.setState({
            cartoon: newCartoon
        });
    }

    async addRelationById(relatedId, reltype) {
        try {
            const data = await fetchBasicCartoonInfoQuery(relatedId);
            if (data.Cartoon) {
                const newRelation = {
                    relationType: reltype,
                    relatedCartoon: data.Cartoon
                };
                const newCartoon = { ...this.state.cartoon };
                newCartoon.related = [newRelation, ...newCartoon.related];
                this.setState({
                    cartoon: newCartoon
                });
                return true;
            }
            else {
                this.props.dispatch(showAlert(`Cartoon with id ${relatedId} does not exist.`, 'danger'));
            }
        }
        catch (err) {
            this.props.dispatch(showAlert(err.message, 'danger'));
        }
    }

    removeRelationById(id) {
        const newCartoon = { ...this.state.cartoon };
        newCartoon.related = newCartoon.related.filter(r => r.relatedCartoon.id != id);
        this.setState({
            cartoon: newCartoon
        });
    }

    async addSeasonById(seasonId, seasonNum) {
        try {
            const data = await fetchBasicCartoonInfoQuery(seasonId);
            if (data.Cartoon) {
                const newSeason = {
                    seasonNumber: seasonNum,
                    seasonCartoon: data.Cartoon
                };
                const newCartoon = { ...this.state.cartoon };
                newCartoon.seasons = [...newCartoon.seasons, newSeason]
                    .sort((a, b) => a.seasonNumber - b.seasonNumber);
                this.setState({
                    cartoon: newCartoon
                });
                return true;
            }
            else {
                this.props.dispatch(showAlert(`Cartoon with id ${relatedId} does not exist.`, 'danger'));
            }
        }
        catch (err) {
            this.props.dispatch(showAlert(err.message, 'danger'));
        }
    }

    removeSeasonById(id) {
        const newCartoon = { ...this.state.cartoon };
        newCartoon.seasons = newCartoon.seasons.filter(s => s.seasonCartoon.id != id);
        this.setState({
            cartoon: newCartoon
        });
    }

    async setMainSeries(id) {
        if (!id) {
            const newCartoon = {
                ...this.state.cartoon,
                mainSeries: null
            };
            this.setState({
                cartoon: newCartoon
            });
            return;
        }

        try {
            const data = await fetchBasicCartoonInfoQuery(id);
            if (data.Cartoon) {
                const newCartoon = {
                    ...this.state.cartoon,
                    mainSeries: data.Cartoon
                };
                this.setState({
                    cartoon: newCartoon
                });
            }
            else {
                this.props.dispatch(showAlert(`Cartoon with id ${relatedId} does not exist.`, 'danger'));
            }
        }
        catch (err) {
            this.props.dispatch(showAlert(err.message, 'danger'));
        }
    }

    async onSubmit() {
        const cartoon = this.state.cartoon;
        const fuzzyDateString = date => (
            (date.year ? date.year.toString().padStart(4, '0') : '0000') +
            (date.month ? date.month.toString().padStart(2, '0') : '00') +
            (date.day ? date.day.toString().padStart(2, '0') : '00')
        );
        const numberOrNull = str => parseInt(str) || null;
        const seasonsInput = seasons => seasons.map(s => ({
            seasonNumber: parseInt(s.seasonNumber),
            seasonCartoon: s.seasonCartoon.id
        }));
        const connectionInput = related => related.map(r => ({
            relationType: r.relationType,
            relatedCartoon: r.relatedCartoon.id
        }));

        const submission = {
            ...cartoon,
            startDate: fuzzyDateString(cartoon.startDate),
            endDate: fuzzyDateString(cartoon.endDate),
            year: numberOrNull(cartoon.year),
            episodes: numberOrNull(cartoon.episodes),
            duration: numberOrNull(cartoon.duration),
            mainSeries: cartoon.mainSeries?.id,
            seasons: seasonsInput(cartoon.seasons),
            related: connectionInput(cartoon.related)
        };
        
        try {
            const result = await (this.props.new ?
                addCartoonMutation(submission) : updateCartoonMutation(submission));
            const cartoonId = result[this.props.new ?'addCartoon' : 'updateCartoon']['id'];
            this.props.history.push(`/cartoon/${cartoonId}`);
        }
        catch (err) {
            this.props.dispatch(showAlert(err.message, 'danger'));
        }
    }

    render() {
        return (
            <Container style={{ marginTop: '120px' }}>
                <Tab.Container defaultActiveKey="general">
                    <Row>
                        <Col lg={2}>
                            <Button className="cartoon-edit-submit" onClick={this.onSubmit}>Submit</Button>
                            <Nav variant="pills" className="flex-column cartoon-edit-menu">
                                <Nav.Item>
                                    <Nav.Link eventKey="general">General</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="images">Images</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="seasons">Seasons</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="relations">Relations</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col lg={8}>
                            <Tab.Content>
                                <Tab.Pane eventKey="general">
                                    <CartoonEditGeneral cartoon={this.state.cartoon}
                                        genericOnChange={this.genericOnChange}
                                        subfieldOnChange={this.subfieldOnChange}
                                        synonymsOnChange={this.synonymsOnChange}
                                        synonymsRemoveBlanks={this.synonymsRemoveBlanks}
                                        multiselectOnChange={this.multiselectOnChange}
                                        setMainSeries={this.setMainSeries} />
                                </Tab.Pane>
                                <Tab.Pane eventKey="images">
                                    <CartoonEditImages
                                        cover={this.state.cartoon.coverImage}
                                        banner={this.state.cartoon.bannerImage}
                                        onChange={this.genericOnChange} />
                                </Tab.Pane>
                                <Tab.Pane eventKey="seasons">
                                    <CartoonEditSeasons cartoon={this.state.cartoon}
                                        addSeasonById={this.addSeasonById}
                                        removeSeasonById={this.removeSeasonById} />
                                </Tab.Pane>
                                <Tab.Pane eventKey="relations">
                                    <CartoonEditRelations cartoon={this.state.cartoon}
                                        addRelationById={this.addRelationById}
                                        removeRelationById={this.removeRelationById} />
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </Container>
        );
    }
}

export default withRouter(connect()(CartoonEdit));