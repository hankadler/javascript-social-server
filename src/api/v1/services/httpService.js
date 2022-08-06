import _ from "lodash";
import FieldError from "../errors/FieldError";

/**
 * Safely returns object with specified keys.
 *
 * @param {Object} obj - Typically an HTTP request params or body object.
 * @param {...string} keys - The desired object keys.
 * @returns {Promise<{Object}>}
 * @throws {FieldError} - If any of the keys is not present.
 */
const getOrDie = async (obj, ...keys) => {
  const values = {};

  keys.forEach((key) => {
    if (!obj || !(
      key in obj
    )) {
      throw new FieldError(`Request object is missing '${key}' key!`);
    }
    values[key] = obj[key];
  });

  return values;
};

/**
 * Checks if request query exists.
 *
 * @param {Request} req - The HTTP request object.
 * @returns {boolean} - true if it does, false if it doesn't.
 */
const hasQuery = (req) => Boolean(Object.keys(req.query).length);

// todo: rename keys and values into something more sensible like query & nonQuery
/**
 * Separate query into keys and values.
 *
 * @param {Request} req - The HTTP request object.
 * @returns {Promise<{queryKeys: {}, queryValues: {}}|{}>}
 */
const parseQuery = async (req) => {
  if (!hasQuery(req)) return {};

  const keys = [
    "id", "limit", "select", "sortBy", "skip", "where", "lt", "lte", "equals", "gte", "gt"
  ];

  const queryKeys = {};
  const queryValues = {};

  Object.keys(req.query).forEach((k) => {
    if (keys.includes(k)) {
      queryKeys[k] = req.query[k];
    } else {
      queryValues[k] = req.query[k];
    }
  });

  return { queryKeys, queryValues };
};

/**
 * Separates query values into further key-value pairs.
 *
 * Example:
 *     "field1.value1,field2.value2" -> { field1: "value1", field2: "value2" }
 *
 * @param {string} queryValues - The query values.
 * @returns {Promise<Object>}
 */
const parseQueryValues = async (queryValues) => {
  const result = {};

  const dotPairs = queryValues.split(",");

  dotPairs.forEach((dotPair) => {
    const [k, v] = dotPair.split(".");
    result[k] = v;
  });

  return result;
};

/**
 * Paginates array according to skip and limit values given in query.
 *
 * @param {Array} arr - The items to paginate.
 * @param {Object} queryKeys - The request query options.
 * @param {number} queryKeys.skip - The number of items to skip.
 * @param {number} queryKeys.limit - The number of items to return.
 * @returns {Promise<Array>} - The paginated items.
 */
const paginate = async (arr, queryKeys) => {
  if (!queryKeys) return arr;

  const skip = Number(queryKeys.skip) || 0;
  const limit = Number(queryKeys.limit) || 0;

  return arr.slice(skip, limit ? skip + limit : undefined);
};

/**
 * Sorts document arrays if queryKeys contains the 'sortBy' directive.
 *
 * @param  {Array} arr - The document array.
 * @param {Object} queryKeys - The query keys.
 * @returns {Array} - The sorted array.
 */
const sort = async (arr, queryKeys) => {
  if (!queryKeys) return arr;

  const { sortBy } = queryKeys;
  if (!sortBy) return arr;

  const result = [...arr];
  const sortOpts = await parseQueryValues(sortBy);
  const ascending = ["ascending", "asc", "1"];
  const descending = ["descending", "desc", "-1"];

  Object.entries(sortOpts).forEach(([key, sortOpt]) => {
    if (ascending.includes(sortOpt)) {
      result.sort((a, b) => {
        if (a[key] < b[key]) return -1;
        if (a[key] > b[key]) return 1;
        return 0;
      });
    }

    if (descending.includes(sortOpt)) {
      result.sort((a, b) => {
        if (a[key] > b[key]) return -1;
        if (a[key] < b[key]) return 1;
        return 0;
      });
    }
  });

  return result;
};

/**
 * Picks only the properties given by 'select' from each object in data.
 *
 * Examples:
 *
 *    1. data is an object:
 *      Input
 *        - data = { id: 1, name: "Foo", age: 25 }
 *        - queryKeys = { select: "name,age" }
 *      Output
 *        - { name: "Foo", age: 25 }
 *
 *    2. data is an array of objects:
 *      Input
 *        - data = [{ id: 1, name: "Foo", age: 25 }, { id: 2, name: "Bar", age: 35 }]
 *        - queryKeys = { select: "name,age" }
 *      Output
 *        - [{ name: "Foo", age: 25 }, { name: "Bar", age: 35 }]
 *
 * @param {Object|Array} data
 * @param {Object} queryKeys
 * @returns {Promise<*>}
 */
const pick = async (data, queryKeys) => {
  const { select } = queryKeys;

  if (!select) return data;

  const keys = select.split(",");

  return (data instanceof Array) ? data.map((obj) => _.pick(obj, keys)) : _.pick(data, keys);
};

export { getOrDie, parseQuery, paginate, sort, pick };
