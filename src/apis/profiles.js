import { Router } from "express";
import { Profile } from "../models";
import { DOMAIN } from "../constants";
import uploader from "../middlewares/uploader";
import { userAuth } from "../middlewares/auth-guard";

const router = Router();

/**
 * @description To create profile of the authenticated User
 * @api /profiles/api/create-profile
 * @access Private
 * @type Post
 */
 router.post("/api/create-profile", userAuth, uploader.single('avatar'), async (req, res) => {
    try {
        let { body, file, user } = req;
        let path = DOMAIN + file.path.split("\\uploads")[1];
        let profile = new Profile({
            social: body,
            account: user._id,
            avatar: path,
        });
        await profile.save();
        return res.status(201).json({
            success: true,
            message: "Profile created successfully",
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Unable to create your profile",
        });
    }
});



export default router;