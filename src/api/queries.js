import { makeGqlQuery } from './utils.js';

export function fetchCartoonByIdQuery(id) {
    const query = `
        query($id: String!) {
            Cartoon(id: $id) {
                id
                title
                format
                status
                description
                startDate {
                    year
                    month
                    day
                }
                endDate {
                    year
                    month
                    day
                }
                mainSeries {
                    id
                    status
                    title
                    coverImage
                }
                seasons {
                    seasonNumber
                    seasonCartoon {
                        id
                        status
                        title
                        coverImage
                    }
                }
                year
                duration
                episodes
                genres
                countryOfOrigin
                studios
                coverImage
                bannerImage
                synonyms
                related {
                    relationType
                    relatedCartoon {
                        id
                        title
                        format
                        status
                        coverImage
                    }
                }
                popularity
                favourites
                avgScore
                isFavourite
                userEntry {
                    status
                }
            }
        }`;
    const variables = { id };
    return makeGqlQuery(query, variables);
}

export function fetchViewerQuery() {
    const query = `
        query {
            viewer {
                id
                name
                avatar
            }
        }`;
    return makeGqlQuery(query, null);
}

export function fetchUserByNameQuery(name) {
    const query = `
        query($name: String) {
            User(name: $name) {
                id
                name
                avatar
                bannerImage
                bio
                stats {
                    totalCartoons
                    totalEpisodes
                    totalMinutes
                    avgScore
                    watching
                    completed
                    paused
                    dropped
                    planning
                }
                favourites {
                    id
                    title
                    format
                    year
                    coverImage
                }
            }
        }`;
    const variables = { name };
    return makeGqlQuery(query, variables);
}

export function fetchCartoonListQuery(username) {
    const query = `
        query($username: String) {
            User(name: $username) {
                cartoonList {
                    entries {
                        cartoon {
                            id
                            title
                            format
                            status
                            episodes
                            coverImage
                            seasons {
                                seasonNumber
                                seasonCartoon {
                                    id
                                    title
                                    status
                                    episodes
                                    coverImage
                                }
                            }
                        }
                        status
                        episodesSeen
                        score
                        startedWatching
                        finishedWatching
                        timesRewatched
                        notes
                    }
                }
            }
        }`;
    const variables = { username }
    return makeGqlQuery(query, variables);
}

export function fetchUserEntryForCartoon(cartoonId) {
    const query = `
        query($cartoonId: String!) {
            Cartoon(id: $cartoonId) {
                title
                status
                episodes
                coverImage
                bannerImage
                userEntry {
                    status
                    episodesSeen
                    score
                    startedWatching
                    finishedWatching
                    timesRewatched
                    notes
                }
            }
        }`;
    const variables = { cartoonId };
    return makeGqlQuery(query, variables);
}

export function fetchCartoonsPageQuery(params) {
    const query=`
        query (
            $pageNum: Int!,
            $perPage: Int!,
            $search: String,
            $year: Int,
            $formats: [CartoonFormat],
            $statuses: [CartoonStatus],
            $genres: [CartoonGenre],
            $sort: CartoonSort
        ) {
            cartoons (
                pageNum: $pageNum,
                perPage: $perPage,
                search: $search,
                year: $year,
                formats: $formats,
                statuses: $statuses,
                genres: $genres,
                sort: $sort
            ) {
                pageInfo {
                    currentPage
                    hasNextPage
                }
                items {
                    id
                    title
                    status
                    format
                    year
                    coverImage
                    description
                    genres
                    episodes
                    studios
                    avgScore
                }
            }
        }`;
    return makeGqlQuery(query, params);
}

export function fetchCartoonByIdEditQuery(id) {
    const query = `
        query($id: String!) {
            Cartoon(id: $id) {
                id
                title
                format
                status
                description
                startDate {
                    year
                    month
                    day
                }
                endDate {
                    year
                    month
                    day
                }
                mainSeries {
                    id
                    title
                    year
                    coverImage
                }
                seasons {
                    seasonNumber
                    seasonCartoon {
                        id
                        title
                        year
                        coverImage
                    }
                }
                year
                duration
                episodes
                genres
                countryOfOrigin
                studios
                coverImage
                bannerImage
                synonyms
                related {
                    relationType
                    relatedCartoon {
                        id
                        title
                        format
                        year
                        coverImage
                    }
                }
            }
        }`;
    const variables = { id };
    return makeGqlQuery(query, variables);
}

export function fetchBasicCartoonInfoQuery(cartoonId) {
    const query = `
        query($cartoonId: String!) {
            Cartoon(id: $cartoonId) {
                id
                title
                format
                year
                coverImage
            }
        }`;
    const variables = { cartoonId };
    return makeGqlQuery(query, variables);
}