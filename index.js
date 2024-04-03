const express = require('express');
const connectDB = require('./db');
const userController = require('./users');
const productController = require('./product');
const { Product, userModel } = require('./model');
const paginations = require('./pagination');
const app = express();
var jwt = require("jsonwebtoken");
const PORT = process.env.PORT || 3000;


// Connect to MongoDB
connectDB();

// jwt secret token
app.set("secretKey", "nodeRestApi");

// Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// JWT middleware
function validateUser(req, res, next) {
    jwt.verify(
        req.headers["x-access-token"],
        req.app.get("secretKey"),
        function (err, decoded) {
            if (err) {
                res.status(401).json({ status: "error", message: err.message });
            } else {
                // add user id to request
                req.body.userId = decoded.cognitoSub;
                next();
            }
        }
    );
}


// signup && login
app.post('/api/register', userController.create);
app.post('/api/login', userController.authenticate);


// User bonus 
app.get('/userData', userController.getById);
app.put("/userUpdate", userController.updateById);
app.delete("/Deleteuser", userController.deleteById);


// blog products crud

app.post("/api/posts", validateUser, productController.create);


app.get("/api/posts", validateUser, productController.getAll);
app.get("/api/posts/:id", validateUser, productController.getById);


app.put("/api/posts/:id", validateUser, productController.updateById);
app.delete("/api/posts/:id", validateUser, productController.deleteById);

// bonus comments
app.put("/api/posts/comments/:id", productController.comments);


//bonus paginations
app.get("/api/products/search", paginations.pages);



// Server start
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});