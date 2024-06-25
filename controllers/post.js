const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const AdpotionRequest = require('../models/AdpotionRequest');


//  post creation
const createPost = async (req, res) => {
  const userId = req.params.id
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }
    const { name, type, breed, age, gender, price, isNoFee, image } = req.body;
    const newPost = new Post({
      userId,
      name,
      type,
      breed,
      age,
      gender,
      price: price,
      isNoFee,
      image: req.file.path,
    });
    const savedPost = await newPost.save();
    await savedPost.populate("userId")
    return res.status(201).json({ message: 'Post created successfully', post: savedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// get all post 
const getAllPost = async (req, res) => {

  try {
    const posts = await Post.find({ status: "Available" }).sort({ createdAt: -1 }).populate('userId');;
    return res.status(200).json(posts);
  }
  catch (error) {
    res.status(500).json("something went wrong on server");
  }
};



// Create a route to get all posts with filter
const getFilteredPost = async (req, res) => {
  try {
    // Extract filter criteria from query parameters
    const { type, breed, selectedGender, ageValue, rangePrice, isNoFeeChecked } = req.body;
    // Build a filter object based on the provided criteria
    const filter = {};
    filter.status = "Available"
    if (type) {
      filter.type = { $regex: new RegExp(type, 'i') };
    }
    if (breed) filter.breed = { $regex: new RegExp(breed, 'i') };
    if (selectedGender) filter.gender = selectedGender;
    if (ageValue) filter.age = { $lte: ageValue }; // Less than or equal to specified age
    if (rangePrice && !isNoFeeChecked) {
      filter.price = { $lte: rangePrice };
      filter.isNoFee = false
    } else if (isNoFeeChecked) {
      filter.isNoFee = true;
    }
    // Fetch pets based on the filter
    const filteredPosts = await Post.find(filter).sort({ createdAt: -1 }).populate('userId');

    res.status(200).json(filteredPosts);
  } catch (error) {
    console.error('Error filtering pets:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getPostsByUserId = async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.id }).populate('userId');
    return res.status(200).json({ msg: "user post retrieved", posts })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "internal server error" })
  }
}

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    return res.status(200).json({ msg: "post retrieved", post })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "internal server error" })
  }
}


const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ msg: "post not found" });
    const postDeleted = await Post.findByIdAndDelete(id);
    const updatedUserSavedPost = await User.findByIdAndUpdate(post.userId, { $pull: { savedPosts: post._id } });
    console.log("updatedUserSavedPost", updatedUserSavedPost);

    const updatedUserAdoptions = await User.findByIdAndUpdate(post.userId, { $pull: { adoptions: post._id } });
    console.log("updatedUserAdoptions", updatedUserAdoptions);

    const updatedAdoptionsRequests = await AdpotionRequest.findOneAndDelete({ owner: post?.userId, pet: post?._id });
    console.log("updatedAdoptionsRequests", updatedAdoptionsRequests);

    return res.status(200).json({ msg: "post deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "internal server error" });
  }
}

const updateSavedPost = async (req, res) => {
  const { id } = req.params;
  const { postId } = req.query;
  try {
    const post = await User.findById(id);
    if (!post) return res.status(404).json({ msg: "post not found" });
    let isPostSaved = post.savedPosts.includes(postId);
    if (!isPostSaved) {
      const updatedPost = await User.findByIdAndUpdate(id, { $push: { savedPosts: postId } }, { new: true }).populate("savedPosts");

      const savedPostsArray = updatedPost.savedPosts;
      const post = savedPostsArray[savedPostsArray.length - 1];

      const owner = await User.findById(post.userId)

      const dataToSend = {
        post, owner
      }

      return res.status(201).json({ msg: "post saved successfuly", data:dataToSend });
    }
    else {
      const updatedPost = await User.findByIdAndUpdate(id, { $pull: { savedPosts: postId } }, { new: true });
      return res.status(200).json({ msg: "post unsaved successfuly", data: updatedPost.savedPosts });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: "internal server error" })
  }

}

module.exports = {
  createPost,
  getAllPost,
  getFilteredPost,
  getPostsByUserId,
  getPostById,
  deletePost,
  updateSavedPost

}




