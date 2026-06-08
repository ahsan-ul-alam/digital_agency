<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use App\Models\SiteSetting;
use App\Support\MenuSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MenuController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('Admin/MenuManagement', [
            'menus' => MenuSettings::get(),
            'pageLinks' => Page::where('is_published', true)->orderBy('name')->get(['id', 'name', 'slug'])->map(fn ($page) => [
                'label' => $page->name,
                'url' => '/'.$page->slug,
            ]),
            'systemLinks' => [
                ['label' => 'Home', 'url' => '/'],
                ['label' => 'About', 'url' => '/about'],
                ['label' => 'Services', 'url' => '/services'],
                ['label' => 'Portfolio', 'url' => '/portfolio'],
                ['label' => 'Packages', 'url' => '/packages'],
                ['label' => 'Blog', 'url' => '/blog'],
                ['label' => 'Contact', 'url' => '/contact'],
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'menus' => ['required', 'array'],
            'menus.header' => ['required', 'array'],
            'menus.header.items' => ['required', 'array'],
            'menus.header.items.*.id' => ['required', 'string', 'max:80'],
            'menus.header.items.*.label' => ['required', 'string', 'max:120'],
            'menus.header.items.*.url' => ['required', 'string', 'max:500'],
            'menus.header.items.*.target' => ['nullable', 'in:_self,_blank'],
            'menus.header.items.*.is_active' => ['boolean'],
            'menus.header.cta' => ['required', 'array'],
            'menus.header.cta.label' => ['required', 'string', 'max:120'],
            'menus.header.cta.url' => ['required', 'string', 'max:500'],
            'menus.header.cta.is_active' => ['boolean'],
            'menus.footer' => ['required', 'array'],
            'menus.footer.columns' => ['required', 'array'],
            'menus.footer.columns.*.id' => ['required', 'string', 'max:80'],
            'menus.footer.columns.*.title' => ['required', 'string', 'max:120'],
            'menus.footer.columns.*.items' => ['required', 'array'],
            'menus.footer.columns.*.items.*.id' => ['required', 'string', 'max:80'],
            'menus.footer.columns.*.items.*.label' => ['required', 'string', 'max:120'],
            'menus.footer.columns.*.items.*.url' => ['required', 'string', 'max:500'],
            'menus.footer.columns.*.items.*.target' => ['nullable', 'in:_self,_blank'],
            'menus.footer.columns.*.items.*.is_active' => ['boolean'],
            'menus.footer.show_logo' => ['boolean'],
            'menus.footer.show_contact' => ['boolean'],
            'menus.footer.show_social' => ['boolean'],
            'menus.footer.copyright' => ['nullable', 'string', 'max:220'],
        ]);

        SiteSetting::updateOrCreate(['key' => 'menus'], ['value' => $data['menus']]);

        return back()->with('success', 'Menus updated.');
    }
}
