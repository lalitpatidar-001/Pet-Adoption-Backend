const AdpotionRequest = require("../models/AdpotionRequest");
const { findById } = require("../models/User");
const User = require('../models/User')


const getUser = async (req, res) => {
    const id = req.params.id;
    console.log("iddddd",id);
    try {

        const user = await User.findById(id);
        if(!user) return res.status(404).json({msg:"user not found"});
        return res.status(200).json(user)
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:"something went wrong on server"});
    }
};

// update profile
const updateProfile = async (req, res) => {
    const id = req.query.id;
    console.log("idd",id)
    const { fullname, username, gender, address, DOB, profileImage } = req.body;
    console.log("req body ",req.body);
    console.log("req file ",req.file);


    try {
        // Check if the user exists
        const isUserExist = await User.findById(id);

        if (!isUserExist) {
            return res.status(404).json({ msg: "User not found" });
        }
        // Update the user
        const updateField = {};
        if (fullname) updateField.fullname = fullname;
        if (username) updateField.username = username;
        if (gender) updateField.gender = gender;
        if (address) updateField.address = address;
        if (DOB) updateField.DOB = DOB;
        if (req.file) {
            const path = req.file?.path?.replace(/\\/g, '/');
            updateField.profileImage = path;
        }


        const updatedUser = await User.findByIdAndUpdate(id, updateField, { new: true });

        // Send the updated user as the response
        // res.json(updatedUser);
        return res.json({ msg: "profile updated successfully" })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};

const getAllAdoption = async (req, res) => {
    const { userId } = req.params;

    try {
        const adoptions = await AdpotionRequest.find({ requester: userId, status: "adopted" }).select("pet owner").populate("owner pet");
        return res.status(200).json({ message: "all adoptions retrieved", data: adoptions })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}

const getWishlist = async (req, res) => {
    const { userId } = req.params;

    try {
        const wishlists = await User.findById(userId).populate("savedPosts")
        const dataToSend = [];

        if (!wishlists?.savedPosts || wishlists.savedPosts.length === 0) {
            return res.status(404).json({ message: "No wishlist found" });
        }

        for (const post of wishlists.savedPosts) {
            try {
                const userId = post.userId;
                const owner = await User.findById(userId);

                const obj = {
                    post, // Convert Mongoose document to plain object
                    owner
                };

                dataToSend.push(obj);
            } catch (error) {
                console.error("Error fetching owner details:", error);
                // You can choose to handle errors for individual posts here
            }
        }

        return res.status(200).json({ message: "All wishlist retrieved", data: dataToSend });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};


module.exports = {
    getUser,
    updateProfile,
    getAllAdoption,
    getWishlist,


}