import passport from "passport";

import {
  Strategy as googleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { Isactive, Role } from "../modules/user/user.interface";
import dotenv from "dotenv";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs";
import AppError from "../errorHelpers/AppError";
import httpSuccessCode from "http-status-codes";
dotenv.config();

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done: any) => {
      try {
        const isUserExit = await User.findOne({ email });
        if (!isUserExit) {
          return done(null, false, { message: "User Not Found" });
        }
        if (
          isUserExit.isactive === Isactive.BLOCKED ||
          isUserExit.isactive === Isactive.INACTIVE
        ) {
          return done(`User is ${isUserExit.isactive}`);
        }

        if (isUserExit.isdeleted) {
          return done("User deleted");
        }

        if (!isUserExit.isVerified) {
          return done("User Not Verified");
        }
        const isGoogleAuthenticated = isUserExit.Auth.some(
          (auth) => auth.provider === "google"
        );
        if (isGoogleAuthenticated && !isUserExit.password) {
          return done(null, false, {
            message:
              "You are authenticated with Google, not with email and password. ",
          });
        }

        const ispasswordMatch = await bcryptjs.compare(
          password as string,
          isUserExit.password as string
        );
        if (!ispasswordMatch) {
          return done(null, false, { message: "Incorrect Password" });
        }
        return done(null, isUserExit);
      } catch (error) {
        console.log("Local Strategy Error", error);
        return done(error);
      }
    }
  )
);

passport.use(
  new googleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK,
    },

    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(null, false, { message: "email NOt Found" });
        }
        let isUserExit = await User.findOne({ email });
        if (isUserExit && !isUserExit.isVerified) {
          return done("User Not Verified");
        }
        if (
          isUserExit &&
          (isUserExit.isactive === Isactive.BLOCKED ||
            isUserExit.isactive === Isactive.INACTIVE)
        ) {
          return done(`User is ${isUserExit.isactive}`);
        }

        if (isUserExit && isUserExit.isdeleted) {
          return done("User deleted");
        }

        if (!isUserExit) {
          isUserExit = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            Role: Role.USER,
            Auth: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
          return done(null, isUserExit);
        }
      } catch (error) {
        console.log("google sTrategy Error", error);
        return done(error);
      }
    }
  )
);
// console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
});
