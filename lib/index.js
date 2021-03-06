/**
 * lib/index.js
 * Batch requires all models
 *
 * (C) Ensequence 2013
 */

// ### Exports
module.exports = function (config) {
    return {
        gitlab: require('./gitlab')(config),
        pivotal: require('./pivotal')(config),
        PitlabError: require('./pitlab-error')
    };
};