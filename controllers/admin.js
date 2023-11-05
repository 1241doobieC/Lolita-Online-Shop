const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
    });
}

exports.postAddProduct = (req, res) => {
    let title = req.body.title; //follow with 'name'
    let imageUrl = req.body.imageUrl;
    let price = req.body.price;
    let description = req.body.description;
    const product = new Product(title, imageUrl, description, price);
    product.save();
    res.redirect('/')
};

exports.getProducts = (req, res) => {
    Product.fetchAll( products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
        });
    });
}