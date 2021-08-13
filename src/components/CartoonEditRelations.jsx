import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Container, Row, Col, Media, Form, Button
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { enumFormat, reltypes } from '../api/utils.js';

export function CartoonEditSeasons(props) {
    const [seasonId, setSeasonId] = useState('');
    const [seasonNum, setSeasonNum] = useState(1);
    const handleSeasonId = (e) => {
        e.preventDefault();
        setSeasonId(e.target.value);
    };
    const handleSeasonNum = (e) => {
        e.preventDefault();
        setSeasonNum(e.target.value);
    };
    const handleAddSeason = async () =>{
        if (await props.addSeasonById(seasonId, seasonNum)) {
            setSeasonId('');
            setSeasonNum(1);
        }
    };

    const seasons = props.cartoon.seasons.map(s => (
        <React.Fragment key={s.seasonCartoon.id}>
        <Media className="cartoon-relation">
            <img src={s.seasonCartoon.coverImage} />
            <Media.Body>
                <Row>
                    <Col lg={6}>
                        <Link className="related-cartoon-title"
                            to={`/cartoon/${s.seasonCartoon.id}`}>
                            {s.seasonCartoon.title}
                        </Link>
                        <br />
                        <span className="related-cartoon-info">
                            {s.seasonCartoon.year}
                        </span>
                    </Col>
                    <Col lg={4}>
                        <div>{`Season ${s.seasonNumber}`}</div>
                    </Col>
                    <Col lg={1}>
                        <Button variant="outline-danger"
                            onClick={() => props.removeSeasonById(s.seasonCartoon.id)}>
                            <FontAwesomeIcon icon={faTrash} />
                        </Button>
                    </Col>
                </Row>
            </Media.Body>
        </Media>
        </React.Fragment>
    ));

    return (
        <Container className="cartoon-edit-relations cartoon-edit-section">
            <Form>
                <Form.Row>
                    <Col lg={6}>
                        <Form.Group>
                            <Form.Label>Cartoon ID</Form.Label>
                            <Form.Control value={seasonId} onChange={handleSeasonId} />
                        </Form.Group>
                    </Col>
                    <Col lg={4}>
                        <Form.Group>
                            <Form.Label>Season #</Form.Label>
                            <Form.Control value={seasonNum}
                                type="number" min={1}
                                onChange={handleSeasonNum} />
                        </Form.Group>
                    </Col>
                    <Col lg={2}>
                        <Form.Group>
                            <Form.Label>&nbsp;</Form.Label>
                            <Form.Control as={Button} onClick={handleAddSeason}>Add</Form.Control>
                        </Form.Group>
                    </Col>
                </Form.Row>
            </Form>
            <div className="relations-container">
                {seasons}
            </div>
        </Container>
    );
}

export function CartoonEditRelations(props) {
    const [relatedId, setRelatedId] = useState('');
    const [reltype, setReltype] = useState('SEQUEL');
    const handleRelatedId = (e) => {
        e.preventDefault();
        setRelatedId(e.target.value);
    };
    const handleReltype = (e) => {
        e.preventDefault();
        setReltype(e.target.value);
    };
    const handleAddRelation = async () =>{
        if (await props.addRelationById(relatedId, reltype)) {
            setRelatedId('');
            setReltype('SEQUEL');
        }
    };

    const relations = props.cartoon.related.map(r => (
        <React.Fragment key={r.relatedCartoon.id}>
        <Media className="cartoon-relation">
            <img src={r.relatedCartoon.coverImage} />
            <Media.Body>
                <Row>
                    <Col lg={6}>
                        <Link className="related-cartoon-title"
                            to={`/cartoon/${r.relatedCartoon.id}`}>
                            {r.relatedCartoon.title}
                        </Link>
                        <br />
                        <span className="related-cartoon-info">
                            {`${r.relatedCartoon.year} \u00b7 ${enumFormat(r.relatedCartoon.format)}`}
                        </span>
                    </Col>
                    <Col lg={4}>
                        <div>{enumFormat(r.relationType)}</div>
                    </Col>
                    <Col lg={1}>
                        <Button variant="outline-danger"
                            onClick={() => props.removeRelationById(r.relatedCartoon.id)}>
                            <FontAwesomeIcon icon={faTrash} />
                        </Button>
                    </Col>
                </Row>
            </Media.Body>
        </Media>
        </React.Fragment>
    ));

    return (
        <Container className="cartoon-edit-relations cartoon-edit-section">
            <Form>
                <Form.Row>
                    <Col lg={6}>
                        <Form.Group>
                            <Form.Label>Cartoon ID</Form.Label>
                            <Form.Control value={relatedId} onChange={handleRelatedId} />
                        </Form.Group>
                    </Col>
                    <Col lg={4}>
                        <Form.Group>
                            <Form.Label>Relation Type</Form.Label>
                            <Form.Control as="select" value={reltype} onChange={handleReltype}>
                                {reltypes.map(rt => (
                                    <option key={rt} value={rt}>{enumFormat(rt)}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col lg={2}>
                        <Form.Group>
                            <Form.Label>&nbsp;</Form.Label>
                            <Form.Control as={Button} onClick={handleAddRelation}>Add</Form.Control>
                        </Form.Group>
                    </Col>
                </Form.Row>
            </Form>
            <div className="relations-container">
                {relations}
            </div>
        </Container>
    );
}