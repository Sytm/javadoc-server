const http = require( 'http' );
const https = require( 'https' );
const fs = require( 'fs' );

const concat = require( 'concat-stream' );
const xml2js = require( 'xml2js' );
const unzipper = require( 'unzipper' );

function getFileStream( url ) {
    return new Promise( ( resolve, reject ) => {
        let urlObj;
        if ( url instanceof URL ) {
            urlObj = url;
        } else if ( typeof url === 'string' ) {
            urlObj = new URL( url );
        } else {
            reject( new Error( 'Neither a url nor a string' ) );
            return;
        }
        if ( urlObj.protocol === 'http:' ) {
            http.get( urlObj, resolve );
        } else if ( urlObj.protocol === 'https:' ) {
            https.get( urlObj, resolve );
        } else {
            reject( new Error( 'Not a supported protocol' ) );
            return;
        }
    } );
}

function readXML( url ) {
    return new Promise( ( resolve, reject ) => {
        getFileStream( url ).then( response => {
            if ( ( response.statusCode + '' ).charAt( 0 ) != '2' ) {
                reject( 'notfound' );
                return;
            }
            response.pipe( concat( buffer => {
                let xml = buffer.toString( 'utf-8' );
                xml2js.parseStringPromise( xml ).then( resolve ).catch( reject );
            } ) );
        } ).catch( reject );
    } );
}

async function downloadFile( url, destination ) {
    ( await getFileStream( url ) ).pipe( fs.createWriteStream( destination ) );
}

function downloadThenExtractZip( url, destination ) {
    return new Promise( ( resolve, reject ) => {
        getFileStream( url ).then( response => {
            if ( ( response.statusCode + '' ).charAt( 0 ) != '2' ) {
                reject( 'notfound' );
                return;
            }
            response.pipe( unzipper.Extract( {
                path: destination
            } ) ).on( 'close', resolve );
        } ).catch( reject );
    } );
}

module.exports = {
    getFileStream,
    readXML,
    downloadFile,
    downloadThenExtractZip
}