const AdpotionRequest = require("../models/AdpotionRequest");
const Post = require("../models/Post");
const User = require("../models/User");

const requestForAdoption = async (req, res) => {
    const { ownerId, requesterId, petId } = req.body;
    // TODO add data validation
    try {
        const newAdoptionRequest = new AdpotionRequest({
            owner: ownerId,
            requester: requesterId,
            pet: petId
        });

        const savedAdoptionRequest = await newAdoptionRequest.save();

        const savedPopulatedData = await savedAdoptionRequest.populate('owner pet')

        return res.status(201).json({ message: "adoption requset sent successfully", data: savedAdoptionRequest })
    } catch (error) {
        clg
        return res.status(500).json({ message: "internal server error" });
    }
}

// request came for adoption
const getAllAdoptionRequest = async (req, res) => {
    const { userId } = req.params;  // pet owner Id  

    try {
        const requests = await AdpotionRequest.find({ owner: userId }).populate("owner pet requester").sort({ createdAt: -1 });
        return res.status(200).json({ message: "all request retrieved", data: requests });
    } catch (error) {
        console.log(error);
        return res.status(500).json("internal server error")
    }
}

// request you did for adoption
const allSentAdoptoinRequests = async (req, res) => {
    const { userId } = req.params; // requesterId

    try {
        const requests = await AdpotionRequest.find({ requester: userId }).populate("pet owner requester");

        return res.status(200).json({ message: "all send requested retrieved", data: requests });
    } catch (error) {
        console.log(error);
        return res.status(500).json("internal server error");
    }
}

const acceptRequest = async (req, res) => {
    const { requestId } = req.params;

    try {
        const acceptedRequest = await AdpotionRequest.findByIdAndUpdate(requestId, {
            status: "adopted"
        }, { new: true });

        if (acceptedRequest) {
            const updatedRequester = await User.findByIdAndUpdate(acceptedRequest.requester,
                { $push: { adoptions: acceptedRequest.pet } }, { new: true })

            const updatedPet = await Post.findByIdAndUpdate(acceptedRequest.pet,{status:"Adopted"})
        }
        return res.status(200).json({ message: "accepted request successfully", data: acceptedRequest });
    } catch (error) {
        console.log(error);
        return res.status(500).json("internal server error");
    }
};

const cancelSentRequest = async (req, res) => {
    const { requestId } = req.params;

    try {
        const acceptedRequest = await AdpotionRequest.findByIdAndDelete(requestId);

        return res.status(200).json({ message: "request canceled successfully", data: acceptedRequest });
    } catch (error) {
        console.log(error);
        return res.status(500).json("internal server error");
    }
}

const denyRequest = async (req, res) => {
    const { requestId } = req.params;

    try {
        const deniedRequest = await AdpotionRequest.findByIdAndUpdate(requestId, {
            status: "denied"
        }, { new: true });

        return res.status(200).json({ message: "request denied successfully", data: deniedRequest });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'internal server error' });
    }
}
module.exports = {
    requestForAdoption,
    getAllAdoptionRequest,
    allSentAdoptoinRequests,
    acceptRequest,
    cancelSentRequest,
    denyRequest

}