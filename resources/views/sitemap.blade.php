<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
@foreach($entries as $entry)
    <url>
        <loc>{{ $entry['loc'] }}</loc>
        @if(!empty($entry['lastmod']))
        <lastmod>{{ \Illuminate\Support\Carbon::parse($entry['lastmod'])->toAtomString() }}</lastmod>
        @endif
        <changefreq>{{ $entry['changefreq'] ?? 'weekly' }}</changefreq>
        <priority>{{ $entry['priority'] ?? '0.8' }}</priority>
    </url>
@endforeach
</urlset>
