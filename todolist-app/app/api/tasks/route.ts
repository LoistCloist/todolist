import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { Task } from '@/lib/types';
import { auth } from '@/lib/auth';

//GET - this gets all tasks for a user
export async function GET(request: NextRequest) {
    try{
        // check session
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized/session not valid." },
                { status: 401 }
            )
        }
        const userId = session.user.id;
        const result = await pool.query(
            'SELECT * FROM tasks WHERE user_id=$1',
            [userId]
        )
        return NextResponse.json(
            {
                message: "Returned all tasks for user.",
                tasks: result.rows[0]
            }
        )
    } catch(e) {
        console.error(e);
        return NextResponse.json(
            { error: "Error getting all tasks for this user."},
            { status: 500 }
        )
    }
}

// GET - get a specific task based on search query. (TODO)

// POST - adds a specific task for a user
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized. Session not valid."},
                { status: 401 }
            )
        }
        const userId = session.user.id;
        // check if request is valid.
        const { listId, name, description, completed, priority, dueDate } = await request.json();
        if (!name || !priority || priority < 0 || priority > 3) {
            return NextResponse.json(
                { error: "Invalid or missing request data."},
                { status: 400 }
            )
        }
        // post this to list.
        const result = await pool.query(
            'INSERT INTO tasks (user_id, list_id, name, description, completed, priority, due_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [userId, listId, name, description, completed || false, priority, dueDate]
        );
        return NextResponse.json(
            {
                message: "Created task.",
                task: result.rows[0]
            },
            { status: 201 }
        )
    } catch(e) {
        console.error(e);
        return NextResponse.json(
            { error: "Unable to create new task."},
            { status: 500 }
        )
    }
}

// PATCH - modify an existing task
export async function PATCH(request: NextRequest) {
    try {
        // validate session.
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized. Session invalid." },
                { status: 401 }
            )
        }
        const userId = session.user.id
        // validate request.
        const { taskId, name, description, completed, priority, dueDate } = await request.json();
        if (!taskId) {
            return NextResponse.json(
                { error: "Missing taskId." },
                { status: 400 }
            )
        }

        // Build updates object from request, filtering out undefined
        const updates = Object.fromEntries(
            Object.entries({
                name,
                description,
                completed,
                priority,
                due_date: dueDate
            }).filter(([_, value]) => value !== undefined)
        );

        if (Object.keys(updates).length === 0) {
            return NextResponse.json(
                { error: "No fields to update provided." },
                { status: 400 }
            );
        }

        // Validate priority only if provided
        if (priority != null && (priority < 0 || priority > 3)) {
            return NextResponse.json(
                { error: "Invalid priority value." },
                { status: 400 }
            )
        }

        // Build dynamic SQL query
        const fields = Object.keys(updates);
        const values = Object.values(updates);
        const setClause = fields.map((field, i) => `${field}=$${i + 1}`).join(', ');
        values.push(userId, taskId);

        // verify user and modify in one go.
        const result = await pool.query(
            `UPDATE tasks SET ${setClause}, updated_at=CURRENT_TIMESTAMP WHERE user_id=$${values.length - 1} AND id=$${values.length} RETURNING *`,
            values
        )
        if (result.rowCount === 0) {
            return NextResponse.json(
                { error: "Task not found or unauthorized." },
                { status: 404 }
            )
        }

        return NextResponse.json(
            {
                message: "Task updated.",
                task: result.rows[0]},
            { status: 200 }
        )
    } catch(e) {
        console.error(e);
        return NextResponse.json(
            { error: "Failed to update task."},
            { status: 500 }
        )
    }
}
// DELETE - delete a task
export async function DELETE(request: NextRequest) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized. Invalid session."},
                { status: 401}
            )
        }
        const userId = session.user.id;
        const { taskId } = await request.json();
        if (!taskId) {
            return NextResponse.json(
                { error: "Missing taskId for deletion."},
                { status: 400}
            )
        }
        const result = await pool.query(
            'DELETE FROM tasks WHERE id=$1 AND user_id=$2 RETURNING *',
            [taskId, userId]
        )
        if (result.rowCount === 0) {
            return NextResponse.json(
                { error: "Task not found or unauthorized." },
                { status: 404 }
            )
        }
        return NextResponse.json(
            { message: "Deleted task."},
            { status: 200 }
        )
    } catch(e) {
        console.error(e);
        return NextResponse.json(
            { error: "Failed to delete task."},
            { status: 500}
        )
    }
}
