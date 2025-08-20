import { z } from 'zod';
import { AppStateSchemaV1 } from '../types';

export const subtaskSchema = z.object({
	id: z.string(),
	title: z.string(),
	done: z.boolean(),
});

export const taskSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().optional(),
	dueDate: z.string().optional(),
	priority: z.enum(['low', 'medium', 'high']),
	status: z.enum(['todo', 'in_progress', 'done']),
	tags: z.array(z.string()),
	subtasks: z.array(subtaskSchema),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export const appStateSchemaV1 = z.object({
	schemaVersion: z.literal(1),
	tasks: z.array(taskSchema),
	tags: z.array(z.string()),
});

export type ImportData = AppStateSchemaV1;

export function exportJson(data: ImportData): string {
	return JSON.stringify(data, null, 2);
}

export function download(filename: string, text: string) {
	const element = document.createElement('a');
	const file = new Blob([text], { type: 'application/json' });
	element.href = URL.createObjectURL(file);
	element.download = filename;
	document.body.appendChild(element);
	element.click();
	URL.revokeObjectURL(element.href);
	element.remove();
}

export function safeParseImport(json: string): ImportData | null {
	try {
		const raw = JSON.parse(json);
		const parsed = appStateSchemaV1.safeParse(raw);
		if (!parsed.success) return null;
		return parsed.data;
	} catch {
		return null;
	}
}


