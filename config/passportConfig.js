import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

const opts = {
    jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.token, // Extract JWT from HTTP-only cookie
    ]),
    secretOrKey: process.env.JWT_SECRET,
};

passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload.id);
            return user ? done(null, user) : done(null, false);
        } catch (err) {
            return done(err, false);
        }
    })
);

export default passport;
