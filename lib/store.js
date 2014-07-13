/**
 * Testmatic - Data layer implementation
 */

/**
 * Data fields of a test and how they are stored:
 *
 * 1. Group name. Directory name or file name.
 * 2. Hash. File name.
 * 3. Conditions. File content.
 * 4. Result. File content.
 * 5. Timestamp. File last-modified time.
 * 6. Changes.
 * 7. Importance. Specified in the function call, not stored.
 * 8. Type. Singular or plural. Specified in the function call, not stored.
 */

var mkdirp = require('mkdirp');

module.exports = function(baseDir) {
    // Make sure the specified `baseDir` exists
    mkdirp.sync(baseDir);

    function getAllStaticGroups() {

    }

    function getAllDynamicGroups() {

    }

    function getStaticTest(name, id) {

    }

    function getDynamicTest(name, cond) {

    }

    function getAllDynamicTestsInGroup(name) {

    }

    function storeStaticTest(name, id, res) {

    }

    function storeDynamicTest(name, cond, res) {

    }

    function overwriteAllDynamicTestsInGroup(name, res) {

    }

    return {
        getAllStaticGroups: getAllStaticGroups,
        getAllDynamicGroups: getAllDynamicGroups,
        getStaticTest: getStaticTest,
        getDynamicTest: getDynamicTest,
        getAllDynamicTestsInGroup: getAllDynamicTestsInGroup,
        storeStaticTest: storeStaticTest,
        storeDynamicTest: storeDynamicTest,
        overwriteAllDynamicTestsInGroup: overwriteAllDynamicTestsInGroup
    };
};
