const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const GithubStrategy = require("passport-github2");
const { OAuthUserLoginOrRegister } = require("../controllers/auth");
const User = require("../models/User");
const generateJWTToken = require("../utils/jwtToken");
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, callback) => {
      try {
        const email = profile?.emails[0];
        const newEmail = email.value.split("@");
        console.log("profile",profile.photos)
        const data = {
          providerId: profile?.id,
          username: newEmail[0],
          provider: profile?.provider,
          displayName: profile?.displayName,
          photo: profile?.photos[0]?.value,
          email: email.value,
        };
        const user = await OAuthUserLoginOrRegister(data);
        callback(null, user);
      } catch (error) {
        console.log(error);
        return callback(error, null);
      }
    }
  )
);

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_AUTH_CLIENT_ID,
      clientSecret: process.env.GITHUB_AUTH_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_AUTH_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("github profile ", profile);
      // const data ={
      //     providerId:profile?.id,
      //     username:profile.username,
      //     provider:profile?.provider,
      //     displayName:profile?.displayName,
      //     photos:profile?.photos?.value,
      //     email:email.value
      // }
      return done(null, profile);
    }
  )
);

// Serialize and Deserialize user functions
passport.serializeUser((user, done) => {
  console.log("ser usr", user);
  if (user?.user?._id) {
      done(null, user?.user?._id); // Store MongoDB _id in the session
  } else {
    done(null, user?._id); // Store MongoDB _id in the session
  }
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // Fetch user from MongoDB by id
    if (!user) {
      return done(new Error("User not found"), null);
    }
    const token = await generateJWTToken({ id: user?._id });
    done(null, { user, token }); // Pass the user object to the next middleware or route handler
  } catch (error) {
    done(error, null);
  }
});
