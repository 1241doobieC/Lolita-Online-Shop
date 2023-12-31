const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
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
        imageUrl: imageUrl,
        userId: req.user
    });
    product
        .save()
        .then(result => {
            console.log("Product created.");
            res.redirect('/admin/products');
        })
        .catch( err => {
            console.log(err);
            throw "Unsuccessfully saved.";
        });
    
};

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if( !editMode) return res.redirect('/');
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
    Product.findById(proId)
        .then(product => {
            if(product.userId.toString() !== req.user._id.toString()){
                return res.redirect('/');
            }
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDesc;
            product.imageUrl = updatedImageUrl;
            return product.save().then( result => {
                console.log("Product updated.");
                res.redirect('/admin/products');
            });
        })
        .catch( err => { console.log(err)});
    
}

exports.getProducts = (req, res) => {
    Product.find({ userId: req.user._id})
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
    Product.deleteOne({_id: proId, userId: req.user._id})
    .then( () => {
        console.log('Product deleted successfully.');
        res.redirect('/admin/products');
    })
    .catch( error => {console.log(err)});
}