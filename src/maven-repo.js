const path = require( 'path' );
const downloader = require( './downloader' );
const helper = require( './helper' );
const dataDir = path.join( __dirname, '..', 'data' );

const snapshotSuffix = '-SNAPSHOT';

class MavenRepository {

    constructor ( id, url ) {
        this.id = id;
        if ( !url.endsWith( '/' ) )
            url = url + '/';
        this.url = url;
        this.subversionCache = new Map();
    }

    async getArtifactUrl( groupId, artifactId, version, classifier, type ) {
        if ( version.toUpperCase().endsWith( snapshotSuffix ) ) {
            let subversion = await this.getLatestSnapshotSubversion( groupId, artifactId, version );
            return this.getRemoteSnapshotPath( groupId, artifactId, version, subversion, classifier, type );
        } else {
            return this.getRemotePath( groupId, artifactId, version, classifier, type );
        }
    }

    getJavadocUrl( groupId, artifactId, version ) {
        return this.getArtifactUrl( groupId, artifactId, version, 'javadoc', 'jar' );
    }


    async getLatestSnapshotSubversion( groupId, artifactId, version ) {
        let hash = ( groupId + ':' + artifactId + ':' + version ).hashCode();
        let now = Date.now();
        if ( this.subversionCache.has( hash ) ) {
            let cached = this.subversionCache.get( hash );
            if ( cached.timestamp > now ) {
                return cached.subversion;
            }
        }

        let xml = await downloader.readXML( this.getRemoteSnapshotMavenMetadata( groupId, artifactId, version ) );
        let lastObject;
        if ( ( lastObject = xml.metadata ) === undefined ) {
            return null;
        }
        if ( ( lastObject = lastObject.versioning[ 0 ] ) === undefined ) {
            return null;
        }
        if ( ( lastObject = lastObject.snapshot[ 0 ] ) === null ) {
            return null;
        }
        if ( lastObject.timestamp === undefined || lastObject.buildNumber === undefined ) {
            return null;
        }
        let baseVersion = version.substr( 0, version.length - snapshotSuffix.length );
        let timestamp = lastObject.timestamp[ 0 ];
        let buildNumber = lastObject.buildNumber[ 0 ];
        let subversion = baseVersion + '-' + timestamp + '-' + buildNumber;
        this.subversionCache.set( hash, {
            subversion,
            timestamp: now + ( 1000 * 60 * 10 )
        } )
        return subversion;
    }

    getLocalJavadocPath( groupId, artifactId, version ) {
        return path.join( dataDir, 'files', 'docs', this.id, groupId, artifactId, version );
    }

    getRemotePath( groupId, artifactId, version, classifier, type ) {
        return `${this.url}${groupId.replaceAll( '.', '/' )}/${artifactId}/${version}/${artifactId}-${version}${classifier == null ? '' : '-' + classifier}.${type}`;
    }

    getRemoteSnapshotMavenMetadata( groupId, artifactId, version ) {
        return `${this.url}${groupId.replaceAll( '.', '/' )}/${artifactId}/${version}/maven-metadata.xml`;
    }

    getRemoteSnapshotPath( groupId, artifactId, version, snapshotSubversion, classifier, type ) {
        return `${this.url}${groupId.replaceAll( '.', '/' )}/${artifactId}/${version}/${artifactId}-${snapshotSubversion}${classifier == null ? '' : '-' + classifier}.${type}`;
    }
}

module.exports = MavenRepository;