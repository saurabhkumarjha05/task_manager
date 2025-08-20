import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
	const [dark, setDark] = useState(false);

	useEffect(() => {
		const stored = localStorage.getItem('theme');
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		const isDark = stored ? stored === 'dark' : prefersDark;
		setDark(isDark);
		document.documentElement.classList.toggle('dark', isDark);
	}, []);

	function toggle() {
		const next = !dark;
		setDark(next);
		document.documentElement.classList.toggle('dark', next);
		localStorage.setItem('theme', next ? 'dark' : 'light');
	}

	return (
		<button className="btn" onClick={toggle} aria-label="Toggle theme">
			{dark ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
		</button>
	);
}


