import { makeGqlQuery } from './utils.js';

export function toggleFavMutation(currentFav, cartoonId) {
    const query = !currentFav ?
        `mutation($cartoonId: String!) {
            addCartoonToFavourites(cartoonId: $cartoonId) {
                success
            }
        }`
        :
        `mutation($cartoonId: String!) {
            removeCartoonFromFavourites(cartoonId: $cartoonId) {
                success
            }
        }`;
    const variables = { cartoonId };

    return makeGqlQuery(query, variables);
}

export function logInMutation(name, password) {
    const query = `
        mutation($name: String!, $password: String!) {
            login(name: $name, password: $password) {
                success
            }
        }`;
    const variables = { name, password };
    return makeGqlQuery(query, variables);
}

export function logOutMutation() {
    const query = `
    mutation {
        logout {
            success
        }
    }`;
    return makeGqlQuery(query, null);
}

export function signUpMutation(name, password) {
    const query = `
        mutation($name: String!, $password: String!) {
            addUser(name: $name, password: $password) {
                name
            }
        }`;
    const variables = { name, password };
    return makeGqlQuery(query, variables);
}

export function editListEntryMutation(params) {
    const query = `
        mutation(
            $cartoonId: String!,
            $status: CartoonEntryStatus,
            $episodesSeen: Int,
            $score: Int,
            $startedWatching: Date,
            $finishedWatching: Date,
            $timesRewatched: Int,
            $notes: String
        ) {
            addOrUpdateCartoonListEntry(
                cartoonId: $cartoonId,
                status: $status,
                episodesSeen: $episodesSeen,
                score: $score,
                startedWatching: $startedWatching,
                finishedWatching: $finishedWatching,
                timesRewatched: $timesRewatched,
                notes: $notes
            ) {
                status,
                episodesSeen,
                score,
                startedWatching,
                finishedWatching,
                timesRewatched,
                notes
            }
        }`;
    return makeGqlQuery(query, params);
}

export function removeListEntryMutation(cartoonId) {
    const query = `
        mutation($cartoonId: String!) {
            removeCartoonListEntry(cartoonId: $cartoonId) {
                success
            }
        }`;
    const variables = { cartoonId };
    return makeGqlQuery(query, variables);
}

export function addCartoonMutation(params) {
    const query = `
        mutation (
            $title: String!,
            $format: CartoonFormat!,
            $status: CartoonStatus!,
            $description: String,
            $startDate: String,
            $endDate: String,
            $year: Int,
            $duration: Int,
            $episodes: Int,
            $genres: [CartoonGenre],
            $countryOfOrigin: [Country],
            $studios: [String],
            $coverImage: String,
            $bannerImage: String,
            $synonyms: [String],
            $mainSeries: String,
            $seasons: [CartoonSeasonInput],
            $related: [CartoonConnectionInput]
        ) {
            addCartoon(
                title: $title,
                format: $format,
                status: $status,
                description: $description,
                startDate: $startDate,
                endDate: $endDate,
                year: $year,
                duration: $duration,
                episodes: $episodes,
                genres: $genres,
                countryOfOrigin: $countryOfOrigin,
                studios: $studios,
                coverImage: $coverImage,
                bannerImage: $bannerImage,
                synonyms: $synonyms,
                mainSeries: $mainSeries,
                seasons: $seasons,
                related: $related
            ) {
                id
            }
        }`;
    return makeGqlQuery(query, params);
}

export function updateCartoonMutation(params) {
    const query = `
        mutation (
            $id: String!
            $title: String,
            $format: CartoonFormat,
            $status: CartoonStatus,
            $description: String,
            $startDate: String,
            $endDate: String,
            $year: Int,
            $duration: Int,
            $episodes: Int,
            $genres: [CartoonGenre],
            $countryOfOrigin: [Country],
            $studios: [String],
            $coverImage: String,
            $bannerImage: String,
            $synonyms: [String],
            $mainSeries: String,
            $seasons: [CartoonSeasonInput],
            $related: [CartoonConnectionInput]
        ) {
            updateCartoon(
                id: $id,
                title: $title,
                format: $format,
                status: $status,
                description: $description,
                startDate: $startDate,
                endDate: $endDate,
                year: $year,
                duration: $duration,
                episodes: $episodes,
                genres: $genres,
                countryOfOrigin: $countryOfOrigin,
                studios: $studios,
                coverImage: $coverImage,
                bannerImage: $bannerImage,
                synonyms: $synonyms,
                mainSeries: $mainSeries,
                seasons: $seasons,
                related: $related
            ) {
                id
            }
        }`;
    return makeGqlQuery(query, params);
}