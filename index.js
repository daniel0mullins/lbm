const Git = require('nodegit');
const { argv } = require('yargs'); 
const {
  askQuestion,
  confirmDeleteChoices,
  evaluateAndExit, 
  filterRefs, 
  getReferenceNames, 
  parseBranchesToDelete, 
  printChoices,
  printToConsole
} = require('./utils');

const { WEB_HOME } = process.env;

evaluateAndExit(!WEB_HOME, 'You must provide WEB_HOME in order to use this util!', 1);

const localRefs = [];
const delRefs = [];

let repository;

Git.Repository.open(WEB_HOME).then(repo => {
    repository = repo;
    return getReferenceNames(repo, Git.Reference.TYPE.ALL);
}).then(refs => {
    return filterRefs(refs);
}).then(localRefArr => {
    localRefs.push(...printChoices(localRefArr));
    return askQuestion('Enter a comma-delimited list of the branch numbers you want to delete: ');
}).then(delString => {
    evaluateAndExit(!delString || !delString.length, 'You didn\'t enter any branches to delete, exiting...');

    delRefs.push(...confirmDeleteChoices(
        parseBranchesToDelete(delString), localRefs)
    );

    return askQuestion('Is that right? [y/N] ');
}).then(affirmative => {
    const deletePromises = [];
    evaluateAndExit(!affirmative || !affirmative.length || affirmative.trim().toLowerCase() === 'n', 'Will not delete, exiting...');
    
    if(affirmative.trim().toLowerCase() === 'y') {
        evaluateAndExit(argv.dryRun, 'Dry run option enabled, exiting...');

        printToConsole('info', 'Deleting...');

        delRefs.forEach(delRef => {
            deletePromises.push(Git.Reference.lookup(repository, delRef).then(reference => {
                Git.Branch.delete(reference);
            }));
        });
    }
    return Promise.all(deletePromises);
}).then(() => {
  printToConsole('info', 'All done!');
}).catch(err => {
  printToConsole('error', 'There seems to have been an error!', err);
});
