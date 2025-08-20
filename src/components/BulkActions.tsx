import { useState } from 'react';

export function BulkActions({ count, onChangeStatus, onChangePriority, onDelete }: {
	count: number;
	onChangeStatus: (status: 'todo' | 'in_progress' | 'done') => void;
	onChangePriority: (priority: 'low' | 'medium' | 'high') => void;
	onDelete: () => void;
}) {
	const [status, setStatus] = useState<'todo' | 'in_progress' | 'done'>('todo');
	const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
	if (count === 0) return null;
	return (
		<div className="card p-3 flex flex-wrap items-center gap-3">
			<span className="text-sm">{count} selected</span>
			<div className="flex items-center gap-2">
				<select className="input" value={status} onChange={(e) => setStatus(e.target.value as any)}>
					<option value="todo">Todo</option>
					<option value="in_progress">In Progress</option>
					<option value="done">Done</option>
				</select>
				<button className="btn" onClick={() => onChangeStatus(status)}>Set Status</button>
			</div>
			<div className="flex items-center gap-2">
				<select className="input" value={priority} onChange={(e) => setPriority(e.target.value as any)}>
					<option value="low">Low</option>
					<option value="medium">Medium</option>
					<option value="high">High</option>
				</select>
				<button className="btn" onClick={() => onChangePriority(priority)}>Set Priority</button>
			</div>
			<button className="btn" onClick={onDelete}>Delete</button>
		</div>
	);
}


