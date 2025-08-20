import { useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

export function SearchBar() {
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		function onSlash(e: KeyboardEvent) {
			if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
				e.preventDefault();
				inputRef.current?.focus();
			}
		}
		window.addEventListener('keydown', onSlash);
		return () => window.removeEventListener('keydown', onSlash);
	}, []);

	const setQuery = (q: string) => {
		// Search is lifted to App via props in real app; here we dispatch custom event
		window.dispatchEvent(new CustomEvent('tm:search', { detail: q }));
	};

	return (
		<div className="relative">
			<Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--muted)]" />
			<input
				ref={inputRef}
				className="search-input"
				placeholder="Search tasks... (Press / to focus)"
				onChange={(e) => setQuery(e.target.value)}
				aria-label="Search tasks"
			/>
		</div>
	);
}


