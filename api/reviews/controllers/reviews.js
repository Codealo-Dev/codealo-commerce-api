'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { sanitizeEntity } = require('strapi-utils');

module.exports = {
    async create(ctx) {
        const { user } = ctx.state;
        const data = ctx.request.body;
        let entity;
        let hasReviewed = await strapi.services.reviews.findOne({
            'customer.id': user.id,
            'product.id': data.product
        });

        if (hasReviewed) {
            ctx.response.statusCode = 404;
            return ctx.response.send({
                error: true,
                message: "User has reviewed product",
                review: sanitizeEntity(hasReviewed, { model: strapi.models.reviews })
            });
        }

        let orders = await strapi.services.order.find({ 'customer': user.id }, ['products']);
        console.log(orders[0].products, data);
        let hasPurchased = orders.some((o) => o.products.some(p => p.product.id == data.product));
        data.verifiedBuyer = Boolean(hasPurchased);

        data.customer = user.id;

        entity = await strapi.services.reviews.create(data);
        return sanitizeEntity(entity, { model: strapi.models.reviews });
    }

};
