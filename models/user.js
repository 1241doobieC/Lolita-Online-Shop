const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');


const Schema = mongoose.Schema;

const userSchema = new Schema({
  googleId: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: false
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  }
});

userSchema.methods.addToCart = function(product) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity
    });
  }
  const updatedCart = {
    items: updatedCartItems
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function(productId) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function() {
  this.cart = { items: [] };
  return this.save();
};

userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);

// const { getDB } = require('../util/db');
// const mongodb = require('mongodb');
// const ObjectId = mongodb.ObjectId;

// class User{
//     constructor(username, email, cart, id){
//         this.username = username;
//         this.email = email;
//         this.cart = cart || { items: [] }; //{items:[]}
//         this._id = id;
//     }

//     addToCart(product){
//         //search for existing product 
//         const cartProductIndex = this.cart.items.findIndex(prod =>{
//             return prod.productId.toString() === product._id.toString();
//         })
//         let quantity = 1;
//         const updatedCartItems = [...this.cart.items];

//         if(cartProductIndex >= 0){ 
//             //existing
//             updatedCartItems[cartProductIndex].quantity = this.cart.items[cartProductIndex].quantity + 1;
//         } else{ 
//             //new product
//             updatedCartItems.push({
//                 productId: new ObjectId(product._id),
//                  quantity : 1
//             })
//         }
//         const db = getDB();
//         const updatedCart = { items: updatedCartItems};
//         return db.collection('users')
//             .updateOne(
//                 {_id : new ObjectId(this._id)},
//                 {$set: {cart: updatedCart} }
//             );
//     }

//     getCart(){
//         const db = getDB();
//         //search for all product IDs in the cart
//         const productIds = this.cart.items.map(item => {
//             return item.productId;
//         }); 
//         return db.collection('products')
//                 .find( {_id: {$in: productIds} } )
//                 .toArray()
//                 .then( (products) => {
//                     return products.map( p => {
//                         return { ...p, quantity: this.cart.items.find(i => {
//                                 return i.productId.toString() === p._id.toString();
//                             }).quantity
//                         }
//                     })
//                 })
//                 .catch(err => console.log(err));
//     }

//     save(){
//         const db = getDB();
//         return db.collection('users').insertOne(this);
//     }

//     deleteItemFromCart(productId){
//         const updatedCartItems = this.cart.items.filter(item => {
//             return item.productId.toString() !== productId.toString();
//         });
//         const db = getDB();
//         return db.collection('users')
//             .updateOne(
//                 {_id : new ObjectId(this._id)},
//                 {
//                     $set: { cart: {items: updatedCartItems} } 
//                 }
//             );
//     }

//     addOrder(){
//         const db = getDB();
//         return this.getCart()
//             .then(products => {
                
//                 const order = {
//                     items: products,
//                     user: {
//                         _id: new ObjectId(this._id),
//                         name: this.username
//                     }
//                 }
//                 return db.collection('orders').insertOne(order);
//             })
//             .then(result => {
//                 // this.cart = {items: []};
//                 return db.collection('users')
//                     .updateOne(
//                         {_id : new ObjectId(this._id)},
//                         {
//                             $set: { cart: {items: []} } 
//                         }
//                     )
//             })
//             .catch(err => console.log(err));
//     }

//     getOrders(){
//         const db = getDB();
//         return db.collection('orders').find({
//                 'user._id' : new ObjectId(this._id)
//             })
//             .toArray();
//     }

//     static findById(userId){
//         const db = getDB();
//         return db.collection('users')
//             .findOne({_id : new ObjectId(userId)});

//     }
//  }

//  module.exports = User;