import { useMemo, useState } from 'react';

export function TagInput({ value, onChange, suggestions }: { value: string[]; onChange: (tags: string[]) => void; suggestions: string[] }) {
	const [input, setInput] = useState('');
	const filtered = useMemo(() => suggestions.filter((s) => s.toLowerCase().includes(input.toLowerCase()) && !value.includes(s)).slice(0, 6), [input, suggestions, value]);

	function add(tag: string) {
		const next = Array.from(new Set([...value, tag.trim()])).filter(Boolean);
		onChange(next);
		setInput('');
	}

	function remove(tag: string) {
		onChange(value.filter((t) => t !== tag));
	}

	function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter' && input.trim()) {
			e.preventDefault();
			add(input.trim());
		}
		if (e.key === 'Backspace' && !input && value.length) {
			e.preventDefault();
			onChange(value.slice(0, -1));
		}
	}

	return (
		<div>
			<div className="flex flex-wrap gap-2 mb-2">
				{value.map((t) => (
					<span key={t} className="chip bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300">
						{t}
						<button className="ml-1 text-xs" onClick={() => remove(t)} aria-label={`Remove tag ${t}`}>
							×
						</button>
					</span>
				))}
			</div>
			<input
				className="input"
				value={input}
				placeholder="Add tag and press Enter"
				onChange={(e) => setInput(e.target.value)}
				onKeyDown={onKeyDown}
			/>
			{filtered.length > 0 && (
				<div className="mt-2 flex flex-wrap gap-2">
					{filtered.map((s) => (
						<button key={s} className="chip hover:bg-black/5 dark:hover:bg-white/5" onClick={() => add(s)}>{s}</button>
					))}
				</div>
			)}
		</div>
	);
}


