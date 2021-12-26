'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

import { v4 as uuidv4 } from 'uuid';

module.exports = {
    lifecycles: {
        beforeCreate(data) {
            if (!data.uid) {
                data.uid = uuidv4();
            }
        }
    }
};
