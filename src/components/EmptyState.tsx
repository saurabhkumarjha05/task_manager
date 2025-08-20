import { Plus, CheckSquare, Target } from 'lucide-react';

export function EmptyState({ onNew }: { onNew: () => void }) {
	return (
		<div className="empty-state">
			<div className="empty-state-icon">
				<CheckSquare size={64} />
			</div>
			<h3 className="text-xl font-semibold text-[var(--fg)] mb-2">No tasks yet</h3>
			<p className="text-[var(--muted)] mb-6 max-w-md mx-auto">
				Get started by creating your first task. Organize your work, set priorities, and track your progress.
			</p>
			<div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
				<button 
					className="btn btn-primary hover-lift" 
					onClick={onNew}
				>
					<Plus size={18} className="mr-2" />
					Create your first task
				</button>
				<div className="flex items-center gap-2 text-sm text-[var(--muted)]">
					<Target size={16} />
					<span>Press 'n' for quick access</span>
				</div>
			</div>
		</div>
	);
}


