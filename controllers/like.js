const Post = require("../models/Post");

const updateLike = async (req, res) => {
    const { id } = req.params;
    const { postId } = req.query;

    try {
        const post = await Post.findOne({ _id: postId });

        if (!post) {
            return res.status(404).json({ msg: "Post not found" });
        }
        let isLike = post.likes.includes(id);
        if (!isLike) {
            const updatedPost = await Post.findByIdAndUpdate(postId, { $push: { likes: id } }, { new: true });
            isLike=true;
            return res.status(201).json({ msg: "Post liked successfully" ,isLike});
        } else {
            const updatedPost = await Post.findByIdAndUpdate(postId, { $pull: { likes: id } }, { new: true });
            isLike=false;
            return res.status(200).json({ msg: "Post disliked successfully",isLike });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};



const isPostLike = async(req,res)=>{
    const {id} = req.params;
    const {postId} = req.query;
    try{
        const post = await Post.findById({ _id: postId });
        if(!post) return res.status(404).json({msg:"post not found"});
        const isLike = post.likes.includes(id);
        return res.status(200).json({isLike})
    }catch(error){
        return res.status(500).json({msg:"internal server error"});
    }
}

module.exports = {
    updateLike,
    isPostLike
};
