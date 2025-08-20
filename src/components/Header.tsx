import { ImportExport } from './ImportExport';
import { SearchBar } from './SearchBar';
import { ThemeToggle } from './ThemeToggle';
import { Plus, Search } from 'lucide-react';

export function Header({ onNew }: { onNew: () => void }) {
	return (
		<header className="header">
			<div className="container flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4">
				{/* Logo and Title */}
				<div className="flex items-center gap-3 w-full sm:w-auto">
					<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
						<span className="text-white font-bold text-sm">TM</span>
					</div>
					<h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
						Task Manager
					</h1>
				</div>

				{/* Search Bar - Full width on mobile */}
				<div className="search-container w-full sm:w-auto">
					<SearchBar />
				</div>

				{/* Action Buttons */}
				<div className="flex items-center gap-2 w-full sm:w-auto justify-end">
					<button 
						className="btn btn-primary hover-lift flex-1 sm:flex-none" 
						onClick={onNew} 
						aria-label="Create new task"
					>
						<Plus size={18} className="mr-2" />
						<span className="hidden sm:inline">New Task</span>
						<span className="sm:hidden">New</span>
					</button>
					<ThemeToggle />
					<ImportExport />
				</div>
			</div>
		</header>
	);
}


