<?php

namespace App\Support;

use App\Models\Page;
use Illuminate\Http\Request;

class AdminEditResolver
{
    public static function resolve(Request $request): ?array
    {
        if (! $request->user() || $request->is('admin', 'admin/*', 'login')) {
            return null;
        }

        $route = $request->route();
        if (! $route) {
            return null;
        }

        return match ($route->getName()) {
            'home' => self::link('Edit Homepage', '/admin/homepage'),
            'about' => self::pageBuilder(Page::where('slug', 'about')->first()),
            'pages.show' => self::pageBuilder($route->parameter('page')),
            'services.index' => self::link('Edit Services', '/admin/services'),
            'services.show' => self::moduleEdit('services', $route->parameter('service'), 'Edit Service'),
            'packages.index' => self::link('Edit Packages', '/admin/packages'),
            'portfolio.index' => self::link('Edit Portfolio', '/admin/portfolio'),
            'portfolio.show' => self::moduleEdit('portfolio', $route->parameter('portfolio'), 'Edit Project'),
            'blog.index' => self::link('Edit Blog', '/admin/blog'),
            'blog.show' => self::moduleEdit('blog', $route->parameter('post'), 'Edit Post'),
            'contact' => self::link('Edit Contact Info', '/admin/site/settings'),
            default => null,
        };
    }

    private static function pageBuilder(?Page $page): ?array
    {
        if (! $page) {
            return null;
        }

        return [
            'label' => 'Edit with AR Builder',
            'href' => "/admin/pages/{$page->id}/builder",
            'type' => 'ar-builder',
            'title' => $page->name,
        ];
    }

    private static function moduleEdit(string $module, object|null $model, string $label): ?array
    {
        if (! $model) {
            return null;
        }

        $title = $model->name ?? $model->title ?? $model->project_name ?? null;

        return [
            'label' => $label,
            'href' => "/admin/{$module}/{$model->id}/edit",
            'type' => 'module',
            'title' => $title,
        ];
    }

    private static function link(string $label, string $href): array
    {
        return [
            'label' => $label,
            'href' => $href,
            'type' => 'link',
        ];
    }
}
