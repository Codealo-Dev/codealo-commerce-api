'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */

const { isDraft } = require('strapi-utils').contentTypes;

module.exports = {
    /**
   * Promise to add record
   *
   * @return {Promise}
   */

    async create(data, { files } = {}) {
        const validData = await strapi.entityValidator.validateEntityCreation(
            strapi.models.order,
            data,
            { isDraft: isDraft(data, strapi.models.order) }
        );

        const entry = await strapi.query('order').create(validData);

        if (files) {
            // automatically uploads the files based on the entry and the model
            await strapi.entityService.uploadFiles(entry, files, { model: 'order' });
            return this.findOne({ id: entry.id });
        }

        return entry;
    },
};
