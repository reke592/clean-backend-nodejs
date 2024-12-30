const COMMAND_OPTIONS = () => ({
  /**
   * the execution context is an object, which will be passed to the command handler.
   * In this object, you can store any data that you want to pass to the command handler.
   *
   * e.g. database query results, when calling a command that needs to access the database inside a loop statement.
   */
  context: {},
});

const QUERY_OPTIONS = () => ({
  /**
   * the limit of the query result.
   */
  limit: undefined,
  /**
   * a function to map the query result before returning it.
   * @param {*} result
   * @returns
   */
  mapper: (result) => result,
});

module.exports = {
  get COMMAND_OPTIONS() {
    return COMMAND_OPTIONS();
  },
  get QUERY_OPTIONS() {
    return QUERY_OPTIONS();
  },
};
