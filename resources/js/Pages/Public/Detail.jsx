import PublicLayout from '../../Layouts/PublicLayout';
import { Card, Section } from '../../Components/Public';
import RichTextContent from '../../Components/Cms/RichTextContent';

export default function Detail({ settings, kind, item }) {
    const title = item.name || item.project_name || item.title;
    return (
        <PublicLayout settings={settings} title={title}>
            <Section eyebrow={kind} title={title} subtitle={item.excerpt || item.client || item.category?.name}>
                <Card>
                    <div className="prose prose-invert max-w-none">
                        <RichTextContent html={item.description || item.content || item.review} className="text-lg leading-8 text-muted" />
                        {(item.benefits || item.features || item.tags) && (
                            <div className="mt-8 flex flex-wrap gap-3">
                                {(item.benefits || item.features || item.tags || []).map((entry) => <span key={entry} className="rounded-full py-2 text-primary py-2 text-sm text-primary">{entry}</span>)}
                            </div>
                        )}
                    </div>
                </Card>
            </Section>
        </PublicLayout>
    );
}
