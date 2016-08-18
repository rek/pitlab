/**
 * routes/index.js
 * Index of route handlers for PitLab
 *
 * (C) Ensequence 2013
 */

// ### Dependencies
var log = require('book');

// ### Exports
module.exports = function (app, models) {

    // ### POST /storyupdate/:repoPath
    // Updates gitlab repo identified by `repoPath` according the event from pivotal
    app.post(/^\/storyupdate(?:(?:\/(.*))?\/?)?/, function storyupdate (req, res) {
        // Check params
        if (!req.params || !req.params.length || req.params[0] === undefined) {
            return res.send(400, new models.PitlabError('Missing "repoPath" parameter'));
        }

        // Check for update data
        if (!req.body || !req.body.activity) {
            return res.send(400, new models.PitlabError('Invalid body'));
        }

        // Pull out repo path & activity
        var repoPath = req.params[0],
            activity = req.body.activity;

        console.log('Checking story:', activity.stories.story.name);
        console.log('Orignal repo:', repoPath);

        function updateRepo (title) {
            var match = /\[(\w)\]/.exec(title)
            // console.log('match', match);

            if (match && match[1] && conf.repo_map[match[1]]) {
                return conf.repo_map[match[1]]
            } else {
                return repoPath
            }
        }

        if (conf.repo_map) {
            repoPath = updateRepo(activity.stories.story.name)
        }

        console.log('Processed repo:', repoPath);

        // Handle event
        models.pivotal.handle(repoPath, activity, function (err, result) {
            if (err) res.send(400, err);
            else res.send(200);
        });

    });
};