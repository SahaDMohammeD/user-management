import { Schema, model } from "mongoose";

const profileSchema = new Schema(
  {
    account: {
        ref: "users",
        type: Schema.Types.ObjectId
    },
    avatar: {
        type: String,
        required: false
    },
    social: {
      facebook: {
        type: String,
        required: false,
      },
      twitter: {
        type: String,
        required: false,
      },
      linkedin: {
        type: String,
        required: false,
      },
      instagram: {
        type: String,
        required: false,
      },
      github: {
        type: String,
        required: false,
      },
    },
  },
  { timestamps: true }
);

const Profile = model("profiles", profileSchema);
export default Profile; 