require('dotenv').config();
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;


const mongoConnect = callback => {
    MongoClient.connect(process.env.DB_CONNECT)
    .then( client => {
        console.log('DB successfully connected.');
        _db = client.db('Lolita');
        callback();
    })
    .catch( err => {
        console.log(err);
        throw err;
    });
    
};

const getDB = () => {
    if(_db){
        return _db;
    }
    throw "No DB found.";
}

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;