const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    userName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    cognitoSub: {
        type: String,
        required: true
    }, createdAt: { type: Date, default: Date.now }
});


const ProductSchema = new Schema({
    productName: {
        type: String,
        required: true,
    }, createdAt: {
        type: Date,
        default: Date.now
    }, createBy: {
        type: String,
        required: true,
    }, productPrice: {
        type: String,
    }, comments: {
        type: String,
    },
    Allcomments: {
        type: Array,
    },
    category: {
        type: String,
    }
});

// hash user password before saving into database
UserSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next();
});

const Product = mongoose.model('Blog', ProductSchema);
const userModel = mongoose.model('BlogUser', UserSchema);

module.exports = { Product, userModel };
// module.exports = mongoose.model('User', UserSchema);