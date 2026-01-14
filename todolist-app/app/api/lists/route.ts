import { NextRequest, NextResponse } from "next/server";
import pool from '@/lib/db';
import { List } from '@/lib/types';
import { auth } from '@/lib/auth';

// GET - get list that belongs to specific user.
export async function GET(request: NextRequest) {
    try {
        const session = await auth(); // getting current session.
        // check if logged in/authenticated
        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized."},
                { status: 401 }
            );
        }
        const userId = session.user.id;
        const result = await pool.query(
            'SELECT * FROM lists WHERE user_id = $1',
            [userId]
        );
        return NextResponse.json(result.rows);
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { error: "Internal server error."},
            { status: 500 }
        )
    }
}
// POST - create a new empty list with name.
export async function POST(request: NextRequest) {
    try {
        // check for auth and session
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Session does not exist."},
                { status: 401}
            )
        }
        const userId = session.user.id;
        // check if user exists within db.
        // const user = await pool.query('SELECT * FROM users WHERE id=$1', [userId]);
        // if (!user.rows.length) {
        //     return NextResponse.json(
        //         { error: "User with this id not found."},
        //         { status: 404 }
        //     )
        // }
        // parse request and send to db.
        const { name, description } = await request.json();
        if (!name) {
            return NextResponse.json(
                { error: "Invalid or missing request data."},
                { status: 400 }
            )
        }
        const result = await pool.query(
            'INSERT INTO lists (user_id, name, description) VALUES ($1, $2, $3) RETURNING id, user_id, name, description, created_at, updated_at',
            [userId, name, description]
        )
        const newList = result.rows[0];
        return NextResponse.json(
            {
                message: "New list added!",
                list: newList
            },
            { status: 201 }
        );
        // get response and return.
    } catch (e) {
        console.error(e);
        return NextResponse.json(
            { error: "Error creating new list." },
            { status: 500 }
        );
    }
}

// PATCH - modify existing list
export async function PATCH(request: NextRequest) {
    try {
        // check if session exists.
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Session or session user does not exist. Unauthorized." },
                { status: 401 }
            )
        }
        const userId = session.user.id;
        // check if request is valid.
        const { listId, name, description } = await request.json();
        if (!listId) {
            return NextResponse.json(
                { error: "Invalid/missing request data."},
                { status: 400 }
            )
        }
        // modify the list.
        const result = await pool.query(
            'UPDATE lists SET name=$1, description=$2, updated_at=CURRENT_TIMESTAMP WHERE id=$3 AND user_id=$4 RETURNING *',
            [name, description, listId, userId]
        )

        // If no rows returned, either list doesn't exist OR user doesn't own it
        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: "List not found or access denied" },
                { status: 404 }
            )
        }
        // return response.
        return NextResponse.json(
            {
                message: "List successfully updated.",
                list: result.rows[0]
            },
            { status: 200 }
        )
    } catch(e) {
        console.error(e);
        return NextResponse.json(
            { error: "Error modifying existing list."},
            { status: 500}
        );
    }
}

// DELETE - deleting specified list.
export async function DELETE(request: NextRequest) {
    try {
        // make sure session is valid.
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Session not valid. Unauthorized."},
                { status: 401 }
            )
        }
        const userId = session.user.id;
        // verify request is valid.
        const { listId } = await request.json();
        if (!listId) {
            return NextResponse.json(
                { error: "Invalid request data."},
                { status: 400 }
            )
        }
        // delete the list.
        const result = await pool.query(
            'DELETE FROM lists WHERE id=$1 AND user_id=$2 RETURNING *',
            [listId, userId]
        )

        // If no rows returned, either list doesn't exist OR user doesn't own it
        if (result.rows.length === 0) {
            return NextResponse.json(
                { error: "List not found or access denied" },
                { status: 404 }
            )
        }
        // return response.
        return NextResponse.json(
            { message: "List deleted."},
            { status: 200 }
        )
    } catch(e) {
        console.error(e);
        return NextResponse.json(
            { error: "Error deleting list."},
            { status: 500 }
        )
    }
}
