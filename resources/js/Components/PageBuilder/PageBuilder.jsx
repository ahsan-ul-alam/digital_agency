import { useEffect, useMemo, useState } from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import {
    RiAddLine,
    RiArrowDownLine,
    RiArrowUpLine,
    RiDeleteBinLine,
    RiDragMove2Line,
    RiFileCopyLine,
    RiLayoutGridLine,
    RiLayoutTopLine,
    RiQuestionLine,
    RiSeparator,
    RiSpace,
    RiSparklingLine,
    RiStackLine,
    RiImageLine,
    RiMegaphoneLine,
    RiArticleLine,
    RiBarChartBoxLine,
    RiHeading,
    RiText,
    RiCursorLine,
    RiFilmLine,
    RiMapPinLine,
    RiFileList2Line,
    RiSlideshowLine,
} from 'react-icons/ri';
import PageSection from './PageSection';
import ElementInspector from './ElementInspector';
import { BLOCK_CATEGORIES, BLOCK_LIBRARY, createBlock, getBlockDefinition, normalizeSections } from './blocks';

const blockIcons = {
    heading: RiHeading,
    text: RiText,
    button: RiCursorLine,
    image: RiImageLine,
    video: RiFilmLine,
    hero: RiLayoutTopLine,
    content: RiArticleLine,
    tabs: RiFileList2Line,
    carousel: RiSlideshowLine,
    features: RiStackLine,
    gallery: RiImageLine,
    cta: RiMegaphoneLine,
    faq: RiQuestionLine,
    testimonials: RiSparklingLine,
    stats: RiBarChartBoxLine,
    counter: RiBarChartBoxLine,
    form: RiFileList2Line,
    map: RiMapPinLine,
    spacer: RiSpace,
    divider: RiSeparator,
};

function DropZone({ index, onDropType, active }) {
    return (
        <div
            className={`page-builder-dropzone ${active ? 'is-active' : ''}`}
            onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = 'copy';
            }}
            onDrop={(event) => {
                event.preventDefault();
                const type = event.dataTransfer.getData('application/x-block-type');
                if (type) {
                    onDropType(type, index);
                }
            }}
        >
            Drop element here
        </div>
    );
}

function CanvasItem({ block, selected, onSelect, onMoveUp, onMoveDown, onDuplicate, onDelete, dragControls, formsByShortcode }) {
    const definition = getBlockDefinition(block.type);
    const Icon = blockIcons[block.type] || RiLayoutGridLine;

    return (
        <div className={`page-builder-canvas-item ${selected ? 'is-selected' : ''}`} onClick={onSelect}>
            <div className="page-builder-canvas-toolbar">
                <button type="button" className="drag-handle" onPointerDown={(event) => dragControls.start(event)}>
                    <RiDragMove2Line />
                </button>
                <div className="flex items-center gap-2 text-sm font-semibold">
                    <Icon className="text-primary" />
                    {definition.label}
                </div>
                <div className="ml-auto flex items-center gap-1">
                    <button type="button" onClick={(event) => { event.stopPropagation(); onMoveUp(); }} title="Move up">
                        <RiArrowUpLine />
                    </button>
                    <button type="button" onClick={(event) => { event.stopPropagation(); onMoveDown(); }} title="Move down">
                        <RiArrowDownLine />
                    </button>
                    <button type="button" onClick={(event) => { event.stopPropagation(); onDuplicate(); }} title="Duplicate">
                        <RiFileCopyLine />
                    </button>
                    <button type="button" onClick={(event) => { event.stopPropagation(); onDelete(); }} title="Delete" className="text-rose-300">
                        <RiDeleteBinLine />
                    </button>
                </div>
            </div>
            <div className="page-builder-canvas-preview">
                <PageSection section={block} preview formsByShortcode={formsByShortcode} />
            </div>
        </div>
    );
}

function SortableCanvasItem(props) {
    const dragControls = useDragControls();

    return (
        <Reorder.Item value={props.block} dragListener={false} dragControls={dragControls} className="list-none">
            <CanvasItem {...props} dragControls={dragControls} />
        </Reorder.Item>
    );
}

export default function PageBuilder({ value, onChange, forms = [] }) {
    const [sections, setSections] = useState(() => normalizeSections(value));
    const [selectedId, setSelectedId] = useState(sections[0]?.id || null);
    const [activeTab, setActiveTab] = useState('content');
    const [draggingType, setDraggingType] = useState(null);

    const formsByShortcode = useMemo(
        () => Object.fromEntries(forms.map((form) => [form.shortcode, form])),
        [forms],
    );

    useEffect(() => {
        setSections(normalizeSections(value));
    }, [value]);

    const selectedBlock = useMemo(
        () => sections.find((section) => section.id === selectedId) || null,
        [sections, selectedId],
    );

    function commit(nextSections) {
        const normalized = normalizeSections(nextSections);
        setSections(normalized);
        onChange(normalized);
    }

    function insertBlock(type, index = sections.length) {
        const block = createBlock(type);
        const nextSections = [...sections];
        nextSections.splice(index, 0, block);
        commit(nextSections);
        setSelectedId(block.id);
        setActiveTab('content');
    }

    function updateBlock(id, updater) {
        commit(sections.map((section) => (section.id === id ? updater(section) : section)));
    }

    function moveBlock(id, direction) {
        const index = sections.findIndex((section) => section.id === id);
        if (index < 0) return;

        const target = direction === 'up' ? index - 1 : index + 1;
        if (target < 0 || target >= sections.length) return;

        const nextSections = [...sections];
        [nextSections[index], nextSections[target]] = [nextSections[target], nextSections[index]];
        commit(nextSections);
    }

    function duplicateBlock(id) {
        const index = sections.findIndex((section) => section.id === id);
        if (index < 0) return;

        const copy = {
            ...structuredClone(sections[index]),
            id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        };
        const nextSections = [...sections];
        nextSections.splice(index + 1, 0, copy);
        commit(nextSections);
        setSelectedId(copy.id);
    }

    function removeBlock(id) {
        const nextSections = sections.filter((section) => section.id !== id);
        commit(nextSections);
        if (selectedId === id) {
            setSelectedId(nextSections[0]?.id || null);
        }
    }

    return (
        <div className="page-builder">
            <aside className="page-builder-panel page-builder-sidebar page-builder-sidebar-left">
                <div className="page-builder-panel-header shrink-0">
                    <h3>Elements</h3>
                    <p>Drag onto the canvas or click to add.</p>
                </div>
                <div className="page-builder-library min-h-0 flex-1">
                    {BLOCK_CATEGORIES.map((category) => (
                        <div key={category} className="mb-4">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted">{category}</p>
                            <div className="grid gap-2">
                                {BLOCK_LIBRARY.filter((block) => block.category === category).map((block) => {
                                    const Icon = blockIcons[block.type] || RiLayoutGridLine;
                                    return (
                                        <button
                                            key={block.type}
                                            type="button"
                                            className="page-builder-library-item"
                                            draggable
                                            onDragStart={(event) => {
                                                event.dataTransfer.setData('application/x-block-type', block.type);
                                                event.dataTransfer.effectAllowed = 'copy';
                                                setDraggingType(block.type);
                                            }}
                                            onDragEnd={() => setDraggingType(null)}
                                            onClick={() => insertBlock(block.type)}
                                        >
                                            <span className="page-builder-library-icon shrink-0"><Icon /></span>
                                            <span className="page-builder-library-copy min-w-0 flex-1">
                                                <span className="block truncate text-sm font-semibold">{block.label}</span>
                                                <span className="mt-1 block text-xs leading-5 text-muted">{block.description}</span>
                                            </span>
                                            <RiAddLine className="shrink-0 text-primary" />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </aside>

            <section className="page-builder-canvas">
                <div className="page-builder-panel-header">
                    <h3>Canvas</h3>
                    <p>{sections.length} element{sections.length === 1 ? '' : 's'}</p>
                </div>

                {sections.length === 0 ? (
                    <DropZone
                        index={0}
                        active={Boolean(draggingType)}
                        onDropType={(type) => insertBlock(type, 0)}
                    />
                ) : (
                    <div className="grid gap-3">
                        <DropZone
                            index={0}
                            active={Boolean(draggingType)}
                            onDropType={(type) => insertBlock(type, 0)}
                        />
                        <Reorder.Group axis="y" values={sections} onReorder={commit} className="grid gap-3">
                            {sections.map((block, index) => (
                                <div key={block.id} className="grid gap-3">
                                    <SortableCanvasItem
                                        block={block}
                                        formsByShortcode={formsByShortcode}
                                        selected={selectedId === block.id}
                                        onSelect={() => {
                                            setSelectedId(block.id);
                                            setActiveTab('content');
                                        }}
                                        onMoveUp={() => moveBlock(block.id, 'up')}
                                        onMoveDown={() => moveBlock(block.id, 'down')}
                                        onDuplicate={() => duplicateBlock(block.id)}
                                        onDelete={() => removeBlock(block.id)}
                                    />
                                    <DropZone
                                        index={index + 1}
                                        active={Boolean(draggingType)}
                                        onDropType={(type) => insertBlock(type, index + 1)}
                                    />
                                </div>
                            ))}
                        </Reorder.Group>
                    </div>
                )}
            </section>

            <aside className="page-builder-panel page-builder-sidebar page-builder-sidebar-right">
                <div className="page-builder-panel-header shrink-0">
                    <h3>Inspector</h3>
                    <p>Content and style controls</p>
                </div>
                <ElementInspector
                    block={selectedBlock}
                    forms={forms}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    onUpdate={(key, value) => {
                        if (!selectedBlock) return;
                        updateBlock(selectedBlock.id, (section) => ({ ...section, [key]: value }));
                    }}
                    onUpdateStyle={(key, value) => {
                        if (!selectedBlock) return;
                        updateBlock(selectedBlock.id, (section) => ({
                            ...section,
                            styles: { ...(section.styles || {}), [key]: value },
                        }));
                    }}
                />
            </aside>
        </div>
    );
}
