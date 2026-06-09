import './bootstrap';
import '../css/app.css';

import { createInertiaApp, Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import React from 'react';
import FlashToaster from './Components/FlashToaster';

const pages = import.meta.glob('./Pages/**/*.jsx');

createInertiaApp({
    title: (title) => title ? `${title} | AR Soft BD` : 'AR Soft BD',
    resolve: (name) => pages[`./Pages/${name}.jsx`](),
    setup({ el, App, props }) {
        createRoot(el).render(
            React.createElement(App, props, ({ Component, props: pageProps, key }) =>
                React.createElement(React.Fragment, null,
                    React.createElement(Component, { ...pageProps, key }),
                    React.createElement(FlashToaster),
                ),
            ),
        );
    },
    progress: { color: document.querySelector('meta[name="theme-primary"]')?.content || '' },
});

export { Head, Link, router, useForm, usePage };
