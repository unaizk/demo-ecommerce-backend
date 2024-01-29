import express from 'express';
import { authAdmin, editProduct, getAllProduct, listProduct, logoutAdmin, registerAdmin, unlistProduct } from '../controller/adminController.js';
const router = express.Router();
import { addProduct } from '../controller/adminController.js';
import { fileURLToPath } from 'url';

import multer from "multer";
import path from "path";
import { adminProtect } from '../middleware/adminAuthMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '/backend/public/productImage'));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only images are allowed!"), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

router.post('/', registerAdmin);
router.post('/auth', authAdmin);
router.post('/logout', logoutAdmin);
router.post('/add-product', adminProtect, upload.single('file'), addProduct);
router.get('/unlist-product/:productId', adminProtect, unlistProduct);
router.get('/list-product/:productId', adminProtect, listProduct);
router.put('/edit-product', adminProtect, editProduct);
router.get('/getAll-products', adminProtect, getAllProduct);

export default router;
