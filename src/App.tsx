import { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { FiltersPanel } from './components/FiltersPanel';
import { StatsBar } from './components/StatsBar';
import { TaskList } from './components/TaskList';
import { TaskFormModal, TaskFormValues } from './components/TaskFormModal';
import { EmptyState } from './components/EmptyState';
import { BulkActions } from './components/BulkActions';
import { applyFilters, defaultFilters, FilterState, sortTasks } from './lib/filters';
import { useTaskStore } from './store/useTaskStore';
import { Task } from './types';
import { Menu, X, Plus } from 'lucide-react';

export default function App() {
	const tasks = useTaskStore((s) => s.tasks);
	const tags = useTaskStore((s) => s.tags);
	const addTask = useTaskStore((s) => s.addTask);
	const updateTask = useTaskStore((s) => s.updateTask);
	const deleteTask = useTaskStore((s) => s.deleteTask);
	const toggleSubtask = useTaskStore((s) => s.toggleSubtask);
	const reset = useTaskStore((s) => s.reset);

	const [filters, setFilters] = useState<FilterState>(defaultFilters);
	const [selected, setSelected] = useState<Set<string>>(new Set());
	const [modalOpen, setModalOpen] = useState(false);
	const [editing, setEditing] = useState<Task | undefined>();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	useEffect(() => {
		const cb = (e: Event) => {
			const q = (e as CustomEvent<string>).detail ?? '';
			setFilters((f) => ({ ...f, query: q }));
		};
		window.addEventListener('tm:search' as any, cb as any);
		return () => window.removeEventListener('tm:search' as any, cb as any);
	}, []);

	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			if (e.key === 'n' && !e.ctrlKey && !e.metaKey) {
				e.preventDefault();
				setModalOpen(true);
			}
			if (e.key === 'Delete' && selected.size > 0) {
				e.preventDefault();
				selected.forEach((id) => deleteTask(id));
				setSelected(new Set());
			}
			if (e.key === 'Escape') {
				setModalOpen(false);
				setSidebarOpen(false);
			}
		}
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [selected, deleteTask]);

	useEffect(() => {
		// Ensure initial seed on first mount
		if (tasks.length === 0) reset();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const filteredSorted = useMemo(() => sortTasks(applyFilters(tasks, filters), filters.sort), [tasks, filters]);

	function onToggleDone(id: string) {
		const t = tasks.find((t) => t.id === id);
		if (!t) return;
		updateTask(id, { status: t.status === 'done' ? 'todo' : 'done' });
	}

	function onEdit(t: Task) {
		setEditing(t);
		setModalOpen(true);
	}

	function onDelete(id: string) {
		deleteTask(id);
		setSelected((s) => {
			const next = new Set(s);
			next.delete(id);
			return next;
		});
	}

	function onSubmit(values: TaskFormValues) {
		const normalized: TaskFormValues = {
			...values,
			dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : undefined,
		};
		if (editing) {
			updateTask(editing.id, { ...editing, ...normalized });
		} else {
			addTask({ ...normalized });
		}
		setModalOpen(false);
		setEditing(undefined);
	}

	return (
		<div className="min-h-screen bg-[var(--bg)]">
			<Header onNew={() => { setEditing(undefined); setModalOpen(true); }} />
			
			{/* Mobile Sidebar Toggle */}
			<div className="md:hidden fixed top-20 left-4 z-30">
				<button
					className="btn btn-ghost p-3 bg-[var(--card)] shadow-lg border border-[var(--border)] rounded-full"
					onClick={() => setSidebarOpen(!sidebarOpen)}
					aria-label="Toggle filters"
				>
					{sidebarOpen ? <X size={20} /> : <Menu size={20} />}
				</button>
			</div>

			{/* Main Content */}
			<main className="container py-6">
				<div className="grid grid-cols-1 lg:grid-cols-[320px,1fr] gap-6">
					{/* Sidebar */}
					<aside className={`order-2 lg:order-1 space-y-6 transition-all duration-300 ${
						sidebarOpen ? 'block' : 'hidden lg:block'
					}`}>
						<FiltersPanel value={filters} onChange={setFilters} allTags={tags} />
						<StatsBar />
					</aside>

					{/* Main Content Area */}
					<section className="order-1 lg:order-2 space-y-6">
						{/* Bulk Actions */}
						{selected.size > 0 && (
							<BulkActions
								count={selected.size}
								onChangeStatus={(status) => {
									useTaskStore.getState().bulkUpdate(Array.from(selected), { status });
								}}
								onChangePriority={(priority) => {
									useTaskStore.getState().bulkUpdate(Array.from(selected), { priority });
								}}
								onDelete={() => {
									Array.from(selected).forEach((id) => deleteTask(id));
									setSelected(new Set());
								}}
							/>
						)}

						{/* Task List */}
						{tasks.length === 0 ? (
							<EmptyState onNew={() => setModalOpen(true)} />
						) : (
							<TaskList
								tasks={filteredSorted}
								onToggleDone={onToggleDone}
								onEdit={onEdit}
								onDelete={onDelete}
								selectedIds={selected}
								onToggleSelect={(id) => setSelected((s) => { 
									const n = new Set(s); 
									n.has(id) ? n.delete(id) : n.add(id); 
									return n; 
								})}
							/>
						)}
					</section>
				</div>
			</main>

			{/* Floating Action Button for Mobile */}
			<button
				className="fab lg:hidden"
				onClick={() => { setEditing(undefined); setModalOpen(true); }}
				aria-label="Create new task"
			>
				<Plus size={24} />
			</button>

			{/* Task Form Modal */}
			{modalOpen && (
				<TaskFormModal
					open={modalOpen}
					onClose={() => { setModalOpen(false); setEditing(undefined); }}
					onSubmit={onSubmit}
					initial={editing}
					tagSuggestions={tags}
				/>
			)}

			{/* Mobile Overlay */}
			{sidebarOpen && (
				<div 
					className="lg:hidden fixed inset-0 bg-black/50 z-20"
					onClick={() => setSidebarOpen(false)}
				/>
			)}
		</div>
	);
}


