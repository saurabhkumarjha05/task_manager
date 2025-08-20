import { FilterState } from '../lib/filters';

export function FilterChips({ filters, clearTag }: { filters: FilterState; clearTag: (tag: string) => void }) {
	if (filters.tags.length === 0 && !filters.query && filters.status === 'all' && filters.priority === 'all' && filters.due === 'all') return null;
	return (
		<div className="flex flex-wrap gap-2 text-xs">
			{filters.query && <span className="chip">Search: {filters.query}</span>}
			{filters.status !== 'all' && <span className="chip">Status: {filters.status}</span>}
			{filters.priority !== 'all' && <span className="chip">Priority: {filters.priority}</span>}
			{filters.due !== 'all' && <span className="chip">Due: {filters.due}</span>}
			{filters.tags.map((t) => (
				<span key={t} className="chip">Tag: {t} <button className="ml-1" onClick={() => clearTag(t)} aria-label={`Remove tag ${t}`}>×</button></span>
			))}
		</div>
	);
}


