export async function makeGqlQuery(query, variables) {
    const response = await fetch('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query,
            variables
        })
    });
    const respJson = await response.json();
    if (respJson.errors) {
        throw new Error(respJson.errors[0].message);
    }
    return respJson.data;
}

export const capitalize = word => word[0].toUpperCase() + word.slice(1).toLowerCase();
export const enumFormat = f => f && f.split('_').map(capitalize).join(' ');
export const enumFormatShort = f => (f.match(/.*_SERIES$/) ? 'Series' : capitalize(f));

export const genres = [
    'ACTION',
    'ADVENTURE',
    'COMEDY',
    'CRIME',
    'DRAMA',
    'FANTASY',
    'HORROR',
    'MUSIC',
    'MYSTERY',
    'ROMANCE',
    'SCI_FI',
    'THRILLER',
];
export const formats = [
    'SINGLE_SEASON_SERIES',
    'MULTI_SEASON_SERIES',
    'SEASON',
    'MOVIE',
    'SHORT',
    'SPECIAL',
];
export const statuses = [
    'NOT_YET_RELEASED',
    'RELEASING',
    'HIATUS',
    'CANCELLED',
    'FINISHED'
];
export const reltypes = [
    'PREQUEL',
    'SEQUEL',
    'PARENT',
    'SIDE_STORY',
    'SPIN_OFF',
    'ALTERNATIVE'
];
export const countries = [
    'UNITED_STATES',
    'UNITED_KINGDOM',
    'CANADA'
];
export const entryStatuses = [
    'WATCHING',
    'REWATCHING',
    'COMPLETED',
    'PAUSED',
    'DROPPED',
    'PLANNING'
];