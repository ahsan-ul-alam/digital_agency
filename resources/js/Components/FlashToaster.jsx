import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePage } from '../app';
import { RiCheckboxCircleLine, RiCloseLine, RiErrorWarningLine } from 'react-icons/ri';

let nextId = 0;

function ToastItem({ toast, onDismiss }) {
    const [visible, setVisible] = useState(false);
    const Icon = toast.type === 'error' ? RiErrorWarningLine : RiCheckboxCircleLine;

    useEffect(() => {
        const enter = requestAnimationFrame(() => setVisible(true));
        const timer = setTimeout(() => onDismiss(toast.id), 5000);

        return () => {
            cancelAnimationFrame(enter);
            clearTimeout(timer);
        };
    }, [toast.id, onDismiss]);

    function dismiss() {
        setVisible(false);
        setTimeout(() => onDismiss(toast.id), 180);
    }

    return (
        <div
            className={`app-toast app-toast-${toast.type}${visible ? ' is-visible' : ''}`}
            role="status"
            aria-live="polite"
        >
            <span className="app-toast-icon"><Icon /></span>
            <p className="app-toast-message">{toast.message}</p>
            <button type="button" className="app-toast-close" onClick={dismiss} aria-label="Dismiss">
                <RiCloseLine />
            </button>
        </div>
    );
}

export default function FlashToaster() {
    const { flash, url } = usePage().props;
    const [toasts, setToasts] = useState([]);
    const seen = useRef({ success: null, error: null });
    const isAdmin = String(url || '').startsWith('/admin');

    useEffect(() => {
        if (!flash?.success) seen.current.success = null;
        if (!flash?.error) seen.current.error = null;

        const incoming = [];

        if (flash?.success && flash.success !== seen.current.success) {
            incoming.push({ id: ++nextId, type: 'success', message: flash.success });
            seen.current.success = flash.success;
        }

        if (flash?.error && flash.error !== seen.current.error) {
            incoming.push({ id: ++nextId, type: 'error', message: flash.error });
            seen.current.error = flash.error;
        }

        if (incoming.length) {
            setToasts((current) => [...current, ...incoming]);
        }
    }, [flash?.success, flash?.error]);

    function dismiss(id) {
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }

    if (!toasts.length) return null;

    return createPortal(
        <div className={`app-toast-stack${isAdmin ? ' is-admin' : ''}`}>
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
            ))}
        </div>,
        document.body,
    );
}
