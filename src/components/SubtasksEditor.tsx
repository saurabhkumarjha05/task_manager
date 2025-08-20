import { PlusCircle, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';

export function SubtasksEditor() {
	const { control, register } = useFormContext();
	const { fields, append, remove } = useFieldArray({ control, name: 'subtasks' });
	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<h4 className="text-sm font-medium">Subtasks</h4>
				<button type="button" className="btn" onClick={() => append({ id: crypto.randomUUID(), title: '', done: false })}><PlusCircle size={16} /> Add</button>
			</div>
			{fields.length === 0 && <p className="text-xs text-gray-500">No subtasks.</p>}
			{fields.map((f, idx) => (
				<div key={f.id} className="flex items-center gap-2">
					<input {...register(`subtasks.${idx}.title` as const)} className="input" placeholder={`Subtask #${idx + 1}`} />
					<button type="button" className="btn" onClick={() => remove(idx)} aria-label="Remove subtask"><Trash2 size={16} /></button>
				</div>
			))}
		</div>
	);
}


