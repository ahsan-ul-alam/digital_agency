import { Head } from '../app';

function metaTag(attr, key, content) {
    if (!content) return null;
    return <meta key={`${attr}-${key}`} {...{ [attr]: key }} content={content} />;
}

export default function SeoHead({ seo }) {
    if (!seo) return null;

    const { title, description, keywords, canonical, robots, og = {}, twitter = {}, schema = [], article, locale, site_name: siteName } = seo;

    return (
        <Head title={title}>
            {description && <meta name="description" content={description} />}
            {keywords && <meta name="keywords" content={keywords} />}
            {robots && <meta name="robots" content={robots} />}
            {canonical && <link rel="canonical" href={canonical} />}

            {metaTag('property', 'og:title', og.title || title)}
            {metaTag('property', 'og:description', og.description || description)}
            {metaTag('property', 'og:type', og.type || 'website')}
            {metaTag('property', 'og:url', og.url || canonical)}
            {metaTag('property', 'og:site_name', og.site_name || siteName)}
            {metaTag('property', 'og:locale', og.locale || locale)}
            {og.image && <meta property="og:image" content={og.image} />}
            {og.image && <meta property="og:image:alt" content={og.title || title} />}

            {metaTag('name', 'twitter:card', twitter.card || (og.image ? 'summary_large_image' : 'summary'))}
            {metaTag('name', 'twitter:title', twitter.title || title)}
            {metaTag('name', 'twitter:description', twitter.description || description)}
            {twitter.site && <meta name="twitter:site" content={twitter.site} />}
            {(twitter.image || og.image) && <meta name="twitter:image" content={twitter.image || og.image} />}

            {article?.published_time && <meta property="article:published_time" content={article.published_time} />}
            {article?.modified_time && <meta property="article:modified_time" content={article.modified_time} />}
            {article?.section && <meta property="article:section" content={article.section} />}
            {(article?.tag || []).map((tag) => (
                <meta key={`article-tag-${tag}`} property="article:tag" content={tag} />
            ))}

            {schema.map((entry, index) => (
                <script
                    key={`schema-${index}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
                />
            ))}
        </Head>
    );
}
