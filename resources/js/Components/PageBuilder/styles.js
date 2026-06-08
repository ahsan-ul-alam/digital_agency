const paddingMap = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12',
};

const backgroundMap = {
    none: '',
    subtle: 'panel-subtle',
    glass: 'glass',
    muted: 'panel-muted',
    primary: 'border border-primary bg-primary/10',
    gradient: 'cta-surface',
};

export const radiusMap = {
    none: 'rounded-none',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-[2.5rem]',
};

const maxWidthMap = {
    full: 'max-w-none',
    wide: 'max-w-5xl mx-auto',
    narrow: 'max-w-3xl mx-auto',
};

const gapMap = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
};

const columnMap = {
    1: 'grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
};

const spacerMap = {
    sm: 'h-8',
    md: 'h-16',
    lg: 'h-24',
    xl: 'h-32',
};

export function wrapperClasses(styles = {}) {
    return [
        paddingMap[styles.padding] || paddingMap.lg,
        backgroundMap[styles.background] || '',
        radiusMap[styles.borderRadius] || radiusMap['3xl'],
        maxWidthMap[styles.maxWidth] || '',
    ].filter(Boolean).join(' ');
}

export function wrapperStyle(styles = {}) {
    if (!styles.textAlign) {
        return undefined;
    }

    return { textAlign: styles.textAlign };
}

export function gridClasses(styles = {}, fallbackColumns = 3) {
    const columns = styles.columns || String(fallbackColumns);
    return ['grid', columnMap[columns] || columnMap[fallbackColumns], gapMap[styles.gap] || gapMap.md].join(' ');
}

export function spacerClass(styles = {}) {
    return spacerMap[styles.height] || spacerMap.lg;
}
