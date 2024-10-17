const axios = require('axios');
const tips = require('./lib/tips');
const log = require('./lib/log');

/**
 * Fetches data from a backend API using Axios.
 *
 * @param {Object} ctx - Koa context object (optional)
 * @param {Object} options - Request options
 * @returns {Promise} Promise resolving to API response data
 */
module.exports = (ctx = {}) => (options) => {
  let ip = ctx?.request?.ip || ''; // Get IP from ctx object if available

  // Default data and method
  options.data = options.data || {};
  const method = (options.type || 'POST').toUpperCase();

  let apiConfig = ENV_CONFIG.api[options.api];
  let url = (apiConfig.url || '') + options.url;

  // Set headers
  const headers = {
    'client-ip': ip,
    'User-Agent': ctx.header?.['user-agent'],
  };

  // Add token if provided
  const token = options.token || '';
  if (token) {
    headers.token = token;
  }

  // Merge API specific headers
  headers = Object.assign({}, headers, apiConfig.data || {});
  headers = Object.assign({}, headers, options.headers || {}); // User provided headers

  // Configure request data based on method
  let data;
  if (method === 'GET') {
    data = options.data; // Use query string for GET requests
  } else {
    if (options.isBodyData) {
      data = options.data; // Use JSON data for body
    } else {
      data = options.data; // Use form data for POST/PUT/etc.
    }
  }

  // Record request details
  log.info({
    TYPE: '[REQUEST ACCESS]',
    traceId: ctx.traceId,
    ip,
    method,
    url,
    query: ctx.query || ctx.request.body,
    status: ctx.response?.status,
  });

  return axios({
    method,
    url,
    headers,
    data,
    // Add other Axios options like timeout if needed
  })
    .then((response) => {
      const apiData = response.data;
      let returnData;
      try {
        // Handle different API response structures
        if (typeof apiData.data === 'string') {
          returnData = JSON.parse(apiData.data) || {};
        } else {
          returnData =
            apiData.data || apiData.dataInfo || apiData.result || {};
        }
      } catch (err) {
        log.error({
          TYPE: '[REQUEST ERROR]',
          traceId: ctx.traceId,
          ip,
          method,
          url,
          error: err.message,
        });
        return Promise.reject(tips['ERR_SYSTEM_ERROR']);
      }

      log.info({
        TYPE: '[REQUEST SUCCESS]',
        traceId: ctx.traceId,
        ip,
        method,
        url,
        data: returnData,
      });

      return returnData;
    })
    .catch((error) => {
      log.error({
        TYPE: '[REQUEST ERROR]',
        traceId: ctx.traceId,
        ip,
        method,
        url,
        error: error.message,
      });
      return Promise.reject(tips['ERR_SYSTEM_ERROR']);
    });
};