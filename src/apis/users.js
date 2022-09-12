import { join } from "path";
import { User } from  '../models';
import { Router } from "express";
import { randomBytes } from "crypto";
import { DOMAIN } from "../constants";
import sendMail from "../functions/email-sender";
import { userAuth } from "../middlewares/auth-guard";
import Validator from "../middlewares/validator-middleware";
import { RegisterValidations,AuthenticateValidations } from "../validators";


const router = Router();

/**
 * @description To create new user account
 * @api /users/api/register
 * @access Public
 * @type POST
 */
router.post(
  "/api/register",
  RegisterValidations,
  Validator,
  async (req, res) => {
    try {
      let { username, email } = req.body;

      // Check if the user name is taken or not
      let user = await User.findOne({ username });
      if (user) {
        return res.status(400).json({
          success: false,
          message: "Username is already taken",
        });
      }
      // Check if the user exists with that email
      user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          success: false,
          message:
            "Email is already registered. Did you forget the password, Try resetting it",
        });
      }
      user = new User({
        ...req.body,
        varificationCode: randomBytes(20).toString("hex"),
      });
      await user.save();
      // Send the email to the user with a verification link
      let html = `
    <div>
    <h1>Hello, ${user.username}</h1>
        <p>Please Click The Following Link To Verify Your Account</p>
        <a href="${DOMAIN}users/verify-now/${user.varificationCode}">Verify Now..</a>
    </div>
     `;
      await sendMail(
        user.email,
        "Verify Account",
        "Please Verify Your Account.",
        html
      );
      return res.status(201).json({
        success: true,
        message:
          "Hurry Your Account Is Created Please Verify Your Email Address",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "An Error Occurred",
      });
    }
  }
);

/**
 * @description To verify new users account via Email
 * @api /users/verify-now/verificationCode
 * @access Public <only via Email>
 * @type Get
 */
router.get("/verify-now/:verificationCode", async (req, res) => {
  try {
    let { verificationCode } = req.params;
    let user = await User.findOne({ verificationCode });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Unauthorized Access, invalid Verification Code",
      });
    }
    user.verified = true;
    user.verificationCode = undefined;
    await user.save();
    return res.sendFile(join(__dirname, "../templates/success.html"));
  } catch (error) {
    return res.sendFile(join(__dirname, "../templates/err.html"));
  }
});

/**
 * @description To authenticate an user and get auth token
 * @api /users/api/authenticate
 * @access Public
 * @type Post
 */
router.post("/api/authenticate",AuthenticateValidations,Validator, async(req,res) => {
    try {
        let {username, password} = req.body;
        let user = await User.findOne({ username });
        if(!user){
            return res.status(404).json({
                success:false,
                message:"Username Not Found"
            });
        }
        if(!(await user.comparePassword(password))){
            return res.status(401).json({
                success:false,
                message:"Incorrect Password"
            });
        }
        let token = await user.generateJWT();
        return res.status(200).json({
            success:true,
            user: user.getUserInfo(),
            token: `Bearer ${token}`,
            message:"You Are Now Logged In"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "An Error Occurred",
          });
    }
});

/**
 * @description To get the authenticated user's profile
 * @api /users/api/authenticate
 * @access Private
 * @type Get
 */
router.get("/api/authenticate" , userAuth, async (req, res) => {
  return res.status(200).json({
    user : req.user,
  });
});
export default router;


