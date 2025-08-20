import { Task } from '../types';
import { TaskCard } from './TaskCard';
import { CheckSquare } from 'lucide-react';

export function TaskList({ tasks, onToggleDone, onEdit, onDelete, selectedIds, onToggleSelect }: {
	tasks: Task[];
	onToggleDone: (id: string) => void;
	onEdit: (t: Task) => void;
	onDelete: (id: string) => void;
	selectedIds: Set<string>;
	onToggleSelect: (id: string) => void;
}) {
	if (tasks.length === 0) {
		return (
			<div className="text-center py-12 px-4">
				<CheckSquare size={48} className="mx-auto mb-4 text-[var(--muted)]" />
				<p className="text-[var(--muted)] text-lg">No tasks match your filters.</p>
				<p className="text-sm text-[var(--muted)] mt-2">Try adjusting your search or filters.</p>
			</div>
		);
	}

	return (
		<div className="tasks-grid">
			{tasks.map((t) => (
				<div key={t.id} className={`relative ${selectedIds.has(t.id) ? 'ring-2 ring-[var(--accent)] rounded-xl' : ''}`}>
					{/* Selection Checkbox */}
					<div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
						<label className="inline-flex items-center gap-2 bg-[var(--card)]/95 dark:bg-[var(--card)]/95 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs border border-[var(--border)] shadow-sm backdrop-blur-sm">
							<input 
								type="checkbox" 
								checked={selectedIds.has(t.id)} 
								onChange={() => onToggleSelect(t.id)} 
								aria-label={`Select task ${t.title}`}
								className="w-3 h-3 sm:w-4 sm:h-4"
							/>
							<span className="text-[var(--muted)] hidden sm:inline">Select</span>
						</label>
					</div>
					
					<TaskCard 
						task={t} 
						onToggleDone={onToggleDone} 
						onEdit={onEdit} 
						onDelete={onDelete} 
					/>
				</div>
			))}
		</div>
	);
}


