import { useMemo, useState } from 'react';
import { RiArrowDownSLine, RiArrowUpSLine, RiDownloadLine, RiSearchLine } from 'react-icons/ri';

export default function DataTable({
    columns,
    rows,
    columnLabels = {},
    renderCell,
    actions,
    emptyState,
    exportFileName = 'export',
}) {
    const [query, setQuery] = useState('');
    const [sortKey, setSortKey] = useState(null);
    const [sortDir, setSortDir] = useState('asc');
    const [visibleColumns, setVisibleColumns] = useState(columns);
    const [selected, setSelected] = useState([]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        let data = rows;
        if (q) {
            data = data.filter((row) =>
                columns.some((column) => String(row[column] ?? '').toLowerCase().includes(q))
            );
        }
        if (sortKey) {
            data = [...data].sort((a, b) => {
                const left = a[sortKey];
                const right = b[sortKey];
                if (left === right) return 0;
                if (left == null) return 1;
                if (right == null) return -1;
                return String(left).localeCompare(String(right), undefined, { numeric: true }) * (sortDir === 'asc' ? 1 : -1);
            });
        }
        return data;
    }, [rows, columns, query, sortKey, sortDir]);

    function toggleSort(column) {
        if (sortKey === column) {
            setSortDir((dir) => (dir === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(column);
            setSortDir('asc');
        }
    }

    function toggleColumn(column) {
        setVisibleColumns((current) =>
            current.includes(column) && current.length > 1
                ? current.filter((entry) => entry !== column)
                : current.includes(column)
                    ? current
                    : [...current, column]
        );
    }

    function toggleAll(checked) {
        setSelected(checked ? filtered.map((row) => row.id) : []);
    }

    function exportCsv() {
        const header = visibleColumns.map((column) => columnLabels[column] || column).join(',');
        const body = filtered.map((row) =>
            visibleColumns.map((column) => `"${String(row[column] ?? '').replace(/"/g, '""')}"`).join(',')
        ).join('\n');
        const blob = new Blob([[header, body].join('\n')], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${exportFileName}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
    }

    if (rows.length === 0) return emptyState;

    return (
        <div className="admin-datatable">
            <div className="admin-datatable-toolbar">
                <label className="admin-datatable-search">
                    <RiSearchLine />
                    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search records..." />
                </label>
                <div className="admin-datatable-tools">
                    <details className="admin-datatable-menu">
                        <summary>Columns</summary>
                        <div className="admin-datatable-menu-panel">
                            {columns.map((column) => (
                                <label key={column}>
                                    <input
                                        type="checkbox"
                                        checked={visibleColumns.includes(column)}
                                        onChange={() => toggleColumn(column)}
                                    />
                                    {columnLabels[column] || column}
                                </label>
                            ))}
                        </div>
                    </details>
                    <button type="button" className="admin-datatable-tool" onClick={exportCsv}>
                        <RiDownloadLine /> Export
                    </button>
                </div>
            </div>

            {selected.length > 0 && (
                <div className="admin-datatable-bulk">
                    <span>{selected.length} selected</span>
                    <button type="button" onClick={() => setSelected([])}>Clear</button>
                </div>
            )}

            <div className="admin-datatable-scroll">
                <table>
                    <thead>
                        <tr>
                            <th className="admin-datatable-check">
                                <input
                                    type="checkbox"
                                    checked={selected.length > 0 && selected.length === filtered.length}
                                    onChange={(e) => toggleAll(e.target.checked)}
                                />
                            </th>
                            {visibleColumns.map((column) => (
                                <th key={column}>
                                    <button type="button" className="admin-datatable-sort" onClick={() => toggleSort(column)}>
                                        {columnLabels[column] || column}
                                        {sortKey === column && (sortDir === 'asc' ? <RiArrowUpSLine /> : <RiArrowDownSLine />)}
                                    </button>
                                </th>
                            ))}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={visibleColumns.length + 2} className="admin-datatable-empty-row">
                                    No records match your search.
                                </td>
                            </tr>
                        ) : filtered.map((row) => (
                            <tr key={row.id} className={selected.includes(row.id) ? 'is-selected' : ''}>
                                <td className="admin-datatable-check">
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(row.id)}
                                        onChange={(e) => setSelected((current) =>
                                            e.target.checked ? [...current, row.id] : current.filter((id) => id !== row.id)
                                        )}
                                    />
                                </td>
                                {visibleColumns.map((column) => (
                                    <td key={column}>
                                        {renderCell ? renderCell(row, column) : (row[column] ?? '—')}
                                    </td>
                                ))}
                                <td className="admin-datatable-actions">{actions(row)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="admin-datatable-footer">
                <span>{filtered.length} of {rows.length} records</span>
            </div>
        </div>
    );
}
