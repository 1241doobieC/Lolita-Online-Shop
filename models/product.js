const mongodb = require('mongodb');
const getDB = require('../util/db').getDB;

class Product {
    constructor(title, price, description, imageUrl, id, userId){
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.userId = userId;
    }

    save(){
        const db = getDB();
        let dbOp;
        if(this._id){
            dbOp = db.collection('products')
            .updateOne({_id: (this._id)}, {$set: this});
        }
        else{
            dbOp = db.collection('products')
            .insertOne(this);
        }
        return dbOp
            .then( result => {
            })
            .catch( err => {
              console.log(err);  
            })
        ;
    }

    static fetchAll(){
        const db = getDB();
        return db.collection('products')
            .find()
            .toArray()
            .then(products => {
                return products;
            })
            .catch(err => {
                console.log(err);  
              });
    }
    static findById(prodId){
        const db = getDB();
        return db.collection('products')
            .find({_id : new mongodb.ObjectId(prodId)})
            .next()
            .then(product => product)
            .catch(err => console.log(err) );
    }
    static deleteById(prodId){
        const db = getDB();
        return db.collection('products')
            .deleteOne({_id : new mongodb.ObjectId(prodId)})
            .then( result => {
            })
            .catch(err => {
                console.log(err);
            })
    }
}
module.exports = Product;