var axios = require('axios');
var crypto = require('crypto')
var uuid = require('uuid-random')

require('dotenv').config();
require('url-search-params-polyfill')

/**
 * Create a new Axios client instance
 * @see https://github.com/mzabriskie/axios#creating-an-instance
 */
const getClient = () => {

    const options = {
        baseURL: process.env.LETTERBOXD_API_BASEURL,
        key: process.env.LETTERBOXD_API_KEY,
        secret: process.env.LETTERBOXD_API_SECRET
    };

    const client = axios.create(options);

    client.interceptors.request.use((config) => {
        const now = new Date()
        const seconds = Math.round(now.getTime() / 1000)
        const params = new URLSearchParams()

        params.append('apikey', options.key)
        params.append('nonce', uuid())
        params.append('timestamp', seconds)

        config.params = params;

        const finalUrl = `${options.baseURL}${config.url}?${config.params.toString()}`

        let saltedString = `${config.method.toUpperCase()}\u0000${finalUrl}\u0000`;

        if (config.data) {
            saltedString += config.data
        }

        const signature = crypto
            .createHmac('sha256', options.secret)
            .update(saltedString)
            .digest('hex')

        params.append('signature', signature)

        config.params = params

        return config
    })

    return client;
};

/**
 * Base HTTP Client
 */
module.exports = {
    // Provide request methods with the default base_url
    get(url, conf = {}) {
        return getClient().get(url, conf)
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    },

    delete(url, conf = {}) {
        return getClient().delete(url, conf)
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    },

    head(url, conf = {}) {
        return getClient().head(url, conf)
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    },

    options(url, conf = {}) {
        return getClient().options(url, conf)
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    },

    post(url, data = {}, conf = {}) {
        return getClient().post(url, data, conf)
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    },

    put(url, data = {}, conf = {}) {
        return getClient().put(url, data, conf)
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    },

    patch(url, data = {}, conf = {}) {
        return getClient().patch(url, data, conf)
            .then(response => Promise.resolve(response))
            .catch(error => Promise.reject(error));
    },
};