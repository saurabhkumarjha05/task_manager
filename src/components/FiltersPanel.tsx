import { FilterState } from '../lib/filters';
import { Filter, SortAsc, Calendar, Tag, AlertTriangle } from 'lucide-react';

export function FiltersPanel({ value, onChange, allTags }: { 
	value: FilterState; 
	onChange: (next: FilterState) => void; 
	allTags: string[]; 
}) {
	function set<K extends keyof FilterState>(key: K, v: FilterState[K]) {
		onChange({ ...value, [key]: v });
	}
	
	const toggleTag = (tag: string) => {
		const next = value.tags.includes(tag) ? value.tags.filter((t) => t !== tag) : [...value.tags, tag];
		onChange({ ...value, tags: next });
	};

	return (
		<aside className="sidebar" aria-label="Filters">
			{/* Header */}
			<div className="flex items-center gap-2 mb-6">
				<Filter size={20} className="text-[var(--accent)]" />
				<h3 className="text-lg font-semibold">Filters & Sort</h3>
			</div>

			{/* Status Filter */}
			<div className="space-y-3">
				<h4 className="text-sm font-medium text-[var(--fg)] flex items-center gap-2">
					<AlertTriangle size={16} />
					Status
				</h4>
				<div className="grid grid-cols-2 gap-2">
					{['all', 'todo', 'in_progress', 'done'].map((s) => (
						<label key={s} className={`chip cursor-pointer transition-all duration-200 ${
							value.status === s ? 'ring-2 ring-[var(--accent)] bg-[var(--accent)]/10' : 'hover:bg-[var(--border)]/50'
						}`}>
							<input 
								type="radio" 
								name="status" 
								className="sr-only" 
								checked={value.status === s} 
								onChange={() => set('status', s as any)} 
							/>
							{s.replace('_', ' ')}
						</label>
					))}
				</div>
			</div>

			{/* Priority Filter */}
			<div className="space-y-3">
				<h4 className="text-sm font-medium text-[var(--fg)]">Priority</h4>
				<div className="grid grid-cols-2 gap-2">
					{['all', 'low', 'medium', 'high'].map((p) => (
						<label key={p} className={`chip cursor-pointer transition-all duration-200 ${
							value.priority === p ? 'ring-2 ring-[var(--accent)] bg-[var(--accent)]/10' : 'hover:bg-[var(--border)]/50'
						}`}>
							<input 
								type="radio" 
								name="priority" 
								className="sr-only" 
								checked={value.priority === p} 
								onChange={() => set('priority', p as any)} 
							/>
							{p}
						</label>
					))}
				</div>
			</div>

			{/* Due Date Filter */}
			<div className="space-y-3">
				<h4 className="text-sm font-medium text-[var(--fg)] flex items-center gap-2">
					<Calendar size={16} />
					Due Date
				</h4>
				<div className="grid grid-cols-2 gap-2">
					{[
						{ k: 'all', l: 'All' },
						{ k: 'overdue', l: 'Overdue' },
						{ k: 'today', l: 'Today' },
						{ k: 'this_week', l: 'This Week' },
						{ k: 'no_due', l: 'No Due' },
					].map((d) => (
						<label key={d.k} className={`chip cursor-pointer transition-all duration-200 ${
							value.due === d.k ? 'ring-2 ring-[var(--accent)] bg-[var(--accent)]/10' : 'hover:bg-[var(--border)]/50'
						}`}>
							<input 
								type="radio" 
								name="due" 
								className="sr-only" 
								checked={value.due === (d.k as any)} 
								onChange={() => set('due', d.k as any)} 
							/>
							{d.l}
						</label>
					))}
				</div>
			</div>

			{/* Tags Filter */}
			<div className="space-y-3">
				<h4 className="text-sm font-medium text-[var(--fg)] flex items-center gap-2">
					<Tag size={16} />
					Tags
				</h4>
				<div className="flex flex-wrap gap-2">
					{allTags.map((t) => (
						<button 
							key={t} 
							className={`chip transition-all duration-200 ${
								value.tags.includes(t) 
									? 'ring-2 ring-[var(--accent)] bg-[var(--accent)]/10' 
									: 'hover:bg-[var(--border)]/50'
							}`} 
							onClick={() => toggleTag(t)} 
							type="button"
						>
							{t}
						</button>
					))}
				</div>
			</div>

			{/* Sort Options */}
			<div className="space-y-3">
				<h4 className="text-sm font-medium text-[var(--fg)] flex items-center gap-2">
					<SortAsc size={16} />
					Sort By
				</h4>
				<select 
					className="input cursor-pointer" 
					value={value.sort} 
					onChange={(e) => set('sort', e.target.value as any)}
				>
					<option value="due_asc">Due date (earliest first)</option>
					<option value="due_desc">Due date (latest first)</option>
					<option value="priority">Priority (high to low)</option>
					<option value="created">Created (newest first)</option>
					<option value="updated">Updated (recent first)</option>
				</select>
			</div>

			{/* Clear Filters */}
			{(value.status !== 'all' || value.priority !== 'all' || value.due !== 'all' || value.tags.length > 0) && (
				<button
					className="btn btn-ghost w-full text-sm"
					onClick={() => onChange({ ...value, status: 'all', priority: 'all', due: 'all', tags: [] })}
				>
					Clear all filters
				</button>
			)}
		</aside>
	);
}


