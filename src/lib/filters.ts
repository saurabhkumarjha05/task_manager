import { Task, Status, Priority } from '../types';
import { compareAsc, compareDesc, parseISO } from 'date-fns';

export interface FilterState {
	query: string;
	status: 'all' | Status;
	priority: 'all' | Priority;
	due: 'all' | 'overdue' | 'today' | 'this_week' | 'no_due';
	tags: string[];
	sort: 'due_asc' | 'due_desc' | 'priority' | 'created' | 'updated';
}

export const defaultFilters: FilterState = {
	query: '',
	status: 'all',
	priority: 'all',
	due: 'all',
	tags: [],
	sort: 'due_asc',
};

function matchesQuery(task: Task, q: string): boolean {
	if (!q) return true;
	const needle = q.toLowerCase();
	return (
		task.title.toLowerCase().includes(needle) ||
		(task.description?.toLowerCase().includes(needle) ?? false) ||
		task.tags.some((t) => t.toLowerCase().includes(needle))
	);
}

function matchesStatus(task: Task, status: FilterState['status']): boolean {
	if (status === 'all') return true;
	return task.status === status;
}

function matchesPriority(task: Task, priority: FilterState['priority']): boolean {
	if (priority === 'all') return true;
	return task.priority === priority;
}

function matchesDue(task: Task, due: FilterState['due']): boolean {
	if (due === 'all') return true;
	const d = task.dueDate ? parseISO(task.dueDate) : undefined;
	if (!d) return due === 'no_due';
	const today = new Date();
	const startOfWeek = new Date(today);
	startOfWeek.setDate(today.getDate() - today.getDay());
	const endOfWeek = new Date(startOfWeek);
	endOfWeek.setDate(startOfWeek.getDate() + 6);
	if (due === 'today') {
		return (
			d.getFullYear() === today.getFullYear() &&
			d.getMonth() === today.getMonth() &&
			d.getDate() === today.getDate()
		);
	}
	if (due === 'this_week') {
		return d >= startOfWeek && d <= endOfWeek;
	}
	if (due === 'overdue') {
		return d < today && !(d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear());
	}
	return false;
}

export function applyFilters(tasks: Task[], filters: FilterState): Task[] {
	return tasks.filter((t) =>
		matchesQuery(t, filters.query) &&
		matchesStatus(t, filters.status) &&
		matchesPriority(t, filters.priority) &&
		matchesDue(t, filters.due) &&
		(filters.tags.length === 0 || filters.tags.every((tg) => t.tags.includes(tg)))
	);
}

export function sortTasks(tasks: Task[], sort: FilterState['sort']): Task[] {
	const copy = [...tasks];
	switch (sort) {
		case 'due_asc':
			return copy.sort((a, b) => {
				const da = a.dueDate ? parseISO(a.dueDate) : undefined;
				const db = b.dueDate ? parseISO(b.dueDate) : undefined;
				if (!da && !db) return 0;
				if (!da) return 1;
				if (!db) return -1;
				return compareAsc(da, db);
			});
		case 'due_desc':
			return copy.sort((a, b) => {
				const da = a.dueDate ? parseISO(a.dueDate) : undefined;
				const db = b.dueDate ? parseISO(b.dueDate) : undefined;
				if (!da && !db) return 0;
				if (!da) return 1;
				if (!db) return -1;
				return compareDesc(da, db);
			});
		case 'priority': {
			const order: Record<Priority, number> = { low: 2, medium: 1, high: 0 };
			return copy.sort((a, b) => order[a.priority] - order[b.priority]);
		}
		case 'created':
			return copy.sort((a, b) => compareDesc(parseISO(a.createdAt), parseISO(b.createdAt)));
		case 'updated':
			return copy.sort((a, b) => compareDesc(parseISO(a.updatedAt), parseISO(b.updatedAt)));
		default:
			return copy;
	}
}


