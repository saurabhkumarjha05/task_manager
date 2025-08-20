import { useTaskStore } from '../store/useTaskStore';
import { CheckCircle, Clock, AlertTriangle, Calendar, ListTodo, PlayCircle } from 'lucide-react';

export function StatsBar() {
	const counts = useTaskStore((s) => s.counts());
	
	const stats = [
		{ label: 'All', value: counts.all, icon: ListTodo, color: 'text-blue-600' },
		{ label: 'Todo', value: counts.todo, icon: Clock, color: 'text-amber-600' },
		{ label: 'In Progress', value: counts.inProgress, icon: PlayCircle, color: 'text-blue-600' },
		{ label: 'Done', value: counts.done, icon: CheckCircle, color: 'text-green-600' },
		{ label: 'Overdue', value: counts.overdue, icon: AlertTriangle, color: 'text-red-600' },
		{ label: 'Today', value: counts.today, icon: Calendar, color: 'text-purple-600' },
	];

	return (
		<div className="card p-6">
			<h3 className="text-lg font-semibold mb-4 text-center">Task Overview</h3>
			<div className="stats-grid">
				{stats.map((stat) => (
					<div key={stat.label} className="stat-item hover-lift">
						<div className="flex items-center justify-center mb-2">
							<stat.icon size={20} className={stat.color} />
						</div>
						<div className="text-2xl font-bold text-[var(--fg)]">{stat.value}</div>
						<div className="text-xs text-[var(--muted)]">{stat.label}</div>
					</div>
				))}
			</div>
			
			{/* Summary */}
			<div className="mt-4 pt-4 border-t border-[var(--border)]/50">
				<div className="text-center text-sm text-[var(--muted)]">
					{counts.overdue > 0 && (
						<span className="inline-block px-2 py-1 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 rounded-md mr-2">
							{counts.overdue} overdue
						</span>
					)}
					{counts.today > 0 && (
						<span className="inline-block px-2 py-1 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 rounded-md">
							{counts.today} due today
						</span>
					)}
					{counts.overdue === 0 && counts.today === 0 && (
						<span className="text-green-600 dark:text-green-400">All caught up! 🎉</span>
					)}
				</div>
			</div>
		</div>
	);
}


