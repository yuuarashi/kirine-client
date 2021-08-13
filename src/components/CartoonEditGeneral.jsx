import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Col, Form, Button, Media } from 'react-bootstrap';
import MultiSelect from 'react-multi-select-component';
import { enumFormat, genres, formats, statuses, countries } from '../api/utils.js';

const makeOptions = enumValues => enumValues.map(v => ({ value: v, label: enumFormat(v) }));
const genreOptions = makeOptions(genres);
const countryOptions = makeOptions(countries);

export default function CartoonEditGeneral(props) {
    const [newSynonym, setNewSynonym] = useState('');
    const [newMainId, setNewMainId] = useState(null);

    const newSynonymOnChange = (e) => {
        e.preventDefault();
        setNewSynonym(e.target.value);
    };
    const newSynonymOnBlur = () => {
        props.synonymsOnChange(props.cartoon.synonyms.length, {
            preventDefault: () => {},
            target: {
                value: newSynonym
            }
        });
        setNewSynonym('');
    };
    const handleNewMainId = (e) => {
        e.preventDefault();
        setNewMainId(e.target.value);
    };

    const synonymInputs = props.cartoon.synonyms.map((syn, i) => (
        <React.Fragment key={i}>
            <Col lg={4}>
                <Form.Control style={{ marginTop: (i > 2) ? '1rem' : 0 }} value={syn}
                   onChange={(e) => props.synonymsOnChange(i, e)}
                   onBlur={props.synonymsRemoveBlanks} />
            </Col>
        </React.Fragment>
    ));

    return (
        <Container className="cartoon-edit-section cartoon-edit-relations">
            <h5>Basic</h5>
            <Form>
                <Form.Row>
                    <Col lg={8}>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control name="title" value={props.cartoon.title}
                                onChange={props.genericOnChange} />
                        </Form.Group>
                    </Col>
                    <Col lg={4}>
                        <Form.Group>
                            <Form.Label>Format</Form.Label>
                            <Form.Control name="format" value={props.cartoon.format}
                                as="select" onChange={props.genericOnChange}>
                                {formats.map(f => (
                                    <option key={f} value={f}>{enumFormat(f)}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Form.Row>
                <Form.Row>
                    <Col lg={8}>
                        <Form.Group>
                            <Form.Label>Country of Origin</Form.Label>
                            <MultiSelect
                                value={makeOptions(props.cartoon.countryOfOrigin)}
                                options={countryOptions}
                                hasSelectAll={false}
                                disableSearch
                                onChange={os => props.multiselectOnChange('countryOfOrigin', os)} />
                        </Form.Group>
                    </Col>
                    <Col lg={3}>
                        <Form.Group>
                            <Form.Label>Main Series ID</Form.Label>
                            <Form.Control value={(newMainId === null) ? props.cartoon.mainSeries?.id || '' : newMainId}
                                onChange={handleNewMainId} />
                        </Form.Group>
                    </Col>
                    <Col lg={1}>
                        <Form.Group>
                            <Form.Label>&nbsp;</Form.Label>
                            <Form.Control as={Button} onClick={() => props.setMainSeries(newMainId)}>Set</Form.Control>
                        </Form.Group>
                    </Col>
                </Form.Row>
                {props.cartoon.mainSeries &&
                <Media className="cartoon-relation">
                    <img src={props.cartoon.mainSeries.coverImage} />
                    <Media.Body>
                        <Link className="related-cartoon-title"
                            to={`/cartoon/${props.cartoon.mainSeries.id}`}>
                            {props.cartoon.mainSeries.title}
                        </Link>
                        <br />
                        <span className="related-cartoon-info">
                            {props.cartoon.mainSeries.year}
                        </span>
                    </Media.Body>
                </Media>}
            </Form>

            <h5>Release Data</h5>
            <Form>
                <Form.Row>
                    <Col lg={4}>
                        <Form.Group>
                            <Form.Label>Status</Form.Label>
                            <Form.Control name="status" value={props.cartoon.status}
                                as="select" onChange={props.genericOnChange}>
                                {statuses.map(s => (
                                    <option key={s} value={s}>{enumFormat(s)}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col lg={4}>
                        <Form.Group>
                            <Form.Label>Year</Form.Label>
                            <Form.Control name="year" value={props.cartoon.year}
                                type="number" min={1900} max={(new Date()).getFullYear() + 1}
                                onChange={props.genericOnChange} />
                        </Form.Group>
                    </Col>
                </Form.Row>

                <h5 className="subform-header">Start Date</h5>
                <Form.Row>
                    <Col lg={4}>
                        <Form.Group>
                            <Form.Label>Year</Form.Label>
                            <Form.Control name="startDate.year" value={props.cartoon.startDate.year}
                                type="number" min={1900} max={(new Date()).getFullYear() + 1}
                                onChange={props.subfieldOnChange} />
                        </Form.Group>
                    </Col>
                    <Col lg={4}>
                        <Form.Group>
                            <Form.Label>Month</Form.Label>
                            <Form.Control name="startDate.month" value={props.cartoon.startDate.month}
                                type="number" min={1} max={12}
                                onChange={props.subfieldOnChange} />
                        </Form.Group>
                    </Col>
                    <Col lg={4}>
                        <Form.Group>
                            <Form.Label>Day</Form.Label>
                            <Form.Control name="startDate.day" value={props.cartoon.startDate.day}
                                type="number" min={1} max={31}
                                onChange={props.subfieldOnChange} />
                        </Form.Group>
                    </Col>
                </Form.Row>

                <h5 className="subform-header">End Date</h5>
                <Form.Row>
                    <Col lg={4}>
                        <Form.Group>
                            <Form.Label>Year</Form.Label>
                            <Form.Control name="endDate.year" value={props.cartoon.endDate.year}
                                type="number" min={1900} max={(new Date()).getFullYear() + 1}
                                onChange={props.subfieldOnChange} />
                        </Form.Group>
                    </Col>
                    <Col lg={4}>
                        <Form.Group>
                            <Form.Label>Month</Form.Label>
                            <Form.Control name="endDate.month" value={props.cartoon.endDate.month}
                                type="number" min={1} max={12}
                                onChange={props.subfieldOnChange} />
                        </Form.Group>
                    </Col>
                    <Col lg={4}>
                        <Form.Group>
                            <Form.Label>Day</Form.Label>
                            <Form.Control name="endDate.day" value={props.cartoon.endDate.day}
                                type="number" min={1} max={31}
                                onChange={props.subfieldOnChange} />
                        </Form.Group>
                    </Col>
                </Form.Row>
            </Form>

            <h5>Length</h5>
            <Form>
                <Form.Row>
                    <Col lg={4}>
                        <Form.Group>
                            <Form.Label>Episodes</Form.Label>
                            <Form.Control name="episodes" value={props.cartoon.episodes}
                                type="number" min={0}
                                onChange={props.genericOnChange} />
                        </Form.Group>
                    </Col>
                    <Col lg={4}>
                        <Form.Group>
                            <Form.Label>Episode duration (min)</Form.Label>
                            <Form.Control name="duration" value={props.cartoon.duration}
                                type="number" min={0}
                                onChange={props.genericOnChange} />
                        </Form.Group>
                    </Col>
                </Form.Row>
            </Form>

            <h5>Genres</h5>
            <Form>
                <MultiSelect
                    value={makeOptions(props.cartoon.genres)}
                    options={genreOptions}
                    hasSelectAll={false}
                    disableSearch
                    onChange={os => props.multiselectOnChange('genres', os)} />
            </Form>

            <h5>Synonyms</h5>
            <Form>
                <Form.Row>
                    {synonymInputs}
                    <Col lg={4}>
                        <Form.Control  value={newSynonym}
                            style={{ marginTop: (props.cartoon.synonyms.length > 2) ? '1rem' : 0 }}
                            onChange={newSynonymOnChange} onBlur={newSynonymOnBlur} />
                    </Col>
                </Form.Row>
            </Form>

            <h5>Description</h5>
            <Form>
                <Form.Control name="description" value={props.cartoon.description}
                    as="textarea" rows={5}
                    onChange={props.genericOnChange} />
            </Form>
        </Container>
    );
}