import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import path from 'path';
import { typeDefs, mocks } from './mocks.js'

(async function () {
    const server = new ApolloServer({
        typeDefs,
        mocks
    });
    await server.start();

    const app = express();
    server.applyMiddleware({ app });
    app.use(express.static(path.resolve('dist')));
    app.get('*', (req, res) => res.sendFile(path.resolve('dist', 'index.html')));
    app.listen(4000, () => console.log('Listening on port 4000'));
})();