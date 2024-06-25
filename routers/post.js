const { updateLike, isPostLike } = require('../controllers/like');
const { getAllPost, getFilteredPost, createPost, getPostsByUserId, getPostById, deletePost, updateSavedPost } = require('../controllers/post');
const { getUser } = require('../controllers/user');
const {  uploadPost } = require('../utils/multer');
const handlePostValidationResult = require('../validation/handleValidationResult');
const { postValidationRules } = require('../validation/rules/postValidationRules');

const router = require('express').Router();

router.post('/createpost/:id', uploadPost.single('image'),createPost);
router.get("/all",getAllPost);
router.post('/getfilteredposts', postValidationRules, handlePostValidationResult,getFilteredPost);
router.get("/getall/:id",getPostsByUserId);
router.get("/get/:id",getPostById);
router.post("/like/:id",updateLike);
router.get("/islike/:id",isPostLike);
router.delete("/delete/:id",deletePost);
router.put("/savepost/:id",updateSavedPost);

module.exports = router;