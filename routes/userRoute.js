const express = require("express");
const { getUsers, getUserById, updateUser, deleteUser } = require("../controllers/userController");
const { signUp, signIn, mailValidationAPi } = require("../controllers/authController");
const { userAdmin } = require("../middleware/authentication");
const multer = require("multer");

let router = express.Router();

const storage = multer.memoryStorage(); // Use memory storage
const upload = multer({ storage }); // Use the memory storage in the upload middleware


router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.post('/email-validation', mailValidationAPi);

router.get('/users', userAdmin, getUsers);
router.get('/users/:id', userAdmin, getUserById);
// router.patch('/users', upload.fields([{ name: 'profile' }]), userAdmin, updateUser);
router.patch('/users', userAdmin, updateUser);
router.delete('/users', userAdmin, deleteUser);


module.exports = router;