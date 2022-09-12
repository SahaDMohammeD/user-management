import cors from "cors";
import { join } from "path";
import consola from "consola";
import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import bodyParser from "body-parser";

//import Application Constants
import { DB, PORT } from "./constants";

// Router imports
import userApis from "./apis/users.js";
import profileApis from "./apis/profiles";

// Import passport middleware
require("./middlewares/passport-middleware");

//initialize express appplication
const app = express();

//Apply Application Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(express.static(join(__dirname, "./uploads")));

// Inject sub router and apis
app.use("/users", userApis);
app.use("/profiles", profileApis);

const main = async () => {
  try {
    //connect with database
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    consola.success("DATABASE CONNECTED....");
    //start application listening for request on server
    app.listen(PORT, () => consola.success(`Server Started On Port ${PORT}`));
  } catch (error) {
    consola.error(`Unable To Start The Server \n ${error.message}`);
  }
};

main();
