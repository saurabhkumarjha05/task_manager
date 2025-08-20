import { formatDistanceToNowStrict, isToday as isTodayFn, isThisWeek as isThisWeekFn, isPast, parseISO } from 'date-fns';

export function isOverdue(iso?: string): boolean {
	if (!iso) return false;
	const d = parseISO(iso);
	return isPast(d) && !isTodayFn(d);
}

export function isToday(iso?: string): boolean {
	if (!iso) return false;
	return isTodayFn(parseISO(iso));
}

export function isThisWeek(iso?: string): boolean {
	if (!iso) return false;
	return isThisWeekFn(parseISO(iso));
}

export function formatDueLabel(iso?: string): string {
	if (!iso) return 'No due date';
	const d = parseISO(iso);
	const rel = formatDistanceToNowStrict(d, { addSuffix: true });
	return rel;
}


