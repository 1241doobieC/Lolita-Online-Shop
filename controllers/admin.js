const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
}

exports.postAddProduct = (req, res) => {
    let title = req.body.title; //follow with 'name'
    let imageUrl = req.body.imageUrl;
    let price = Number(req.body.price);
    let description = req.body.description;
    const product = new Product(null, title, imageUrl, description, price);
    product.save();
    res.redirect('/')
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode){
        //
    }
    const proId = req.params.productId;
    Product.findById(proId, product => {
        if(!product){
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product
        });
    })
    
}

exports.postEditProduct = (req, res, next) => {
    const proId = req.body.productId;
    const updatedPrice = req.body.price;    
    const updatedImageUrl = req.body.imageUrl;
    const updatedTitle = req.body.title;
    const updatedDesc = req.body.description;
    const updatedProduct = new Product(proId, updatedTitle, updatedImageUrl, updatedDesc, updatedPrice);
    updatedProduct.save();
    res.redirect('/admin/products');
}

exports.getProducts = (req, res) => {
    Product.fetchAll( products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
        });
    });
}