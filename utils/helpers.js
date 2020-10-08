const printToConsole = (method, string, err = null) => {
    // eslint-disable-next-line no-console
    return err ? console[method](string, err) : console[method](string);
};

const getReferenceNames = (repo, refType) => {
    return repo.getReferenceNames(refType);
};

const filterRefs = (refs) => {
    return refs.filter(ref => {
        return ref.startsWith('refs/heads');
    }).filter(ref => ref !== 'refs/heads/master' && ref !== 'refs/heads/release');
};

const printChoices = (localRefArr) => {
    localRefArr.forEach((val, idx) => {
        printToConsole('info', `${idx + 1} - ${val}`)
    });
    return localRefArr;
};

const confirmDeleteChoices = (branchesToDelete, localRefs) => {
    const delRefs = [];
    branchesToDelete.forEach(bnum => {
        printToConsole('info', `${bnum} - ${localRefs[bnum - 1]}`);
        delRefs.push(localRefs[bnum - 1]);
    });

    return delRefs;
};

const evaluateAndExit = (test, exitString, code = 0) => {
    if (test) {
        printToConsole('warn', exitString);
        process.exit(code);
    }
};

const parseBranchesToDelete = (delString) => {
    return delString.split(/,\s?/).map(bnum => parseInt(bnum, 10));
};

module.exports = { 
    confirmDeleteChoices, 
    evaluateAndExit, 
    filterRefs, 
    getReferenceNames, 
    parseBranchesToDelete, 
    printChoices,
    printToConsole
};
