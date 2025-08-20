export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in_progress' | 'done';

export interface Subtask {
	id: string;
	title: string;
	done: boolean;
}

export interface Task {
	id: string;
	title: string;
	description?: string;
	dueDate?: string; // ISO date string
	priority: Priority;
	status: Status;
	tags: string[]; // simple tag strings
	subtasks: Subtask[];
	createdAt: string; // ISO
	updatedAt: string; // ISO
}

export interface AppStateSchemaV1 {
	schemaVersion: 1;
	tasks: Task[];
	tags: string[]; // user created tags
}


