const Product = require('../models/product');
const Cart = require('../models/cart');
const User = require('../models/user');


exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then( products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products',
            });
        })
        .catch( err => {
            console.log(err);
        });
};

exports.getProduct = (req, res, next) => {
    const  proID = req.params.productId;
    Product.findById(proID)
        .then( product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            })
        })
        .catch( err => console.log(err));
}

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
                res.render('shop/index', {
                    prods: products,
                    pageTitle: 'Shop',
                    path: '/',
                });
            }
        )
        .catch(error => console.log(error));
}
exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(products => {
            res.render('shop/cart', {
                products: products,
                pageTitle: 'Your Cart',
                path: '/cart',
            });
        });
}

exports.postCart = (req, res, next) => {
    const proId = req.body.productId;
    Product.findById(proId)
        .then(product =>{
            return req.user.addToCart(product);
        })
        .then(result => {
            res.redirect('/cart');
        })
}
exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId; 
    req.user
        .deleteItemFromCart(prodId)
        .then( () => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
}

exports.postOrders = (req, res, next) => {
    req.user.addOrder()
        .then(result => {
            console.log(result);
            res.redirect('/');
        })
        .catch(err => console.log(err));
}
exports.getOrders = (req, res, next) => {
    // Product.fetchAll( products => {
    //     res.render('shop/orders', {
    //         prods: products,
    //         pageTitle: 'Your Orders',
    //         path: '/orders',
    //     });
    // });
    // res.redirect('/orders');
}

exports.getCheckOut = (req ,res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    })
}