import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import {
    Container, Row, Col,
    Form, InputGroup, Media,
    Dropdown, DropdownButton, Button
} from 'react-bootstrap';
import MultiSelect from 'react-multi-select-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';
import { fetchCartoonsPageQuery } from '../api/queries.js';
import { enumFormat, genres, statuses, formats } from '../api/utils.js';
import { showAlert } from '../reducers/alertReducer.js';

import './css/CartoonSearch.css';

const nullIfEmpty = list => list.length === 0 ? null : list;
const makeOptions = enumValues => enumValues.map(v => ({ value: v, label: enumFormat(v) }));
const genreOptions = makeOptions(genres);
const formatOptions = makeOptions(formats);
const statusOptions = makeOptions(statuses);

const episodeString = episodes =>
    episodes ? (episodes === 1 ? ' \u00b7 1 episode' : ` \u00b7 ${episodes} episodes`) : '';

function CartoonSearchResults(props) {
    const cartoonMedias = props.cartoons.map(cartoon => (
        <React.Fragment key={cartoon.id}>
        <Col lg={6}>
            <Media className="cartoon-search-result">
                <Link to={`/cartoon/${cartoon.id}`}>
                    <img src={cartoon.coverImage} />
                </Link>
                <Media.Body>
                    <h5 className="search-result-title">{cartoon.title}</h5>
                    <p className="search-result-format">
                        {enumFormat(cartoon.format) + episodeString(cartoon.episodes)}
                    </p>
                    <p className="search-result-description">{cartoon.description}</p>
                    <div>
                        {cartoon.genres.map(g => (
                            <span key={g} className="search-result-genre">{enumFormat(g)}</span>
                        ))}
                    </div>
                    <p className="search-result-score">{'[score]%'}</p>
                </Media.Body>
            </Media>
        </Col>
        </React.Fragment>
    ));
    return (
        <Row>
            {cartoonMedias}
        </Row>
    );
}

class CartoonSearch extends React.Component {
    static propTypes = {
        history: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        const filter = this.urlToFilter();
        this.state = {
            pagesLoaded: null,
            hasNextPage: null,
            cartoons: [],
            filter
        };
        this.submitTimer = null;
        
        this.fetchCartoons = this.fetchCartoons.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSelectChange = this.onSelectChange.bind(this);
        this.scrollTracker = this.scrollTracker.bind(this);
        this.onSelectSort = this.onSelectSort.bind(this);
        this.addNewCartoon = this.addNewCartoon.bind(this);
    }

    urlToFilter() {
        const queryString = new URLSearchParams(this.props.history.location.search);
        const filter = {
            search: queryString.get('search') || '',
            year: queryString.get('year') || '',
            sort: queryString.get('sort') || '',
            genres: queryString.getAll('genre'),
            formats: queryString.getAll('format'),
            statuses: queryString.getAll('status')
        };
        return filter;
    }

    filterToUrl() {
        const filter = this.state.filter;
        const queryString = new URLSearchParams();
        if (filter.search) queryString.append('search', filter.search);
        if (filter.year) queryString.append('year', filter.year);
        if (filter.sort) queryString.append('sort', filter.sort);
        if (filter.genres.length > 0) {
            for (let g of filter.genres) {
                queryString.append('genre', g);
            }
        }
        if (filter.formats.length > 0) {
            for (let f of filter.formats) {
                queryString.append('format', f);
            }
        }
        if (filter.statuses.length > 0) {
            for (let s of filter.statuses) {
                queryString.append('status', s);
            }
        }

        return `/search/cartoons?${queryString.toString()}`;
    }

    componentDidMount() {
        this.fetchCartoons();
        document.addEventListener('scroll', this.scrollTracker);
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.scrollTracker);
    }

    componentDidUpdate(prevProps, prevState) {
        const delayed = ['search', 'year'];

        if (!_.isEqual(_.pick(this.state.filter, delayed), _.pick(prevState.filter, delayed))) {
            this.submitTimer = setTimeout(this.fetchCartoons, 1000);
        }
        else if (!_.isEqual(this.state.filter, prevState.filter)) {
            this.fetchCartoons();
        }
    }

    async fetchCartoons() {
        try {
            const data = await fetchCartoonsPageQuery({
                pageNum: 1,
                perPage: 20,
                search: this.state.filter.search || null,
                year: parseInt(this.state.filter.year) || null,
                sort: this.state.filter.sort || (this.state.filter.search && 'SEARCH_MATCH') || null,
                genres: nullIfEmpty(this.state.filter.genres),
                formats: nullIfEmpty(this.state.filter.formats),
                statuses: nullIfEmpty(this.state.filter.statuses)
            });
            this.setState({
                cartoons: data.cartoons.items,
                pagesLoaded: data.cartoons.pageInfo.currentPage,
                hasNextPage: data.cartoons.pageInfo.hasNextPage
            });
            this.props.history.push(this.filterToUrl());
        }
        catch (err) {
            this.props.dispatch(showAlert(err.message, 'danger'));
        }
    }

    scrollTracker() {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight
            && this.state.hasNextPage) {
                this.fetchNextPage();
        }
    }

    async fetchNextPage() {
        try {
            const data = await fetchCartoonsPageQuery({
                pageNum: this.state.pagesLoaded + 1,
                perPage: 20,
                search: this.state.filter.search || null,
                sort: this.state.filter.sort || 'SEARCH_MATCH',
                year: parseInt(this.state.filter.year) || null,
                genres: nullIfEmpty(this.state.filter.genres),
                formats: nullIfEmpty(this.state.filter.formats),
                statuses: nullIfEmpty(this.state.filter.statuses)
            });
            this.setState({
                cartoons: this.state.cartoons.concat(data.cartoons.items),
                pagesLoaded: data.cartoons.pageInfo.currentPage,
                hasNextPage: data.cartoons.pageInfo.hasNextPage
            });
        }
        catch (err) {
            this.props.dispatch(showAlert(err.message, 'danger'));
        }
    }

    onChange(e) {
        clearTimeout(this.submitTimer);
        const newFilter = { ...this.state.filter };
        newFilter[e.target.name] = e.target.value;
        this.setState({ filter: newFilter });
    }

    onSelectChange(name, options) {
        const newFilter = {
            ...this.state.filter,
            [name]: options.map(o => o.value)
        };
        this.setState({ filter: newFilter });
    }

    onSelectSort(eventKey) {
        const newFilter = {
            ...this.state.filter,
            sort: eventKey
        };
        this.setState({ filter: newFilter });
    }

    addNewCartoon() {
        this.props.history.push('/add/cartoon');
    }

    render() {   
        return (
            <Container style={{ marginTop: '100px' }}>
                <Row className="cartoon-search-filter">
                    <Col lg={2}>
                        <Form.Group>
                            <Form.Label className="filter-label">Search</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    name="search" value={this.state.filter.search} onChange={this.onChange} />
                                <InputGroup.Append>
                                    <InputGroup.Text><FontAwesomeIcon icon={faSearch} /></InputGroup.Text>
                                </InputGroup.Append>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col lg={2}>
                        <Form.Group>
                            <Form.Label className="filter-label">Genres</Form.Label>
                            <MultiSelect
                                value={makeOptions(this.state.filter.genres)}
                                options={genreOptions}
                                hasSelectAll={false}
                                disableSearch
                                onChange={v => this.onSelectChange('genres', v)} />
                        </Form.Group>
                    </Col>
                    <Col lg={2}>
                        <Form.Group>
                            <Form.Label className="filter-label">Year</Form.Label>
                            <Form.Control
                                name="year" value={this.state.filter.year}
                                type="number" min="1940" max={(new Date()).getFullYear()}
                                onChange={this.onChange} />
                        </Form.Group>
                    </Col>
                    <Col lg={2}>
                        <Form.Group>
                            <Form.Label className="filter-label">Format</Form.Label>
                            <MultiSelect
                                value={makeOptions(this.state.filter.formats)}
                                options={formatOptions}
                                hasSelectAll={false}
                                disableSearch
                                onChange={v => this.onSelectChange('formats', v)} />
                        </Form.Group>
                    </Col>
                    <Col lg={2}>
                        <Form.Group>
                            <Form.Label className="filter-label">Airing Status</Form.Label>
                            <MultiSelect
                                value={makeOptions(this.state.filter.statuses)}
                                options={statusOptions}
                                hasSelectAll={false}
                                disableSearch
                                onChange={v => this.onSelectChange('statuses', v)} />
                        </Form.Group>
                    </Col>
                    <Col lg={1}>
                        <Form.Group>
                            <Form.Label>&nbsp;</Form.Label>
                            <DropdownButton id="cartoon-sort-button" title="Sort" onSelect={this.onSelectSort}>
                                <Dropdown.Item eventKey="TITLE">Title</Dropdown.Item>
                                <Dropdown.Item eventKey="POPULARITY_DESC">Popularity</Dropdown.Item>
                                <Dropdown.Item eventKey="AVG_SCORE_DESC">Average Score</Dropdown.Item>
                                <Dropdown.Item eventKey="FAVOURTIES_DESC">Favourites</Dropdown.Item>
                                <Dropdown.Item eventKey="START_DATE_DESC">Release Date</Dropdown.Item>
                            </DropdownButton>
                        </Form.Group>
                    </Col>
                    <Col lg={1}>
                        <Form.Group>
                            <Form.Label>&nbsp;</Form.Label>
                            <Form.Control id="add-cartoon-button" as={Button} onClick={this.addNewCartoon}>
                                <FontAwesomeIcon icon={faPlus} />
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>
                <CartoonSearchResults cartoons={this.state.cartoons} />
            </Container>
        );
    }
}

export default withRouter(connect()(CartoonSearch));