const { getDB } = require('../util/db');
const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;

class User{
    constructor(username, email, cart, id){
        this.username = username;
        this.email = email;
        this.cart = cart || { items: [] }; //{items:[]}
        this._id = id;
    }
    addToCart(product){
        //search for existing product 
        const cartProductIndex = this.cart.items.findIndex(prod =>{
            return prod.productId.toString() === product._id.toString();
        })
        let quantity = 1;
        const updatedCartItems = [...this.cart.items];

        if(cartProductIndex >= 0){ 
            //existing
            updatedCartItems[cartProductIndex].quantity = this.cart.items[cartProductIndex].quantity + 1;
        } else{ 
            //new product
            updatedCartItems.push({
                productId: new ObjectId(product._id),
                 quantity : 1
            })
        }
        const db = getDB();
        const updatedCart = { items: updatedCartItems};
        return db.collection('users')
            .updateOne(
                {_id : new ObjectId(this._id)},
                {$set: {cart: updatedCart} }
            );
    }

    getCart(){
        const db = getDB();
        //search for all product IDs in the cart
        const productIds = this.cart.items.map(item => {
            return item.productId;
        }); 
        return db.collection('products')
                .find( {_id: {$in: productIds} } )
                .toArray()
                .then( (products) => {
                    return products.map( p => {
                        return { ...p, quantity: this.cart.items.find(i => {
                                return i.productId.toString() === p._id.toString();
                            }).quantity
                        }
                    })
                })
                .catch(err => console.log(err));
    }
    save(){
        const db = getDB();
        return db.collection('users').insertOne(this);
    }

    static findById(userId){
        const db = getDB();
        return db.collection('users')
            .findOne({_id : new ObjectId(userId)});

    }
 }

 module.exports = User;