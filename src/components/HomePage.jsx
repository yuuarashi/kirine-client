import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import './css/HomePage.css';

const statusConverter = status => status.split('-').map(w => w[0].toUpperCase() + w.substr(1)).join(' ');

const ProjectTask = (props) => (
    <div className="project-task">
        <div className="project-task-description">
            {props.desc}
        </div>
        <div className={`project-task-status ${props.status}`}>
            {statusConverter(props.status)}
        </div>
    </div>
);

export default function HomePage(props) {
    return (
        <Container style={{ marginTop: '100px' }}>
            <Row>
                <Col lg={8}>
                    <div className="project-description">
                        <p><em><b>Note: you may log in as the test user (name: test, password: test)</b></em></p>
                        <br />
                        <p>This project aims to build a platform where fans of English-language animation
                        can catalogue the animated works they have seen or are currently watching
                        and share them with other users.</p>
                        <p>The idea was conceived within the anime community, and several such
                        platforms have been developed over the course of the past two decades,
                        &nbsp;<a href="https://anidb.net/">AniDB</a>&nbsp;
                        and&nbsp;<a href="https://myanimelist.net/">MyAnimeList</a>&nbsp;
                        among the most notable examples.</p>
                        <p>However, a platform with a comparably wide range of features
                        for animation produced in other countries remains to be implemented.
                        Websites originally created for anime cannot be repurposed to meet the demand
                        because they are closely tailored to te specifics of the Japanese animation industry.</p>
                        <p>A minimal list of requirements for such a plaform would include:
                            <ul>
                                <li>A database of animated works and convenient browsing tools.</li>
                                <li>Allowing users to create and share list-like collections of works,
                                    e.g. "Completed" or "Planning to watch"</li>
                                <li>Allowing users to rate those works and publish their reviews.</li>
                                <li>Allowing users to discover and follow other users.</li>
                                <li>A forum for discussions.</li>
                            </ul>
                        </p>
                        <p>At present, the project meets only two of these requirements.
                        The design and structure of the website are heavily inspired by (if not basically copied from)
                        &nbsp;<a href="https://anilist.co/">anilist.co</a>.
                        This is a tentative decision resorted to because of time limitations and it must be changed later
                        if the project is to grow into anything bigger than an educational pastime.</p>
                    </div>
                    <hr />
                    <h5>Tasks</h5>
                    <div className="project-task-container">
                        <ProjectTask desc="Implement a minimal GraphQL API for managing the cartoon database." status="finished" />
                        <ProjectTask desc="Implement a basic authentication mechanism." status="finished" />
                        <ProjectTask desc="Implement the creation of cartoon lists and lists of favourites." status="finished" />
                        <ProjectTask desc="Implement an extensible mock API." status="finished" />
                        <ProjectTask desc="Set up a routable React+Redux application." status="finished" />
                        <ProjectTask desc="Create a page for displaying information about individual cartoons." status="finished" />
                        <ProjectTask desc="Add basic authentication tools to the front-end." status="finished" />
                        <ProjectTask desc="Create a user profile page displaying cartoon list stats." status="finished" />
                        <ProjectTask desc="Create a page for viewing and managing the cartoon list." status="in-progress" />
                        <ProjectTask desc="Implement front-end browsing tools for the database." status="in-progress" />
                        <ProjectTask desc="Implement front-end administrator tools for managing the database" status="finished" />
                        <ProjectTask desc="Add user preferences" status="not-started" />
                        <ProjectTask desc="Implement tools for discovering other users." status="not-started" />
                        <ProjectTask desc="Implement a mechanism for publishing reviews." status="not-started" />
                        <ProjectTask desc="Create a forum." status="not-started" />
                        <ProjectTask desc="Create a way for regular users to make moderated submissions to the DB." status="not-started" />
                        <ProjectTask desc="Implement a process calculating popularity statistics at fixed intervals" status="not-started" />
                        <ProjectTask desc="Come up with more tasks" status="in-progress" />
                    </div>
                </Col>
            </Row>
        </Container>
    );
}