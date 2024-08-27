const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminControllers");

router.get("/view/profile/:id", adminController.getProfile);
router.put("/updateprofile/:adminId", adminController.updateAdminProfile);
router.put(
  "/updatepicture/:adminId",
  adminController.upload.single("image"),
  adminController.updateprofilepic
);
router.post(
  "/addprofile",
  adminController.upload.single("image"),
  adminController.addAdmin
);
router.put(
  "/resetpassword/:id/:token",
  adminController.resetpass
);
// router.delete("/deleteprofile/:adminId", adminController.deleteAdmin);



module.exports = router;
