const helper = require('./helper');
const express = require('express');
const path = require('path');
const ms = require('ms');
const { ensureLatestJavadoc, initCleanTask, cleanDocs } = require('./local-doc-manager');
const MavenRepository = require('./maven-repo');

const dataDir = path.join( __dirname, '..', 'data' );
const files = path.join(dataDir, 'files');

var app = express();

var config = require('../data/config.json');

cleanDocs();
initCleanTask(ms(config.snapshotCleanInterval));

var repositories = new Map();

Object.keys(config.repositories).forEach((repoId) => {
    repositories.set(repoId, new MavenRepository(repoId, config.repositories[repoId]));
});

app.use('/docs/:repoId/:groupId/:artifactId/:version/', (req, res, next) => {
    if (!repositories.has(req.params.repoId)) {
        res.header('Content-Type', 'text/html').sendFile(path.join(dataDir, 'static', 'notfound.html'));
        return;
    }
    ensureLatestJavadoc(repositories.get(req.params.repoId), req.params.groupId, req.params.artifactId, req.params.version).then(() => {
        next();
    }).catch(e => {
        if (e === 'notfound') {
            res.status(404).sendFile(path.join(dataDir, 'files', 'notfound.html'));
            return;
        }
        res.status(500).send(e);
    });
});
app.get('/repos', (req, res) => {
    res.status(200).contentType('json').send({
        repos: [
            ...repositories.keys()
        ]
    });
})
app.use('/', express.static(files));

app.listen(config.port);