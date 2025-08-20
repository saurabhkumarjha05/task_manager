import { X } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Task } from '../types';
import { SubtasksEditor } from './SubtasksEditor';
import { TagInput } from './TagInput';

const schema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().optional(),
	dueDate: z.string().optional(),
	priority: z.enum(['low', 'medium', 'high']),
	status: z.enum(['todo', 'in_progress', 'done']),
	tags: z.array(z.string()),
	subtasks: z.array(z.object({ id: z.string(), title: z.string(), done: z.boolean() })),
});

export type TaskFormValues = z.infer<typeof schema>;

export function TaskFormModal({ open, onClose, onSubmit, initial, tagSuggestions }: {
	open: boolean;
	onClose: () => void;
	onSubmit: (values: TaskFormValues) => void;
	initial?: Task;
	tagSuggestions: string[];
}) {
	const defaults: TaskFormValues = initial
		? {
				title: initial.title,
				description: initial.description ?? '',
				dueDate: initial.dueDate ? initial.dueDate.slice(0, 10) : undefined,
				priority: initial.priority,
				status: initial.status,
				tags: initial.tags,
				subtasks: initial.subtasks,
			}
		: {
				title: '',
				description: '',
				dueDate: undefined,
				priority: 'medium',
				status: 'todo',
				tags: [],
				subtasks: [],
			};
	const methods = useForm<TaskFormValues>({
		resolver: zodResolver(schema),
		defaultValues: defaults,
	});

	if (!open) return null;

	return (
		<div 
			role="dialog" 
			aria-modal 
			className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" 
			onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
		>
			{/* Backdrop */}
			<div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
			
			{/* Modal Container */}
			<div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-[var(--card)] rounded-xl shadow-2xl border border-[var(--border)]">
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-[var(--border)] bg-[var(--card)] sticky top-0 z-10">
					<h2 className="text-xl font-semibold text-[var(--fg)]">
						{initial ? 'Edit Task' : 'New Task'}
					</h2>
					<button 
						className="btn btn-ghost p-2 rounded-full hover:bg-[var(--border)]" 
						onClick={onClose} 
						aria-label="Close"
					>
						<X size={20} />
					</button>
				</div>

				{/* Form Content - Scrollable */}
				<div className="overflow-y-auto max-h-[calc(90vh-80px)]">
					<FormProvider {...methods}>
						<form
							onSubmit={methods.handleSubmit((v) => onSubmit(v))}
							className="p-6 space-y-6"
						>
							{/* Title - Full Width */}
							<div className="space-y-2">
								<label className="label">Title *</label>
								<input 
									className="input" 
									{...methods.register('title')} 
									placeholder="Enter task title..."
									aria-invalid={!!methods.formState.errors.title} 
								/>
								{methods.formState.errors.title && (
									<p className="text-sm text-red-600">{methods.formState.errors.title.message}</p>
								)}
							</div>

							{/* Description - Full Width */}
							<div className="space-y-2">
								<label className="label">Description</label>
								<textarea 
									className="textarea" 
									{...methods.register('description')} 
									placeholder="Enter task description (optional)..."
								/>
							</div>

							{/* Two Column Layout for Desktop */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{/* Due Date */}
								<div className="space-y-2">
									<label className="label">Due Date</label>
									<input 
										type="date" 
										className="input" 
										{...methods.register('dueDate')} 
									/>
								</div>

								{/* Priority */}
								<div className="space-y-2">
									<label className="label">Priority</label>
									<select className="input" {...methods.register('priority')}>
										<option value="low">Low</option>
										<option value="medium">Medium</option>
										<option value="high">High</option>
									</select>
								</div>
							</div>

							{/* Status - Full Width */}
							<div className="space-y-2">
								<label className="label">Status</label>
								<select className="input" {...methods.register('status')}>
									<option value="todo">Todo</option>
									<option value="in_progress">In Progress</option>
									<option value="done">Done</option>
								</select>
							</div>

							{/* Tags - Full Width */}
							<div className="space-y-2">
								<label className="label">Tags</label>
								<TagInput 
									value={methods.watch('tags')} 
									onChange={(tags) => methods.setValue('tags', tags, { shouldDirty: true })} 
									suggestions={tagSuggestions} 
								/>
							</div>

							{/* Subtasks - Full Width */}
							<div className="space-y-2">
								<label className="label">Subtasks</label>
								<SubtasksEditor />
							</div>

							{/* Action Buttons */}
							<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
								<button 
									type="button" 
									className="btn btn-ghost flex-1 sm:flex-none" 
									onClick={onClose}
								>
									Cancel
								</button>
								<button 
									type="submit" 
									className="btn btn-primary flex-1 sm:flex-none"
								>
									{initial ? 'Update Task' : 'Create Task'}
								</button>
							</div>
						</form>
					</FormProvider>
				</div>
			</div>
		</div>
	);
}


