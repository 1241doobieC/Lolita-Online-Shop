require('dotenv').config();
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = callback => {
    MongoClient.connect(process.env.DB_CONNECT)
    .then( client => {
        console.log('Successfully connected.');
        callback(client);
    })
    .catch( err => {
        console.log(err);
    });
    
};

module.exports = mongoConnect;