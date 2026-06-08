import { Node, mergeAttributes } from '@tiptap/core';

export const Callout = Node.create({
    name: 'callout',
    group: 'block',
    content: 'block+',
    defining: true,

    addAttributes() {
        return {
            type: {
                default: 'info',
                parseHTML: (element) => element.getAttribute('data-type') || 'info',
                renderHTML: (attributes) => ({ 'data-type': attributes.type }),
            },
        };
    },

    parseHTML() {
        return [{ tag: 'div[data-callout]' }];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-callout': '', class: `rte-callout rte-callout-${HTMLAttributes['data-type'] || 'info'}` }), 0];
    },

    addCommands() {
        return {
            setCallout: (type = 'info') => ({ commands }) => commands.insertContent({
                type: this.name,
                attrs: { type },
                content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Add your callout message here.' }] }],
            }),
        };
    },
});
