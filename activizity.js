/*! activizity v0.0.0 - MIT license */

;(function (global) {
'use strict';
function moduleDefinition(/*dependency*/) {

// ---------------------------------------------------------------------------

/**
 * @param {}
 * @return {}
 * @api public
 */

function activizity() {
}

/**
 * Expose activizity
 */

return activizity;

// ---------------------------------------------------------------------------

} if (typeof exports === 'object') {
    // node export
    module.exports = moduleDefinition(/*require('dependency')*/);
} else if (typeof define === 'function' && define.amd) {
    // amd anonymous module registration
    define([/*'dependency'*/], moduleDefinition);
} else {
    // browser global
    global.activizity = moduleDefinition(/*global.dependency*/);
}}(this));
