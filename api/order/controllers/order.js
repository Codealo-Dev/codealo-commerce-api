'use strict';

const { sanitizeEntity } = require("strapi-utils/lib");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async find(ctx) {
        let entities;
        const { user } = ctx.state;
        const { query } = ctx.query;

        query.customer = user.id;

        if (ctx.query._q) {
            entities = await strapi.services.order.search(ctx.query);
        } else {
            entities = await strapi.services.order.find(ctx.query);
        }

        return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.order }));
    },
    /**
     * Create a record.
     *
     * @return {Object}
     */

    async create(ctx) {
        const { user } = ctx.state;
        const { body } = ctx.request;
        body.customer = user;

        let entity;
        if (ctx.is('multipart')) {
            const { data, files } = parseMultipartData(ctx);
            entity = await strapi.services.order.create(data, { files });
        } else {
            entity = await strapi.services.order.create(ctx.request.body);
        }
        return sanitizeEntity(entity, { model: strapi.models.order });
    },
    async cancel(ctx) {
        const { user } = ctx.state;
        const { id } = ctx.params;

        let entity = await strapi.services.order.findOne(id);
        ctx.assert(entity, 404, 'Order not found');
        ctx.assert(entity.customer.id === user.id, 403, 'You cannot perform this action');

        let entity = await strapi.services.order.update({ id: entity.id }, { 'cancelled': true });
        return sanitizeEntity(entity, { model: strapi.models.order });
    }
};
