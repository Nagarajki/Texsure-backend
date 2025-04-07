const express = require("express");
const { userAdmin } = require("../middleware/authentication");
const multer = require("multer");
const { createCompany, getCompanies, getCompanyById, updateCompany, deleteCompany } = require("../controllers/companyController");

let router = express.Router();

const storage = multer.memoryStorage(); // Use memory storage
const upload = multer({ storage }); // Use the memory storage in the upload middleware


router.post('/', userAdmin, createCompany);
router.get('/', userAdmin, getCompanies);
router.get('/:id', userAdmin, getCompanyById);
// router.patch('/users', upload.fields([{ name: 'profile' }]), userAdmin, updateUser);
router.patch('/', userAdmin, updateCompany);
router.delete('/', userAdmin, deleteCompany);


module.exports = router;