import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import pool from "@/lib/db";
import { User } from "@/lib/types";
import bcrypt from "bcrypt";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email"},
                password: { label: "Password", type: "password"},
            },
            authorize: async (credentials) => {
                const result = await pool.query<User>(
                    'SELECT * FROM users WHERE email=$1',
                    [credentials.email]
                );
                const user = result.rows[0];
                if (!user) {
                    throw new Error("User not found.");
                }
                // use bcrypt here.
                const isValidPassword = await bcrypt.compare(
                    credentials.password as string,
                    user.password_hash
                )
                if (!isValidPassword) {
                    throw new Error("Invalid password.");
                }
                return {
                    id: user.id.toString(),
                    email: user.email,
                };
            }
        })
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        session({ session, token }) {
            if (token.id) {
                session.user.id = token.id as string;
            }
            return session;
        }
    },
    pages: {
        signIn: '/login', 
    },
});