'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

const axios = require('axios');

module.exports = {
    lifecycles: {
        async beforeCreate(data) {
            const response = await axios('https://baconipsum.com/api/?type=meat-and-filler&sentences=2&start-with-lorem=1&format=text')
            const text = response.data;
            data.body = text;
        },
    }
};
