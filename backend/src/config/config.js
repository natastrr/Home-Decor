const config = {
    secret: 'd1UCyUDKC0TiWhDbs6U5QWiez6',
    env: process.env.ENV,
    port: 3000,
    db: {
        dbUrl: 'mongodb://127.0.0.1:27017',
        dbName: 'im',
        dbHost: 'localhost',
        dbPort: 27017,
    },
    deliveryCost: 10,
    deliveryTypes: {delivery: 'delivery', self: 'self'},
    paymentTypes: {cashToCourier: 'cashToCourier', cardOnline: 'cardOnline', cardToCourier: 'cardToCourier'},
    statuses: {new: 'new', pending: 'pending', delivery: 'delivery', cancelled: 'cancelled', success: 'success'}
};

module.exports = config;