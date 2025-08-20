import { Download, Upload } from 'lucide-react';
import { useRef } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { download, exportJson, safeParseImport } from '../lib/storage';

export function ImportExport() {
	const fileRef = useRef<HTMLInputElement>(null);
	const exportData = useTaskStore((s) => s.exportData);
	const importData = useTaskStore((s) => s.importData);

	function onExport() {
		const json = exportJson(exportData());
		download('tasks.json', json);
	}

	function onImportFile(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			const text = String(reader.result);
			const data = safeParseImport(text);
			if (data) importData(data);
		};
		reader.readAsText(file);
		// reset
		e.currentTarget.value = '';
	}

	return (
		<div className="flex items-center gap-2">
			<button className="btn" onClick={onExport} aria-label="Export tasks"><Download size={16} /></button>
			<button className="btn" onClick={() => fileRef.current?.click()} aria-label="Import tasks"><Upload size={16} /></button>
			<input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={onImportFile} />
		</div>
	);
}


