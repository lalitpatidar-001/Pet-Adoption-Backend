const { getUser, updateProfile, getAllAdoption, getWishlist, getAllSavedPosts } = require('../controllers/user');
const { uploadProfile } = require('../utils/multer');

const router = require('express').Router();

router.get("/:id",getUser);
router.post('/update',uploadProfile.single("profileImage"),updateProfile);
router.get('/adoptions/:userId',getAllAdoption);
router.get('/wishlists/:userId',getWishlist);

module.exports = router;