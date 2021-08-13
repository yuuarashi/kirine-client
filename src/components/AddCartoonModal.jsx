import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col, Modal, Form, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { fetchUserEntryForCartoon } from '../api/queries.js';
import { editListEntryMutation, removeListEntryMutation } from '../api/mutations.js';
import { entryStatuses, enumFormat } from '../api/utils.js';
import { showAlert } from '../reducers/alertReducer.js';

import './css/AddCartoonModal.css';
import 'react-datepicker/dist/react-datepicker.css';

const defaultEntry = {
    status: 'WATCHING',
    episodesSeen: '',
    score: '',
    startedWatching: null,
    finishedWatching: null,
    timesRewatched: '',
    notes: ''
};
const strToDate = datestr => datestr ? new Date(datestr) : null;

class AddCartoonModal extends React.Component {
    static propTypes = {
        show: PropTypes.bool.isRequired,
        onHide: PropTypes.func.isRequired,
        runIfSubmitted: PropTypes.func,
        cartoonId: PropTypes.string,
        dispatch: PropTypes.func.isRequired
    };

    constructor() {
        super();
        this.state = {
            entry: defaultEntry,
            cartoonInfo: {
                title: null,
                status: null,
                episodes: null,
                coverImage: null,
                bannerImage: null
            }
        };
        
        this.onChange = this.onChange.bind(this);
        this.onChangeStartDate = this.onChangeStartDate.bind(this);
        this.onChangeEndDate = this.onChangeEndDate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.removeEntry = this.removeEntry.bind(this);
    }

    async componentDidMount() {
        if (!this.props.cartoonId) return;

        try {
            const data = await fetchUserEntryForCartoon(this.props.cartoonId);
            const newCartoonInfo = {
                title: data.Cartoon.title,
                status: data.Cartoon.status,
                episodes: data.Cartoon.episodes,
                coverImage: data.Cartoon.coverImage,
                bannerImage: data.Cartoon.bannerImage
            };
            const newEntry = !data.Cartoon.userEntry ? defaultEntry : {
                ...data.Cartoon.userEntry,
                startedWatching: strToDate(data.Cartoon.userEntry.startedWatching),
                finishedWatching: strToDate(data.Cartoon.userEntry.finishedWatching)
            }
            this.setState({
                entry: newEntry,
                cartoonInfo: newCartoonInfo
            });
        }
        catch (err) {
            this.props.dispatch(showAlert(err.message, 'danger'));
        }
    }

    async componentDidUpdate(prevProps) {
        if (!this.props.cartoonId) return;
        if (this.props.show && !prevProps.show) {
            try {
                const data = await fetchUserEntryForCartoon(this.props.cartoonId);
                const newCartoonInfo = {
                    title: data.Cartoon.title,
                    status: data.Cartoon.status,
                    episodes: data.Cartoon.episodes,
                    coverImage: data.Cartoon.coverImage,
                    bannerImage: data.Cartoon.bannerImage
                };
                const newEntry = !data.Cartoon.userEntry ? defaultEntry : {
                    ...data.Cartoon.userEntry,
                    startedWatching: strToDate(data.Cartoon.userEntry.startedWatching),
                    finishedWatching: strToDate(data.Cartoon.userEntry.finishedWatching)
                }
                this.setState({
                    entry: newEntry,
                    cartoonInfo: newCartoonInfo
                });
            }
            catch (err) {
                this.props.dispatch(showAlert(err.message, 'danger'));
            }
        }
    }

    onChange(e) {
        const newEntry = { ...this.state.entry };
        newEntry[e.target.name] = e.target.value;
        this.setState({ entry: newEntry });
    }

    onChangeStartDate(date) {
        const newEntry = { ...this.state.entry };
        newEntry.startedWatching = date;
        this.setState({ entry: newEntry });
    }

    onChangeEndDate(date) {
        const newEntry = { ...this.state.entry };
        newEntry.finishedWatching = date;
        this.setState({ entry: newEntry });
    }

    async onSubmit() {
        const mutationParams = {
            cartoonId: this.props.cartoonId,
            status: this.state.entry.status,
            episodesSeen: parseInt(this.state.entry.episodesSeen) || null,
            score: parseInt(this.state.entry.score) || null,
            startedWatching: this.state.entry.startedWatching?.toISOString() || null,
            finishedWatching: this.state.entry.finishedWatching?.toISOString() || null,
            timesRewatched: parseInt(this.state.entry.timesRewatched) || null,
            notes: this.state.entry.notes
        };

        try {
            await editListEntryMutation(mutationParams);
            this.props.onHide();
            this.props.dispatch(showAlert('List entry successfully updated.', 'success'));
            this.props.runIfSubmitted?.();
        }
        catch (err) {
            this.props.dispatch(showAlert(err.message, 'danger'));
        }
    }

    async removeEntry() {
        try {
            await removeListEntryMutation(this.props.cartoonId);
            this.props.onHide();
            this.props.dispatch(showAlert('List entry successfully deleted.', 'success'));
            this.props.runIfSubmitted?.();
        }
        catch (err) {
            this.props.dispatch(showAlert(err.message, 'danger'));
            console.log(err);
        }
    }

    render() {
        return (
            <Modal id="add-cartoon-modal" show={this.props.show} onHide={this.props.onHide} size="lg">
                <Modal.Header closeButton style={{backgroundImage: `url(${this.state.cartoonInfo.bannerImage})`}}>
                    <img src={this.state.cartoonInfo.coverImage} />
                    <div id="cartoon-title">{this.state.cartoonInfo.title}</div>
                    <Button variant="primary" className="ml-auto" onClick={this.onSubmit}>Save</Button>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col lg={4}>
                                <Form.Group>
                                    <Form.Label>Status</Form.Label>
                                    <Form.Control as="select" name="status"
                                        value={this.state.entry.status} onChange={this.onChange}>
                                        {entryStatuses.map(s => (
                                            <option key={s} value={s}>{enumFormat(s)}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col lg={4}>
                                <Form.Group>
                                    <Form.Label>Score</Form.Label>
                                    <Form.Control name="score" type="number" min={0} max={100}
                                        value={this.state.entry.score} onChange={this.onChange} />
                                </Form.Group>
                            </Col>
                            <Col lg={4}>
                                <Form.Group>
                                    <Form.Label>Episode Progress</Form.Label>
                                    <Form.Control name="episodesSeen" type="number" min={0} max={this.state.cartoonInfo.episodes}
                                        value={this.state.entry.episodesSeen} onChange={this.onChange} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={4}>
                                <Form.Group>
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control as={DatePicker} selected={this.state.entry.startedWatching}
                                        onChange={this.onChangeStartDate} />
                                </Form.Group>
                            </Col>
                            <Col lg={4}>
                                <Form.Group>
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control as={DatePicker} selected={this.state.entry.finishedWatching}
                                        onChange={this.onChangeEndDate} />
                                </Form.Group>
                            </Col>
                            <Col lg={4}>
                                <Form.Group>
                                    <Form.Label>Total Rewatches</Form.Label>
                                    <Form.Control name="timesRewatched" type="number" min={0}
                                        value={this.state.entry.timesRewatched} onChange={this.onChange} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row style={{alignItems: 'flex-end'}}>
                            <Col lg={10}>
                                <Form.Group>
                                    <Form.Label>Notes</Form.Label>
                                    <Form.Control name="notes" value={this.state.entry.notes} onChange={this.onChange} />
                                </Form.Group>
                            </Col>
                            <Col lg={2}>
                                <Form.Group>
                                    <Form.Label>{' '}</Form.Label>
                                    <Button variant="outline-danger" onClick={this.removeEntry}>Delete</Button>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
        );
    }
}

export default connect()(AddCartoonModal);