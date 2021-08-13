import casual from 'casual';
import { MockList } from 'apollo-server-express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const typeDefs = fs.readFileSync(
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'schema.graphql'), { encoding: 'utf-8' });

function uniqueIdGeneratorFactory() {
    let n = 0;
    return () => {
        n++;
        return n;
    };
}
const uniqueIdgen = uniqueIdGeneratorFactory();
let loggedIn = false;

const mocks = {
    Mutation: () => ({
        login: () => {
            loggedIn = true;
            return { success: true };
        },
        logout: () => {
            loggedIn = false;
            return { success: true };
        }
    }),
    Query: () => ({
        viewer: () => {
            if (loggedIn) {
                return {
                    id: uniqueIdgen,
                    name: () => casual.username,
                    avatar: () => 'https://s4.anilist.co/file/anilistcdn/user/avatar/large/b413485-SF0PIng7AKm1.png'
                }
            }
            return null;
        }
    }),
    Cartoon: () => ({
        id: uniqueIdgen,
        title: () => casual.title,
        description: () => casual.sentences(10),
        year: () => casual.year,
        seasons: () => new MockList([3, 6]),
        duration: () => casual.integer(20, 40),
        episodes: (parent, args, context, info) => {
            if (info.path.prev.key === 'seasonCartoon') return casual.integer(10, 15);
            return casual.integer(50, 100);
        },
        genres: () => ['ADVENTURE', 'COMEDY'],
        countryOfOrigin: () => ['UNITED_STATES', 'CANADA'],
        studios: () => [casual.company_name, casual.company_name],
        coverImage: () => 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21701-MHK32AXcplLw.jpg',
        bannerImage: () => 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/21701-zZxwVu9VbrzU.jpg',
        synonyms: () => [casual.title, casual.title],
        related: () => new MockList([3, 5]),
        lastUpdated: () => casual.date,
        popularity: () => casual.integer(0, 1000),
        favourites: () => casual.integer(0, 100),
        avgScore: () => casual.integer(10, 100),
        isFavourite: () => loggedIn ? casual.boolean : null
    }),
    CartoonSeason: () => ({
        seasonNumber: (parent, args, context, info) => info.path.prev.key + 1
    }),
    FuzzyDate: () => ({
        year: () => casual.year,
        month: () => casual.month_number,
        day: () => casual.day_of_month
    }),
    User: () => ({
        id: uniqueIdgen,
        name: () => casual.username,
        avatar: () => 'https://s4.anilist.co/file/anilistcdn/user/avatar/large/b413485-SF0PIng7AKm1.png',
        bannerImage: () => 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/104459-5SsUaCzOb3HC.jpg',
        favourites: () => new MockList([5, 10])
    }),
    CartoonList: () => ({
        entries: () => new MockList([50, 100])
    }),
    CartoonListEntry: () => ({
        episodesSeen: () => casual.integer(0, 50),
        score: () => casual.integer(1, 100),
        startedWatching: () => casual.date,
        finishedWatching: () => casual.date,
        timesRewatched: () => 0,
        notes: () => ''
    }),
    CartoonsPage: () => ({
        items: () => new MockList(20)
    }),
    PageInfo: () => ({
        hasNextPage: () => true
    }),
    UserStats: () => ({
        totalCartoons: () => 500,
        totalEpisodes: () => 5000,
        totalMinutes: () => 111210,
        avgScore: () => 66.6,
        watching: () => 30,
        completed: () => 210,
        paused: () => 10,
        dropped: () => 50,
        planning: () => 200
    })
};

export { typeDefs, mocks };