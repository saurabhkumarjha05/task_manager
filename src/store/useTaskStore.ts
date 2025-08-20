import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppStateSchemaV1, Task } from '../types';

const STORAGE_KEY = 'task-manager/v1';

export type TaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;

interface TaskStore extends AppStateSchemaV1 {
	addTask: (input: TaskInput) => void;
	updateTask: (id: string, patch: Partial<Task>) => void;
	deleteTask: (id: string) => void;
	toggleSubtask: (taskId: string, subtaskId: string) => void;
	bulkUpdate: (ids: string[], patch: Partial<Task>) => void;
	exportData: () => AppStateSchemaV1;
	importData: (data: AppStateSchemaV1) => void;
	reset: () => void;
	// selectors
	counts: () => {
		all: number;
		todo: number;
		inProgress: number;
		done: number;
		overdue: number;
		today: number;
	};
}

function nowIso() {
	return new Date().toISOString();
}

function seedTasks(): Task[] {
	const id = () => crypto.randomUUID();
	const today = new Date();
	const iso = (d: Date) => d.toISOString();
	return [
		{
			id: id(),
			title: 'Plan project roadmap',
			description: 'Outline milestones and deliverables for Q3.',
			dueDate: iso(new Date(today.getTime() + 24 * 3600 * 1000)),
			priority: 'high',
			status: 'in_progress',
			tags: ['planning', 'team'],
			subtasks: [
				{ id: id(), title: 'Draft milestones', done: true },
				{ id: id(), title: 'Review with team', done: false },
			],
			createdAt: nowIso(),
			updatedAt: nowIso(),
		},
		{
			id: id(),
			title: 'Fix login bug',
			description: 'Users intermittently see 500 on login.',
			dueDate: iso(new Date(today.getTime() - 2 * 24 * 3600 * 1000)),
			priority: 'high',
			status: 'todo',
			tags: ['bug', 'backend'],
			subtasks: [
				{ id: id(), title: 'Reproduce issue', done: true },
				{ id: id(), title: 'Add logging', done: false },
			],
			createdAt: nowIso(),
			updatedAt: nowIso(),
		},
		{
			id: id(),
			title: 'Write docs for API',
			description: 'Document auth and rate limits.',
			dueDate: undefined,
			priority: 'medium',
			status: 'todo',
			tags: ['docs'],
			subtasks: [
				{ id: id(), title: 'Auth section', done: false },
			],
			createdAt: nowIso(),
			updatedAt: nowIso(),
		},
		{
			id: id(),
			title: 'Design landing page',
			description: 'Create modern hero section.',
			dueDate: iso(new Date(today.getTime() + 7 * 24 * 3600 * 1000)),
			priority: 'low',
			status: 'in_progress',
			tags: ['design', 'frontend'],
			subtasks: [
				{ id: id(), title: 'Wireframe', done: true },
				{ id: id(), title: 'High-fidelity mock', done: false },
			],
			createdAt: nowIso(),
			updatedAt: nowIso(),
		},
		{
			id: id(),
			title: 'Team retrospective',
			description: 'Discuss what went well and improvements.',
			dueDate: iso(new Date(today.getTime() + 0)),
			priority: 'medium',
			status: 'done',
			tags: ['team'],
			subtasks: [
				{ id: id(), title: 'Collect feedback', done: true },
				{ id: id(), title: 'Action items', done: true },
			],
			createdAt: nowIso(),
			updatedAt: nowIso(),
		},
		{
			id: id(),
			title: 'Refactor utils',
			description: 'Cleanup date utilities and tests.',
			dueDate: iso(new Date(today.getTime() + 3 * 24 * 3600 * 1000)),
			priority: 'low',
			status: 'todo',
			tags: ['tech-debt'],
			subtasks: [
				{ id: id(), title: 'Split modules', done: false },
			],
			createdAt: nowIso(),
			updatedAt: nowIso(),
		},
	];
}

const initialState: AppStateSchemaV1 = {
	schemaVersion: 1,
	tasks: [],
	tags: ['planning', 'team', 'bug', 'backend', 'docs', 'design', 'frontend', 'tech-debt'],
};

export const useTaskStore = create<TaskStore>()(
	persist(
		(set, get) => ({
			...initialState,
			addTask: (input) => {
				const id = crypto.randomUUID();
				const now = nowIso();
				const task: Task = { id, createdAt: now, updatedAt: now, ...input };
				set((s) => ({ tasks: [task, ...s.tasks], tags: Array.from(new Set([...s.tags, ...input.tags])) }));
			},
			updateTask: (id, patch) => {
				set((s) => ({
					tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: nowIso() } : t)),
					tags: patch.tags ? Array.from(new Set([...s.tags, ...patch.tags])) : s.tags,
				}));
			},
			deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
			toggleSubtask: (taskId, subtaskId) => {
				set((s) => ({
					tasks: s.tasks.map((t) =>
						t.id !== taskId
							? t
							: {
								...t,
								subtasks: t.subtasks.map((st) => (st.id === subtaskId ? { ...st, done: !st.done } : st)),
								updatedAt: nowIso(),
							},
					),
				}));
			},
			bulkUpdate: (ids, patch) => {
				set((s) => ({
					tasks: s.tasks.map((t) => (ids.includes(t.id) ? { ...t, ...patch, updatedAt: nowIso() } : t)),
					tags: patch.tags ? Array.from(new Set([...s.tags, ...patch.tags])) : s.tags,
				}));
			},
			exportData: () => ({ schemaVersion: 1, tasks: get().tasks, tags: get().tags }),
			importData: (data) => {
				// v1 import merge
				set((s) => ({
					tasks: [...data.tasks, ...s.tasks],
					tags: Array.from(new Set([...s.tags, ...data.tags])),
					schemaVersion: 1,
				}));
			},
			reset: () => set({ ...initialState, tasks: seedTasks() }),
			counts: () => {
				const tasks = get().tasks;
				const all = tasks.length;
				const todo = tasks.filter((t) => t.status === 'todo').length;
				const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
				const done = tasks.filter((t) => t.status === 'done').length;
				const now = new Date();
				const overdue = tasks.filter((t) => t.dueDate && new Date(t.dueDate) < now).length;
				const todayStr = now.toDateString();
				const today = tasks.filter((t) => t.dueDate && new Date(t.dueDate).toDateString() === todayStr).length;
				return { all, todo, inProgress, done, overdue, today };
			},
		}),
		{
			name: STORAGE_KEY,
			storage: createJSONStorage(() => localStorage),
			version: 1,
			migrate: (persisted, version) => {
				if (!persisted) return { ...initialState, tasks: seedTasks() } as AppStateSchemaV1;
				// v1 no-op
				return persisted as AppStateSchemaV1;
			},
			onRehydrateStorage: () => (state) => {
				if (state && state.tasks.length === 0) {
					// First run seed
					state.tasks = seedTasks();
				}
			},
		},
	),
);


