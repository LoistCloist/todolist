export interface User {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    created_at: Date;
    updated_at: Date;
}

export interface List {
    id: number;
    user_id: number;
    name: string;
    description: string | null;
    created_at: Date;
    updated_at: Date;
}

export interface Task {
    id: number;
    user_id: number;
    list_id: number | null;
    name: string;
    description: string | null;
    completed: boolean;
    priority: number;
    due_date: Date | null;
    created_at: Date;
    updated_at: Date;
}