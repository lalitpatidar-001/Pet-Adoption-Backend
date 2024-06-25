const { requestForAdoption, getAllAdoptionRequest, allSentAdoptoinRequests, acceptRequest, cancelSentRequest, denyRequest } = require("../controllers/adoptionRequest");

const router = require("express").Router();



router.post("/add-request",requestForAdoption);
router.get("/all-request/:userId",getAllAdoptionRequest);
router.get("/all-sent-request/:userId",allSentAdoptoinRequests);
router.put("/accept-request/:requestId",acceptRequest);
router.delete("/cancel-request/:requestId",cancelSentRequest);
router.put("/deny-request/:requestId",denyRequest);

module.exports = router