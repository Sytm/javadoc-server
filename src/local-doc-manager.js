const downloader = require( './downloader' );
const path = require( 'path' );
const fs = require( 'fs' );
const rimraf = require( 'rimraf' );

const dataDir = path.join( __dirname, '..', 'data' );
const docs = path.join( dataDir, 'files', 'docs' );

function ensureLatestJavadoc( repository, groupId, artifactId, version ) {
    return new Promise( ( resolve, reject ) => {
        let localPath = repository.getLocalJavadocPath( groupId, artifactId, version );
        if ( fs.existsSync( localPath ) ) {
            resolve();
            return;
        } else {
            downloadJavadoc( repository, groupId, artifactId, version ).then( resolve ).catch( reject );
        }
    } );
}

const downloads = new Map();

function downloadJavadoc( repository, groupId, artifactId, version ) {
    return new Promise( ( resolve, reject ) => {
        let hash = ( groupId + ':' + artifactId + ':' + version ).hashCode();
        if ( downloads.has( hash ) ) {
            downloads.get( hash ).push( { resolve, reject } ); q
            return;
        }
        downloads.set( hash, [] );
        repository.getJavadocUrl( groupId, artifactId, version ).then( url => {
            let localPath = repository.getLocalJavadocPath( groupId, artifactId, version );
            downloader.downloadThenExtractZip( url, localPath ).then( () => {
                downloads.get( hash ).forEach( e => e.resolve() );
                downloads.delete( hash );
                resolve();
            } ).catch( err => {
                downloads.get( hash ).forEach( e => e.reject( err ) );
                downloads.delete( hash );
                reject( err );
            } );
        } ).catch( reject );
    } );
}

function cleanDocs() {
    rimraf( docs, {
        disableGlob: true
    }, ( err ) => {
        if ( err )
            console.log( err );
    } );
}

function initCleanTask(delay) {
    setTimeout(cleanDocs, delay);
}

module.exports = {
    ensureLatestJavadoc,
    cleanDocs,
    initCleanTask
}