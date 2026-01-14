import { NextRequest, NextResponse } from "next/server";
import pool from '@/lib/db';
import { User } from '@/lib/types';
import bcrypt from 'bcrypt';

// GET - get a specific user
export async function GET(request: Request) {
}
// POST - register user
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, username } = body;
        if (!email || !password || !username) {
            return NextResponse.json(
                { error: "Invalid request data."},
                { status: 400 }
            )
        }
        const existingUsersWithEmail = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        if (existingUsersWithEmail.rows.length > 0) {
            return NextResponse.json(
                { error: "User with this email already exists." },
                { status: 409 }
            )
        }
        // password hashing logic
        const saltRounds = 10
        const password_hash = await bcrypt.hash(password, saltRounds);
        const result = await pool.query('INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at, updated_at', [username, email, password_hash]);
        const newUser = result.rows[0];
        return NextResponse.json(
            {
                message: "New user registered!",
                user: newUser
            },
            { status: 201 }
        )
    } catch (e) {
        console.error("Error: " + e);
        return NextResponse.json(
            { error: "Internal server error?"},
            { status: 500 }
        )
    }
}