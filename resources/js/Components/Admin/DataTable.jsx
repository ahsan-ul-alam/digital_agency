import { useEffect, useMemo, useRef, useState } from 'react';
import { RiArrowDownSLine, RiArrowUpSLine, RiBookmarkLine, RiDeleteBinLine, RiDownloadLine, RiFilter3Line, RiSearchLine } from 'react-icons/ri';

const FILTERABLE = {
    is_active: { label: 'Active', values: [['yes', 'Active'], ['no', 'Inactive']] },
    is_featured: { label: 'Featured', values: [['yes', 'Featured'], ['no', 'Not featured']] },
    is_highlighted: { label: 'Highlighted', values: [['yes', 'Highlighted'], ['no', 'Standard']] },
    is_published: { label: 'Published', values: [['yes', 'Published'], ['no', 'Draft']] },
    status: { label: 'Status', values: [['published', 'Published'], ['draft', 'Draft'], ['scheduled', 'Scheduled']] },
    read_at: { label: 'Read', values: [['unread', 'Unread'], ['read', 'Read']] },
};

function loadViews(tableId) {
    if (!tableId || typeof window === 'undefined') return [];
    try {
        return JSON.parse(localStorage.getItem(`admin-table-views:${tableId}`) || '[]');
    } catch {
        return [];
    }
}

function saveViews(tableId, views) {
    if (!tableId || typeof window === 'undefined') return;
    localStorage.setItem(`admin-table-views:${tableId}`, JSON.stringify(views));
}

function matchesFilter(row, column, value) {
    const raw = row[column];
    if (column === 'read_at') {
        return value === 'unread' ? !raw : Boolean(raw);
    }
    if (typeof raw === 'boolean') {
        return value === 'yes' ? raw : !raw;
    }
    return String(raw ?? '').toLowerCase() === String(value).toLowerCase();
}

export default function DataTable({
    columns,
    rows,
    columnLabels = {},
    renderCell,
    actions,
    emptyState,
    exportFileName = 'export',
    onBulkDelete,
    canSelectRow = () => true,
    bulkDeleteLabel = 'Delete selected',
    tableId,
    quickEditHref,
}) {
    const [query, setQuery] = useState('');
    const [sortKey, setSortKey] = useState(null);
    const [sortDir, setSortDir] = useState('asc');
    const [visibleColumns, setVisibleColumns] = useState(columns);
    const [selected, setSelected] = useState([]);
    const [filters, setFilters] = useState({});
    const [savedViews, setSavedViews] = useState(() => loadViews(tableId));
    const [viewName, setViewName] = useState('');
    const selectAllRef = useRef(null);

    const filterColumns = useMemo(
        () => columns.filter((column) => FILTERABLE[column]),
        [columns],
    );

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        let data = rows;

        Object.entries(filters).forEach(([column, value]) => {
            if (!value) return;
            data = data.filter((row) => matchesFilter(row, column, value));
        });

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
    }, [rows, columns, query, sortKey, sortDir, filters]);

    const selectableRows = useMemo(
        () => filtered.filter((row) => canSelectRow(row)),
        [filtered, canSelectRow],
    );

    const selectableIds = useMemo(
        () => selectableRows.map((row) => row.id),
        [selectableRows],
    );

    useEffect(() => {
        setSelected((current) => current.filter((id) => selectableIds.includes(id)));
    }, [selectableIds]);

    useEffect(() => {
        if (!selectAllRef.current) return;
        const allSelected = selectableIds.length > 0 && selected.length === selectableIds.length;
        selectAllRef.current.indeterminate = selected.length > 0 && !allSelected;
    }, [selected, selectableIds]);

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
        setSelected(checked ? selectableIds : []);
    }

    function handleBulkDelete() {
        if (!onBulkDelete || selected.length === 0) return;
        onBulkDelete(selected, () => setSelected([]));
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

    function applyView(view) {
        setQuery(view.query || '');
        setFilters(view.filters || {});
        setSortKey(view.sortKey || null);
        setSortDir(view.sortDir || 'asc');
        setVisibleColumns(view.visibleColumns?.length ? view.visibleColumns : columns);
    }

    function saveCurrentView() {
        const name = viewName.trim();
        if (!name || !tableId) return;
        const view = {
            id: `${Date.now()}`,
            name,
            query,
            filters,
            sortKey,
            sortDir,
            visibleColumns,
        };
        const next = [...savedViews.filter((entry) => entry.name !== name), view];
        setSavedViews(next);
        saveViews(tableId, next);
        setViewName('');
    }

    function deleteView(id) {
        const next = savedViews.filter((entry) => entry.id !== id);
        setSavedViews(next);
        saveViews(tableId, next);
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
                    {tableId && (
                        <details className="admin-datatable-menu">
                            <summary><RiBookmarkLine /> Views</summary>
                            <div className="admin-datatable-menu-panel admin-datatable-views">
                                {savedViews.length === 0 && <p className="admin-datatable-views-empty">No saved views yet.</p>}
                                {savedViews.map((view) => (
                                    <div key={view.id} className="admin-datatable-view-row">
                                        <button type="button" onClick={() => applyView(view)}>{view.name}</button>
                                        <button type="button" className="is-danger" onClick={() => deleteView(view.id)}>×</button>
                                    </div>
                                ))}
                                <div className="admin-datatable-view-save">
                                    <input value={viewName} onChange={(e) => setViewName(e.target.value)} placeholder="Save current view…" />
                                    <button type="button" onClick={saveCurrentView}>Save</button>
                                </div>
                            </div>
                        </details>
                    )}
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

            {filterColumns.length > 0 && (
                <div className="admin-datatable-filters">
                    <span className="admin-datatable-filters-label"><RiFilter3Line /> Filters</span>
                    {filterColumns.map((column) => (
                        <select
                            key={column}
                            value={filters[column] || ''}
                            onChange={(e) => setFilters((current) => ({ ...current, [column]: e.target.value }))}
                            className="admin-datatable-filter"
                        >
                            <option value="">{FILTERABLE[column].label}: All</option>
                            {FILTERABLE[column].values.map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    ))}
                    {Object.values(filters).some(Boolean) && (
                        <button type="button" className="admin-datatable-filter-clear" onClick={() => setFilters({})}>
                            Clear filters
                        </button>
                    )}
                </div>
            )}

            {selected.length > 0 && (
                <div className="admin-datatable-bulk">
                    <span>{selected.length} selected</span>
                    <div className="admin-datatable-bulk-actions">
                        <button type="button" className="admin-datatable-bulk-clear" onClick={() => setSelected([])}>Clear</button>
                        {onBulkDelete && (
                            <button type="button" className="admin-datatable-bulk-delete" onClick={handleBulkDelete}>
                                <RiDeleteBinLine /> {bulkDeleteLabel}
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className="admin-datatable-scroll">
                <table>
                    <thead>
                        <tr>
                            <th className="admin-datatable-check">
                                {selectableIds.length > 0 && (
                                    <input
                                        ref={selectAllRef}
                                        type="checkbox"
                                        checked={selectableIds.length > 0 && selected.length === selectableIds.length}
                                        onChange={(e) => toggleAll(e.target.checked)}
                                    />
                                )}
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
                                    No records match your search or filters.
                                </td>
                            </tr>
                        ) : filtered.map((row) => {
                            const selectable = canSelectRow(row);
                            const editHref = quickEditHref?.(row);
                            return (
                            <tr
                                key={row.id}
                                className={selected.includes(row.id) ? 'is-selected' : ''}
                                onDoubleClick={editHref ? () => { window.location.href = editHref; } : undefined}
                            >
                                <td className="admin-datatable-check">
                                    {selectable ? (
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(row.id)}
                                            onChange={(e) => setSelected((current) =>
                                                e.target.checked ? [...current, row.id] : current.filter((id) => id !== row.id)
                                            )}
                                        />
                                    ) : null}
                                </td>
                                {visibleColumns.map((column) => (
                                    <td key={column}>
                                        {renderCell ? renderCell(row, column) : (row[column] ?? '—')}
                                    </td>
                                ))}
                                <td className="admin-datatable-actions">{actions?.(row)}</td>
                            </tr>
                        );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="admin-datatable-footer">
                <span>{filtered.length} of {rows.length} records</span>
                {quickEditHref && <span className="admin-datatable-hint">Double-click a row to quick edit</span>}
            </div>
        </div>
    );
}
