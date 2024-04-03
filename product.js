const { Product, userModel } = require('./model');
const securePin = require("secure-pin");
const userController = require('./users');

module.exports = {
    getById: function (req, res, next) {
        let productQuery = {};
        productQuery._id = req.params.id;
        productQuery.createBy = req.body.createBy;
        console.log("productQuery", productQuery)
        Product.findOne(productQuery, function (err, productInfo) {
            if (!productInfo) {
                res.status(200).send({
                    message: "No product detail found!!!",
                });
            } else {
                res.status(200).send({
                    message: "product detail found!!!",
                    data: { product: productInfo },
                });
            }
        });
    },
    getAll: function (req, res, next) {
        let productQuery = {};
        productQuery.createBy = req.body.createBy;
        Product.find(productQuery, function (err, Products) {
            console.log("jjjjjjjjj", Products)
            if (err) {
                next(err);
            } else {
                res.status(200).send({
                    message: "Products list found!!!",
                    data: { Products: Products },
                });
            }
        });
    },
    updateById: function (req, res, next) {
        let productQuery = {};
        productQuery._id = req.params.id;
        productQuery.createBy = req.body.createBy;
        Product.findOne(productQuery, function (err, productInfo) {
            if (err) {
                res.status(404).send({ message: "productInfo Not Found!!!" });
            } else {
                const product = {};
                product.productName = req.body.productName;
                product.category = req.body.category;
                product.productPrice = req.body.productPrice;
                product.createBy = req.body.createBy;

                Product.findOneAndUpdate(productQuery, product, function (err, productInfo) {
                    if (err) next(err);
                    else {
                        res.status(200).send({ message: "product updated successfully!!!" });
                    }
                });
            }
        });
    },
    deleteById: function (req, res, next) {
        let productQuery = {};
        productQuery._id = req.params.id;
        productQuery.createBy = req.body.createBy;

        Product.findOneAndRemove(productQuery, function (err, productInfo) {
            if (err) next(err);
            else {
                res.status(200).send({ message: "product deleted successfully!!!" });
            }
        });
    },
    create: function (req, res, next) {
        Product.findOne(
            { productName: req.body.productName },
            function (err, productInfo) {
                console.log(productInfo, "productInfo");
                if (!productInfo) {
                    const product = {};
                    product.productName = req.body.productName;
                    product.category = req.body.category;
                    product.productPrice = req.body.productPrice;
                    product.createBy = req.body.createBy;

                    Product.create(product, function (err, result) {
                        if (err) next(err);
                        else
                            res.status(200).send({ message: "product added successfully!!!" });
                    });
                } else {
                    res.status(422).send({ message: "product already exists" });
                }
            }
        );
    },
    comments: function (req, res, next) {
        let productQuery = {};
        productQuery._id = req.params.id;
        // productQuery.createBy = req.body.createBy;
        Product.findOne(productQuery, function (err, productInfo) {
            if (err) {
                res.status(404).send({ message: "productInfo Not Found!!!" });
            } else {
                console.log("productInfo", productInfo)
                const product = {};

                product.comments = req.body.comments;
                product.Allcomments = productInfo.Allcomments.concat(req.body.comments)


                Product.findOneAndUpdate(productQuery, product, function (err, productInfo) {
                    if (err) next(err);
                    else {
                        res.status(200).send({ message: "comment post successfully!!!" });
                    }
                });
            }
        });
    }
};