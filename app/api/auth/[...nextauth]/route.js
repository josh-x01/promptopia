import NextAuth from "next-auth";
import GoogleProvider from 'next-auth/providers/google';
import { connectToDB } from "@utils/database";
import User from "@models/user";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  async session({ session }) {
    const sessionUser = User.findOne({
      email: session.user.email,
    })

    session.user.id = sessionUser._id.toString();
    return session;
  },

  async signIn({ profile }) {
    try {
      await connectToDB();

      const userExists = User.findOne({
        email: profile.email,
      })

      if (!userExists) {
        await User.create({
          email: profile.email,
          username: profile.username.replace(" ", "").toLowerCase(),
          image: profile.image
        })
      }


    } catch (error) {

    }
  },
})

export { handler as GET, handler as POST };