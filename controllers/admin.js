const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        isAuthenticated: req.session.isLoggedIn
    });
}

exports.postAddProduct = (req, res) => {
    let title = req.body.title; 
    let imageUrl = req.body.imageUrl;
    let price = Number(req.body.price);
    let description = req.body.description;
    const product = new Product({
        title: title, 
        price: price,
        description: description, 
        imageUrl: imageUrl
    });
    product
        .save()
        .then(result => {
            console.log("Product saved.");
            res.redirect('/admin/products');
        })
        .catch( err => {
            console.log(err);
            throw "Unsuccessfully saved.";
        });
    
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    const proId = req.params.productId;
    Product.findById(proId)
        .then(product => {
            if(!product){
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => console.log(err))
    
}

exports.postEditProduct = (req, res, next) => {
    const proId = req.body.productId;
    const updatedPrice = Number(req.body.price);    
    const updatedImageUrl = req.body.imageUrl;
    const updatedTitle = req.body.title;
    const updatedDesc = req.body.description;
    const updatedProduct = new Product(updatedTitle, updatedPrice, updatedDesc, updatedImageUrl, proId, req.user._id);
    updatedProduct.save()
    .then( result => {
        console.log("Updated product.");
        res.redirect('/admin/products');
    })
    .catch( err => { console.log(err)});
    
}

exports.getProducts = (req, res) => {
    Product.find()
        .then(
            products => { 
                res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
                isAuthenticated: req.session.isLoggedIn
            })
        })
        .catch(err => console.log(err));

}

exports.postDeleteProduct = (req, res, next) => {
    const proId = req.body.productId;
    Product.deleteById(proId)
    .then( () => {
        console.log('Product deleted successfully.');
        res.redirect('/admin/products');
    })
    .catch( error => {console.log(err)});
}