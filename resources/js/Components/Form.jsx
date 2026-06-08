const fieldBase = 'input-themed rounded-2xl px-4 py-3 text-sm outline-none transition';

export function Input({ className = '', ...props }) {
    return <input className={`${fieldBase} ${className}`} {...props} />;
}

export function Textarea({ className = '', ...props }) {
    return <textarea className={`${fieldBase} min-h-28 ${className}`} {...props} />;
}

export function Select({ className = '', children, ...props }) {
    return (
        <select className={`select-themed ${fieldBase} ${className}`} {...props}>
            {children}
        </select>
    );
}

export function Checkbox({ className = '', label, ...props }) {
    return (
        <label className={`flex cursor-pointer items-center gap-3 text-sm text-muted ${className}`}>
            <input type="checkbox" className="checkbox-themed h-4 w-4 rounded" {...props} />
            {label}
        </label>
    );
}
