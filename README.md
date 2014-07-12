Testmatic
===========

Automatic tests as a complement to unit tests.

This module provides the following functionalities:

1. By simply wrapping functions and adding statements in a program, tests can
   be automatically created during normal program runs. Each test has its
   conditions and results recorded in a database, ready for future comparisons.
2. Individual tests (with manually specified conditions and verified results)
   can also be added manually, unit testing style, in the program itself or in
   unit testing code. In other words, this module can be used solely as a helper
   for writing unit tests.
3. When a test is rerun, and there is already a record of this test with the
   same conditions, their results are compared, and a notification is generated
   if they don't match.
4. Test reruns can happen during normal program runs, or you can choose to rerun
   all recorded tests at once as part of a testing setup.    


## Philosophy ##

This module is written to address the author's frustrations in the following
aspects:

1. Untested input combinations. Admit it, manually created unit tests may be
   able to cover every source line, but it can never cover all potentially
   interesting input combinations. Testmatic reduces the chances of regressions
   by greatly expanding the program's test coverage on input combinations.
   What's better, the new input combinations are taken from real life usage.

2. Verifying correctness in real life usage. Unit tests are synthetic, they are
   out of the main program. Traditionally, asserts are used to verify behaviors
   during real life program runs, but there are limits. One of them is
   maintenance. You only want to assert on things that you don't expect to
   change in the program's entire lifetime, because if there is a change, it's a
   huge pain to update these asserts scattered across the codebase. With this
   module, in case of a change, a notification is generated and you can easily
   review and approve (or reject) the change.

3. Asserting a complex result. Traditionally, in unit testing, you execute an
   operation and then assert on its result. If this result is complex (contains
   many new and changed fields), you end up with many assert statements. With
   this module, you take a different approach: the result is present to you for
   verification, and after that stored in the database, to be compared with
   future results on the same inputs. Now this approach isn't without its
   problems: it may be overly specific and easily broken, and sometimes you
   might prefer to have the assert statements in the test code for readability
   reasons. All these are valid concerns, but the power lies in choices.

4. Debugging a logged error. Post-mortem debugging is hard because of the lack
   of data. This module records data with timestamps, which can be used to
   recover variable states right before the error occurred.

All in all, this module is essentially a program running state recorder that
uses the recorded data to help with testing and debugging in various scenarios.


## Tests ##

A test is identified by its (group) name and conditions (a.k.a. inputs). The
name is either specified by the user or deduced from the source code (e.g.
function name).

All tests with the same name (but different conditions) form a **group**.

Conditions are the variable states that are required for the result to occur.
For a mathematical function, these are the arguments of the function, but it may
not be the case for a programming function. Therefore, the user is responsible
for guaranteeing the specified conditions are both correct and complete.

When side effects are at play, e.g., when dealing with an external database, the
same input objects may lead to different results, because data are fetched from
the external database; and reversely, different input objects may lead to the
same result, when difference in the connection object's internal states doesn't
affect the fetched data.

A hash of the combined conditions is stored in the database for performance
reasons, so that we can quickly check whether a test with the same conditions
already exists.

Each test has an `importance` which decides how we deal with it:

1. `high`. This test generates a notification when it's first added to the
           database and whenever its result changes afterwards.
2. `medium`. This test generates a notification whenever its result changes, but
             not when it's first added.
3. `low`. This test generates a notification whenever its result changes when
          the major and minor version of the program hasn't changed. In other
          words, result changes after major or minor version changes are
          silently ignored.

Each test also has a `changes` field, which records how many times the result of
the test has changed due to program changes and bugs. Tests that change more
frequently are considered better tests and are less likely to be deleted to
save space. 


## Running Mode ##

There are three running modes:

1. `Debug`. New and existing notifications are directly presented to the user
            for handling, possibly blocking execution.
2. `Monitor`. New notifications are added to the database but not presented to
              the user. 
3. `Release`. This module isn't loaded at all.


## Notifications ##

Whenever the result of a test changes, its result is updated with the new one,
and both the old and new results are recorded in a new notification entry.

However, if the result changes when the code hasn't changed, this is indicative
of an incorrect specification of conditions, and we should not create more than
one notifications for it. But how do we detect that the code hasn't changed? One
way is to detect the current Git head and diff over it.

The user can approve or reject a notification. In the latter case, the result of
the test is restored to the old value.


## Library Methods ##

The following methods are provided:

1. `addTest(name, cond, res, opt)`. Add a general test.
2. `wrapFunction(name, func, opt)`. Convenience method to create a specific type
                                    of tests. Default to low importance.
3. `addUnitTest(name, res, opt)`. Convenience method to create a specific type
                                  of tests. These tests don't have conditions
                                  specified. Default to high importance.
4. `runTestsInGroup()`. Run tests in a group at once. Currently only supports
                        tests created using `wrapFunction()`.

## Command Line Tool ##

The following commands are supported:

1. `view`. View result(s) of a given test or test group.
2. `inbox`. Check and approve/reject notifications.
3. `export`. Export data from one database.
4. `import`. Import exported data to another database.
5. `silence`. Declare a test or test group's current result(s) stale, so that
              they don't generate notifications when they change.
6. `remove`. Remove the given tests and test groups.

## Future Work ##

1.  Merging databases.

    Every developer has a local database, and every deployment process has a
    local database. How to merge these databases is a great concern.

    We need to be able to share tests, notifications, and user actions on
    notifications between databases.

    Currently we only support a centralized workflow: one node is used to run
    tests and handle notifications, and new tests and notifications from other
    nodes are exported and then imported into the central node.

    We need to support more distributed workflows.

    Going to the cloud could solve this problem.

2.  Use a plain text database.

    Currently we use SQLite, which is convenient but uses a binary file format,
    which makes its diffs useless.

    Switching to a plain text database will not only allow us to generate useful
    diffs between different versions of tests, but it will also make it easier
    to merge databases.

    The idea is to use small JSON files (separate files per test group, and
    maybe multiple files per test group, even separate files per test), so that
    whenever there is an update, we can simply rewrite the whole file. Another
    choice is to use append-only files, but that introduces the complexity of
    periodic compactions, and it also makes it harder to generate sensible
    diffs.
      