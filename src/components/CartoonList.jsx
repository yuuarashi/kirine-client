import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH, faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import AddCartoonModal from './AddCartoonModal.jsx';
import { fetchCartoonListQuery } from '../api/queries.js';
import { editListEntryMutation } from '../api/mutations.js';
import { showAlert } from '../reducers/alertReducer.js';
import { enumFormat, enumFormatShort } from '../api/utils.js';

import './css/CartoonList.css';

function epsBreakdown(total, seasons) {
    let covered = 0;
    const breakdown = [];
    for (let s of seasons) {
        if (s == null) {
            breakdown.push(total - covered);
            covered = total;
        }
        else if (covered === total) {
            breakdown.push(0);
        }
        else {
            if (covered + s > total) {
                breakdown.push(total - covered);
                covered = total;
            }
            else {
                breakdown.push(s);
                covered += s;
            }
        }
    }
    return breakdown;
}

function CartoonSeasons(props) {
    const seasons = props.entry.cartoon.seasons;
    const epsSeenBySeason = epsBreakdown(props.entry.episodesSeen, seasons.map(s => s.seasonCartoon.episodes));
    const seasonEntries = seasons.map(s => (
        (epsSeenBySeason[s.seasonNumber - 1] > 0) && (
            <div key={s.seasonCartoon.id} className="season-entry">
                <div className="entry-image">
                    <img src={s.seasonCartoon.coverImage} />
                </div>
                <div className="entry-title">
                    <Link className="entry-title-link" to={`/cartoon/${s.seasonCartoon.id}`}>
                        {s.seasonCartoon.title}
                    </Link>
                </div>
                <div className="entry-progress">
                    {epsSeenBySeason[s.seasonNumber - 1]}/{s.seasonCartoon.episodes}
                </div>
            </div>
        )
    ));

    return (
        <div className="cartoon-seasons">
            {seasonEntries}
        </div>
    );
}

function ListEntry(props) {
    const hasSeasons = props.entry.cartoon.format === 'MULTI_SEASON_SERIES';
    const [showSeasons, setShowSeasons] = useState(false);
    const toggleShowSeasons = () => hasSeasons && setShowSeasons(!showSeasons);
    const releasing = props.entry.cartoon.status === 'RELEASING';
    const notReleased = props.entry.cartoon.status === 'NOT_YET_RELEASED';

    return (
        <React.Fragment>
        <div className="cartoon-list-entry">
            <div className="entry-image">
                <div style={{ width: '20px', textAlign: 'center', lineHeight: '60px' }} onClick={toggleShowSeasons}>
                    {hasSeasons && !showSeasons && <FontAwesomeIcon icon={faAngleRight} />}
                    {hasSeasons && showSeasons && <FontAwesomeIcon icon={faAngleDown} />}
                </div>
                <div style={{position: 'relative'}}>
                    <img src={props.entry.cartoon.coverImage} />
                    <div className="show-modal-button" onClick={props.showModal}>
                        <FontAwesomeIcon icon={faEllipsisH} />
                    </div>
                </div>
            </div>
            <div className="entry-title">
                <Link className="entry-title-link" to={`/cartoon/${props.entry.cartoon.id}`}>
                    {props.entry.cartoon.title}
                </Link>
                {releasing && <div className="entry-status releasing"></div>}
                {notReleased && <div className="entry-status not-released"></div>}
            </div>
            <div className="entry-score">{props.entry.score}</div>
            <div className="entry-progress">
                {props.entry.episodesSeen || '-'}/{props.entry.cartoon.episodes || '-'}
                <span className="episode-increment-button" onClick={props.incrementHandler}>+</span>
            </div>
            <div className="entry-format">{enumFormatShort(props.entry.cartoon.format)}</div>
        </div>
        {showSeasons && <CartoonSeasons entry={props.entry} />}
        </React.Fragment>
    );
}

function EntryList(props) {
    const listEntries = props.entries.map(entry => (
        <ListEntry
            key={entry.cartoon.id}
            entry={entry}
            showModal={() => props.showModal(entry.cartoon.id)}
            incrementHandler={() => props.incrementHandler(entry.cartoon.id)}/>
    ));

    return (
        <div className="cartoon-list">
            <div className="cartoon-list-header">
                <div className="entry-image-header"></div>
                <div className="entry-title">Title</div>
                <div className="entry-score">Score</div>
                <div className="entry-progress">Progress</div>
                <div className="entry-format">Format</div>
            </div>
            {listEntries}
        </div>
    );
}

class CartoonList extends React.Component {
    static propTypes = {
        username: PropTypes.string,
        dispatch: PropTypes.func.isRequired
    };

    constructor() {
        super();
        this.state = {
            listEntries: [],
            showModal: false,
            modalCartoonId: null
        };
        this.filteredEntries = {};

        this.showModalHandler = this.showModalHandler.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.updateListEntries = this.updateListEntries.bind(this);
        this.incrementEpisodeCount = this.incrementEpisodeCount.bind(this);
    }

    async updateListEntries() {
        if (this.props.username) {
            try {
                const data = await fetchCartoonListQuery(this.props.username);
                this.setState({
                    listEntries: data.User.cartoonList.entries
                });
            }
            catch (err) {
                this.props.dispatch(showAlert(err.message, 'danger'));
            }
        }
    }

    async componentDidMount() {
        await this.updateListEntries();
    }

    async componentDidUpdate(prevProps) {
        if (this.props.username !== prevProps.username) {
            await this.updateListEntries();
        }
    }

    applyAllFilters() {
        const sortFunction = (a, b) => a.cartoon.title.localeCompare(b.cartoon.title);

        this.filteredEntries = {
            watching: this.state.listEntries
                .filter(e => e.status === 'WATCHING')
                .sort(sortFunction),
            completed: this.state.listEntries
                .filter(e => e.status === 'COMPLETED' || e.status === 'REWATCHING')
                .sort(sortFunction),
            paused: this.state.listEntries
                .filter(e => e.status === 'PAUSED')
                .sort(sortFunction),
            dropped: this.state.listEntries
                .filter(e => e.status === 'DROPPED')
                .sort(sortFunction),
            planning: this.state.listEntries
                .filter(e => e.status === 'PLANNING')
                .sort(sortFunction)
        };
    }

    showModalHandler(cartoonId) {
        this.setState({
            showModal: true,
            modalCartoonId: cartoonId
        });
    }

    hideModal() {
        this.setState({
            showModal: false
        });
    }

    async incrementEpisodeCount(cartoonId) {
        try {
            const newEntries = await Promise.all(this.state.listEntries.map(async entry => {
                if (entry.cartoon.id === cartoonId && (entry.episodesSeen < entry.cartoon.episodes || !entry.cartoon.episodes)) {
                    await editListEntryMutation({
                        cartoonId,
                        episodesSeen: entry.episodesSeen + 1
                    });
                    entry.episodesSeen++;
                }
                return entry;
            }));
            this.setState({
                listEntries: newEntries
            });
        }
        catch (err) {
            this.props.dispatch(showAlert(err.message, 'danger'));
        }
    }

    render() {
        this.applyAllFilters();

        const entryLists = Object.keys(this.filteredEntries).map(key =>
            this.filteredEntries[key].length === 0 ? null : (
                <React.Fragment key={key}>
                    <h1 className="entry-list-category">{enumFormat(key)}</h1>
                    <EntryList
                        entries={this.filteredEntries[key]}
                        showModal={this.showModalHandler}
                        incrementHandler={this.incrementEpisodeCount} />
                </React.Fragment>
            )
        );

        return (
            <Container>
                {entryLists}
                <AddCartoonModal
                    cartoonId={this.state.modalCartoonId}
                    show={this.state.showModal}
                    onHide={this.hideModal}
                    runIfSubmitted={this.updateListEntries} />
            </Container>
        );
    }
}

export default connect()(CartoonList);