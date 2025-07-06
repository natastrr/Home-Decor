const mongoose = require('mongoose');
const config = require('../../config/config');

class MongoDBConnection {
    static isConnected = false;
    static db;

    static getConnection(result) {
        if (this.isConnected) {
            return result(null, this.db);
        } else {
            return this.connect(result);
        }
    }

    static connect(result) {
         mongoose.connect(config.db.dbUrl, {
            dbName: config.db.dbName,
            useNewUrlParser: true,
        }).then();
        const db = mongoose.connection;

        db.once('open', () => {
            console.log('MongoDB connection opened!');
            this.db = mongoose;
            this.isConnected = true;
            return result(null, this.db);
        });
        db.on('connecting', () => {
            console.log('connecting to MongoDB...');
        });
        db.on('error', (error) => {
            console.log('Error in MongoDb connection: ' + error);
            mongoose.disconnect().then().catch();
        });
        db.on('connected', () => {
            console.log('MongoDB connected!');
        });
        db.on('reconnected', () => {
            console.log('MongoDB reconnected!');
        });
        db.on('disconnected', () => {
            console.log('MongoDB disconnected!');
            setTimeout(() => MongoDBConnection.connect(() => {
                // after connect callback
            }), 5000);
        });
    }
}

module.exports = MongoDBConnection;