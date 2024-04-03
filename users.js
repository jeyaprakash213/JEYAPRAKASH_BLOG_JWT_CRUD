// const userModel = require("./model");
const { Product, userModel } = require('./model');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

module.exports = {
    create: function (req, res, next) {
        // console.log("req", req)
        userModel.findOne(
            { userName: req.body.userName },
            function (err, userInfo) {
                if (!userInfo) {
                    let user = {};
                    user.userName = req.body.userName;
                    user.password = req.body.password;
                    user.cognitoSub = uuidv4();
                    userModel.create(user, function (err, result) {
                        if (err) next(err);
                        else
                            res.status(200).send({ message: "User added successfully!!!" });
                    });
                } else {
                    res
                        .status(422)
                        .send({ message: "User already exists" });
                }
            }
        );
    },
    authenticate: function (req, res, next) {
        userModel.findOne({ userName: req.body.userName }, function (err, userInfo) {
            // console.log("user", userInfo);
            if (err) {
                next(err);
            } else {
                if (bcrypt.compareSync(req.body.password, userInfo.password)) {
                    const token = jwt.sign(
                        { cognitoSub: userInfo.cognitoSub },
                        req.app.get("secretKey"),
                        { expiresIn: "1h" }
                    );
                    res
                        .status(200)
                        .send({
                            message: "Loggedin succesfully!!!",
                            data: { user: userInfo, token: token },
                        });
                } else {
                    res.status(422).send({ message: "Invalid userName/password!!!" });
                }
            }
        });
    },
    getById: function (req, res, next) {
        let userQuery = {};
        userQuery.cognitoSub = req.body.cognitoSub;
        userModel.findOne(userQuery, function (err, userInfo) {
            if (!userInfo) {
                res.status(200).send({
                    message: "No product detail found!!!",
                });
            } else {
                res.status(200).send({
                    message: "product detail found!!!",
                    data: { userInfo: userInfo },
                });
            }
        });
    },
    updateById: function (req, res, next) {
        let userQuery = {};
        userQuery._id = req.body._id;
        userModel.findByIdAndUpdate(userQuery, req.body, function (err, userInfo) {
            if (!userInfo) {
                res.status(200).send({
                    message: "No user detail found!!!",
                });
            } else {
                res.status(200).send({
                    message: "updated user detail !!!",
                    data: { userInfo: userInfo },
                });
            }
        });
    },
    deleteById: function (req, res, next) {
        let productQuery = {};
        productQuery._id = req.body._id;
        Product.findOneAndRemove(productQuery, function (err, productInfo) {
            if (err) next(err);
            else {
                res.status(200).send({ message: "user deleted successfully!!!" });
            }
        });
    },
};