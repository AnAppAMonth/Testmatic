/**
 * Entry point of Testmatic.
 *
 * @module Testmatic
 */

/**
 * How are conditions and the result of a dynamic test determined?
 *
 * When a wrapped function is called, the default is to use the passed-in args
 * as the conditions, and the return value of the function as the result.
 * However, all these are configurable (by providing options to the
 * `wrapFunction()` call).
 *
 * If `opt.ignoreArgs` is specified, it should be an array, and if an element is
 * truthy, it means the corresponding positional argument shouldn't be included
 * in the conditions.
 *
 * If `opt.result` is specified and is a function, it's called after calling the
 * wrapped function and its return value is used as the result, instead of the
 * return value of the wrapped function.
 */

/**
 * How are the conditions of a dynamic test used?
 * 1. Hashed to decide whether two tests have the same conditions.
 * 2. Recorded to be used when rerunning the test.
 *
 * So these are the purposes to use `ignoreArgs` above to config the conditions.
 */

/**
 * How is a dynamic test's running context recreated to rerun the test as the
 * result of a `runTestsInGroup()` call?
 *
 * Currently we only support functions that don't rely on external global or
 * closure variables. The function's running context must be restricted to its
 * arguments.
 *
 * For functions that use external variables, you just need to pass the
 * variables in as arguments.
 *
 * Normally the arguments recorded when the test was created are used, but the
 * user can override these.
 *
 * If `opt.args` is specified (in a `runTestsInGroup()` call), it should be an
 * array, and if an element is defined, it's used as the corresponding
 * positional argument instead of the recorded one. Additionally, if the element
 * is a function whose name is `__receiver__`, then the function is called with
 * the recorded argument passed in, and the return value is used as the argument.
 *
 * Obviously, if an argument was ignored (listed in `ignoreArgs`) when the test
 * was created, it should be provided here.
 */


module.exports = function(baseDir, enabled) {

    // Initialize everything
    var store;
    if (enabled) {
        store = require('./lib/store')(baseDir);
    }

    // The first call creates a static test, subsequent calls evaluate the test,
    // and fail if the given result doesn't match the stored one.
    function unitTest(name, id, result, opt) {
        if (enabled) {
            store.storeStaticTest(name, id, result);
        }
    }

    // Wraps a function, so that whenever this function is called, a test is
    // created if it's not created already.
    function wrapFunction(name, func, opt) {
        if (enabled) {

        }
    }

    // Runs all tests in a dynamic group using the given function. This should
    // be the same function wrapped using `wrapFunction()` to create this
    // dynamic group.
    // Note that we currently don't do the checkings, so the user is solely
    // responsible
    function runTestsInGroup(name, opt) {
        if (enabled) {

        }
    }

    return {
        unitTest: unitTest,
        wrapFunction: wrapFunction,
        runTestsInGroup: runTestsInGroup
    };
};
