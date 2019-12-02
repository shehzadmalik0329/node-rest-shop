const express = require('express');
const router = express.Router();

const multer = require('multer');

const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads/');
    },
    filename: function(req, file, callback) {
        callback(null,Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, callback) => {
    // reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'application/vnd.ms-outlook') {
        callback(null, true);
    } else {
        callback(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const Product = require('../models/product');
const ProductController = require('../controllers/products');

router.get('/', ProductController.get_all_products);

router.post('/', checkAuth, upload.single('productImage'), ProductController.create_product);

router.get('/:productId', ProductController.get_product_by_id);

router.patch('/:productId', checkAuth, ProductController.update_product);

router.delete('/:productId', checkAuth, ProductController.delete_product_by_id);

module.exports = router;