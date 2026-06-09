import { useRef } from 'react';
import AdminLayout from '../../Layouts/AdminLayout';
import ResourceEditorShell from '../../Components/Admin/ResourceEditorShell';
import { groupSchemaSections, previewUrlForModule } from '../../Admin/resourceTabs';
import HomepagePayloadEditor from '../../Components/Cms/HomepagePayloadEditor';
import RichTextEditor from '../../Components/Cms/RichTextEditor';
import {
    FieldShell,
    ListField,
    MediaField,
    RatingField,
    SeoField,
    SocialField,
    ToggleField,
} from '../../Components/Cms/fields';
import { Input, Select } from '../../Components/Form';
import { Link, useForm } from '../../app';
import { moduleSchemas } from '../../Admin/moduleSchemas';
import { RiLayoutMasonryLine } from 'react-icons/ri';

const hiddenColumns = ['logo_media', 'banner_media', 'image_media', 'photo_media', 'thumbnail_media', 'media', 'metadata', 'cloudinary_public_id', 'secure_url', 'disk', 'sections'];

function slugify(value) {
    return String(value ?? '')
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function prepareInitial(item, schema, columns) {
    const data = {};

    schema.sections.forEach((section) => {
        section.fields.forEach((field) => {
            const value = item?.[field.key];

            switch (field.type) {
                case 'list':
                case 'tags':
                    data[field.key] = Array.isArray(value) ? [...value] : [];
                    break;
                case 'seo':
                case 'social':
                case 'homepage_payload':
                case 'payload':
                    data[field.key] = value && typeof value === 'object' ? { ...value } : {};
                    break;
                case 'toggle':
                    data[field.key] = Boolean(value);
                    break;
                case 'media':
                    data[field.key] = value || '';
                    if (field.mediaKey) data[field.mediaKey] = item?.[field.mediaKey] || null;
                    data[field.key.replace('_path', '_file')] = null;
                    if (field.key === 'file_path') data.upload_file = null;
                    break;
                case 'richtext':
                case 'rating':
                case 'number':
                    data[field.key] = value ?? '';
                    break;
                default:
                    data[field.key] = value ?? '';
            }
        });
    });

    hiddenColumns.forEach((column) => {
        if (columns.includes(column) && !(column in data)) {
            data[column] = item?.[column] ?? null;
        }
    });

    return data;
}

function CmsField({ field, form, module, meta, item, onFieldChange, readOnly = false }) {
    const value = form.data[field.key];
    const error = form.errors[field.key];
    const disabled = readOnly || field.type === 'readonly';

    if (field.type === 'homepage_payload') {
        return (
            <HomepagePayloadEditor
                sectionKey={form.data.section_key}
                value={value}
                onChange={(next) => onFieldChange('payload', next)}
            />
        );
    }

    if (field.type === 'toggle') {
        return (
            <ToggleField
                label={field.label}
                hint={field.hint}
                checked={Boolean(value)}
                onChange={(next) => onFieldChange(field.key, next)}
                error={error}
            />
        );
    }

    if (field.type === 'list' || field.type === 'tags') {
        return (
            <ListField
                label={field.label}
                hint={field.hint}
                items={Array.isArray(value) ? value : []}
                onChange={(next) => onFieldChange(field.key, next)}
                error={error}
            />
        );
    }

    if (field.type === 'seo') {
        const previewUrl = item?.slug ? `https://arsoftbd.com/${module === 'pages' ? '' : `${module}/`}${item.slug}` : '';
        return <SeoField value={value || {}} onChange={(next) => onFieldChange(field.key, next)} error={error} previewUrl={previewUrl} />;
    }

    if (field.type === 'social') {
        return <SocialField value={value || {}} onChange={(next) => onFieldChange(field.key, next)} error={error} />;
    }

    if (field.type === 'rating') {
        return <RatingField label={field.label} value={value} onChange={(next) => onFieldChange(field.key, next)} error={error} />;
    }

    if (field.type === 'media') {
        const fileKey = field.key === 'file_path' ? 'upload_file' : field.key.replace('_path', '_file');
        return (
            <MediaField
                label={field.label}
                hint={field.hint}
                path={value}
                media={field.mediaKey ? form.data[field.mediaKey] : null}
                onPathChange={(next) => onFieldChange(field.key, next)}
                onMediaChange={field.mediaKey ? (next) => form.setData(field.mediaKey, next) : undefined}
                onFileChange={(file) => form.setData(fileKey, file)}
                error={error}
            />
        );
    }

    if (field.type === 'status') {
        return (
            <FieldShell label={field.label} error={error}>
                <Select value={value || 'draft'} onChange={(e) => onFieldChange(field.key, e.target.value)} disabled={disabled}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                </Select>
            </FieldShell>
        );
    }

    if (field.type === 'category') {
        return (
            <FieldShell label={field.label} error={error}>
                <Select value={value || ''} onChange={(e) => onFieldChange(field.key, e.target.value)} disabled={disabled}>
                    <option value="">Select category</option>
                    {(meta.categories || []).map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </Select>
            </FieldShell>
        );
    }

    if (field.type === 'select') {
        return (
            <FieldShell label={field.label} error={error}>
                <Select value={value || ''} onChange={(e) => onFieldChange(field.key, e.target.value)} disabled={disabled}>
                    {field.options.map(([optionValue, optionLabel]) => (
                        <option key={optionValue} value={optionValue}>{optionLabel}</option>
                    ))}
                </Select>
            </FieldShell>
        );
    }

    if (field.type === 'richtext') {
        return (
            <FieldShell label={field.label} hint={field.hint} error={error} wide>
                <RichTextEditor
                    value={value ?? ''}
                    onChange={(next) => onFieldChange(field.key, next)}
                    compact={field.compact}
                    minHeight={field.compact ? '8rem' : '16rem'}
                    storageKey={item ? `${module}-${item.id}-${field.key}` : `${module}-new-${field.key}`}
                />
            </FieldShell>
        );
    }

    if (field.type === 'textarea') {
        return (
            <FieldShell label={field.label} hint={field.hint} error={error} wide={field.wide}>
                <RichTextEditor
                    compact
                    value={value ?? ''}
                    onChange={readOnly ? undefined : (next) => onFieldChange(field.key, next)}
                    minHeight={field.compact ? '6rem' : '10rem'}
                />
            </FieldShell>
        );
    }

    if (field.type === 'number' || field.type === 'datetime') {
        return (
            <FieldShell label={field.label} hint={field.hint} error={error} wide={field.wide}>
                <Input
                    type={field.type === 'datetime' ? 'datetime-local' : 'number'}
                    value={value ?? ''}
                    onChange={(e) => onFieldChange(field.key, e.target.value)}
                    disabled={disabled}
                />
            </FieldShell>
        );
    }

    return (
        <FieldShell label={field.label} hint={field.hint} error={error} wide={field.wide}>
            <Input
                value={value ?? ''}
                onChange={(e) => onFieldChange(field.key, e.target.value)}
                disabled={disabled}
                placeholder={field.type === 'slug' ? 'Auto-generated when empty' : field.placeholder}
            />
        </FieldShell>
    );
}

export default function ModuleForm({ module, config, item, meta = {} }) {
    const schema = moduleSchemas[module];
    const slugSource = schema?.sections
        ?.flatMap((section) => section.fields)
        .find((field) => field.type === 'slug')?.source;
    const slugTouched = useRef(Boolean(item?.slug));
    const readOnly = module === 'contacts';

    const initial = schema
        ? prepareInitial(item, schema, config.columns)
        : Object.fromEntries(config.columns.map((column) => [column, item?.[column] ?? '']));

    const form = useForm(initial);

    function onFieldChange(column, value) {
        form.setData(column, value);

        if (column === 'slug') {
            slugTouched.current = true;
            return;
        }

        if (column === slugSource && !slugTouched.current) {
            form.setData('slug', slugify(value));
        }
    }

    function hasUpload() {
        return Object.keys(form.data).some((key) => form.data[key] instanceof File);
    }

    function persist(extra = {}) {
        form.transform((current) => {
            const next = { ...current, ...extra };
            if (slugSource && !next.slug?.trim()) {
                next.slug = slugify(next[slugSource]);
            }
            return next;
        });

        const options = hasUpload() ? { forceFormData: true } : {};
        item ? form.put(`/admin/${module}/${item.id}`, options) : form.post(`/admin/${module}`, options);
    }

    function submit(e) {
        e.preventDefault();
        persist();
    }

    function saveDraft() {
        persist({ is_active: false, is_published: false, status: 'draft' });
    }

    function publish() {
        persist({ is_active: true, is_published: true, status: 'published' });
    }

    const hasPublishFields = Object.keys(form.data).some((key) => ['is_active', 'is_published', 'status'].includes(key));
    const tabs = groupSchemaSections(schema.sections);
    const previewUrl = previewUrlForModule(module, item);
    const statusLabel = form.data.is_active === false || form.data.status === 'draft'
        ? 'Draft'
        : (form.data.is_featured ? 'Featured' : 'Published');

    if (!schema) {
        return (
            <AdminLayout title={config.title} subtitle={config.description}>
                <p className="text-muted">This module does not have a CMS editor schema yet.</p>
            </AdminLayout>
        );
    }

    const sidebarExtra = module === 'pages' && item ? (
        <Link href={`/admin/pages/${item.id}/builder`} className="cms-builder-link">
            <RiLayoutMasonryLine /> Open AR Builder
        </Link>
    ) : null;

    const recordTitle = item?.name || item?.title || item?.project_name || item?.question || config.title;

    return (
        <AdminLayout
            title={`${item ? (module === 'contacts' ? 'View' : 'Edit') : 'Create'} ${config.title.replace(/s$/, '')}`}
            subtitle={config.description}
        >
            <ResourceEditorShell
                title={config.title}
                subtitle={recordTitle}
                tabs={tabs}
                previewUrl={previewUrl}
                onSubmit={submit}
                onSaveDraft={hasPublishFields && !readOnly ? saveDraft : null}
                onPublish={hasPublishFields && !readOnly ? publish : null}
                processing={form.processing}
                cancelHref={`/admin/${module}`}
                sidebarExtra={sidebarExtra}
                statusLabel={item ? statusLabel : 'New'}
            >
                {(section) => (
                    <div className="cms-form-grid">
                        {section.fields.map((field) => (
                            <CmsField
                                key={field.key}
                                field={field}
                                form={form}
                                module={module}
                                meta={meta}
                                item={item}
                                onFieldChange={onFieldChange}
                                readOnly={readOnly}
                            />
                        ))}
                    </div>
                )}
            </ResourceEditorShell>
        </AdminLayout>
    );
}
