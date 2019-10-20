const path = require('path');

String.prototype.hashCode = function () {
    let h = 0;
    if ( this.length === 0 ) {
        return h;
    }
    for ( let i = 0; i < this.length; i++ ) {
        h = Math.imul( 31, h ) + this.charCodeAt( i ) | 0;
    }
    return h;
}

String.prototype.replaceAll = function (target, replacement) {
    return this.split(target).join(replacement);
}

const isChildOf = ( child, parent ) => {
    if ( child === parent ) return false
    const parentTokens = parent.split( path.sep ).filter( i => i.length )
    return parentTokens.every( ( t, i ) => child.split( path.sep )[ i ] === t )
}

module.exports = {
    isChildOf
}