import { CheckCircle2, Circle, MoreVertical, Trash2, Calendar, Tag } from 'lucide-react';
import { Task } from '../types';
import { formatDueLabel, isOverdue, isToday } from '../lib/date';

export function TaskCard({ task, onToggleDone, onEdit, onDelete }: { 
	task: Task; 
	onToggleDone: (id: string) => void; 
	onEdit: (t: Task) => void; 
	onDelete: (id: string) => void; 
}) {
	const done = task.status === 'done';
	const overdue = task.dueDate ? isOverdue(task.dueDate) : false;
	const today = task.dueDate ? isToday(task.dueDate) : false;

	return (
		<div className={`task-card card p-4 sm:p-6 transition-all duration-200 ${done ? 'opacity-75' : 'hover-lift'}`} role="article" aria-label={`Task ${task.title}`}>
			{/* Header with checkbox and actions */}
			<div className="flex items-start justify-between mb-4">
				<button 
					className="mt-1 p-1 rounded-full hover:bg-[var(--border)] transition-colors flex-shrink-0" 
					onClick={() => onToggleDone(task.id)} 
					aria-label={done ? 'Mark as not done' : 'Mark as done'}
				>
					{done ? (
						<CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
					) : (
						<Circle className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--muted)] hover:text-[var(--accent)]" />
					)}
				</button>
				
				<div className="flex items-center gap-1 sm:gap-2">
					<button 
						className="btn btn-ghost p-1.5 sm:p-2" 
						onClick={() => onEdit(task)} 
						aria-label="Edit task"
					>
						<MoreVertical size={16} />
					</button>
					<button 
						className="btn btn-ghost p-1.5 sm:p-2 text-red-500 hover:text-red-600" 
						onClick={() => onDelete(task.id)} 
						aria-label="Delete task"
					>
						<Trash2 size={16} />
					</button>
				</div>
			</div>

			{/* Task Content */}
			<div className="space-y-3 sm:space-y-4">
				{/* Title and Status/Priority */}
				<div className="space-y-2 sm:space-y-3">
					<h3 className={`text-base sm:text-lg font-semibold leading-tight ${done ? 'line-through text-[var(--muted)]' : ''}`}>
						{task.title}
					</h3>
					
					<div className="flex flex-wrap items-center gap-2">
						<span className={`chip text-xs sm:text-sm ${getStatusClass(task.status)}`}>
							{task.status.replace('_', ' ')}
						</span>
						<span className={`chip text-xs sm:text-sm ${getPriorityClass(task.priority)}`}>
							{task.priority}
						</span>
					</div>
				</div>

				{/* Description */}
				{task.description && (
					<p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-3">
						{task.description}
					</p>
				)}

				{/* Due Date */}
				{task.dueDate && (
					<div className="flex items-center gap-2 text-sm">
						<Calendar size={16} className="text-[var(--muted)] flex-shrink-0" />
						<span className={`chip text-xs sm:text-sm ${getDueDateClass(overdue, today)}`}>
							{formatDueLabel(task.dueDate)}
						</span>
					</div>
				)}

				{/* Tags */}
				{task.tags.length > 0 && (
					<div className="space-y-2">
						<div className="flex items-center gap-2 text-sm text-[var(--muted)]">
							<Tag size={16} className="flex-shrink-0" />
							<span>Tags</span>
						</div>
						<div className="flex flex-wrap gap-2">
							{task.tags.map((tag) => (
								<span key={tag} className="chip bg-[var(--border)] text-[var(--fg)] hover:bg-[var(--border)] transition-colors text-xs">
									{tag}
								</span>
							))}
						</div>
					</div>
				)}

				{/* Subtasks Progress */}
				{task.subtasks.length > 0 && (
					<div className="pt-2 border-t border-[var(--border)]">
						<div className="flex items-center justify-between text-sm text-[var(--muted)] mb-2">
							<span>Subtasks</span>
							<span>{task.subtasks.filter(st => st.done).length}/{task.subtasks.length}</span>
						</div>
						<div className="w-full bg-[var(--border)] rounded-full h-2">
							<div 
								className="bg-[var(--accent)] h-2 rounded-full transition-all duration-300"
								style={{ width: `${(task.subtasks.filter(st => st.done).length / task.subtasks.length) * 100}%` }}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

function getStatusClass(status: Task['status']) {
	switch (status) {
		case 'todo':
			return 'status-todo';
		case 'in_progress':
			return 'status-in-progress';
		case 'done':
			return 'status-done';
		default:
			return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
	}
}

function getPriorityClass(priority: Task['priority']) {
	switch (priority) {
		case 'high':
			return 'priority-high';
		case 'medium':
			return 'priority-medium';
		case 'low':
			return 'priority-low';
		default:
			return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
	}
}

function getDueDateClass(overdue: boolean, today: boolean) {
	if (overdue) return 'due-overdue';
	if (today) return 'due-today';
	return 'due-future';
}


