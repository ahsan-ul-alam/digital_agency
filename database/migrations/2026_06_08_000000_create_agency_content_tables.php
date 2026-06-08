<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->json('value')->nullable();
            $table->timestamps();
        });

        Schema::create('homepage_sections', function (Blueprint $table) {
            $table->id();
            $table->string('section_key')->unique();
            $table->string('title')->nullable();
            $table->text('subtitle')->nullable();
            $table->longText('content')->nullable();
            $table->json('payload')->nullable();
            $table->json('media')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('client_logos', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('logo_path')->nullable();
            $table->json('logo_media')->nullable();
            $table->string('url')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('icon')->nullable();
            $table->string('banner_path')->nullable();
            $table->json('banner_media')->nullable();
            $table->text('excerpt')->nullable();
            $table->longText('description')->nullable();
            $table->json('benefits')->nullable();
            $table->json('seo')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('statistics', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->unsignedInteger('value')->default(0);
            $table->string('suffix')->nullable();
            $table->string('icon')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('portfolios', function (Blueprint $table) {
            $table->id();
            $table->string('project_name');
            $table->string('slug')->unique();
            $table->string('client')->nullable();
            $table->string('category')->nullable();
            $table->string('image_path')->nullable();
            $table->json('image_media')->nullable();
            $table->string('url')->nullable();
            $table->text('excerpt')->nullable();
            $table->longText('description')->nullable();
            $table->json('seo')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type')->default('one-time');
            $table->string('price');
            $table->string('duration')->nullable();
            $table->json('features')->nullable();
            $table->string('button_text')->default('Start a project');
            $table->string('button_url')->default('/contact');
            $table->boolean('is_highlighted')->default(false);
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('client_name');
            $table->string('designation')->nullable();
            $table->string('company')->nullable();
            $table->string('photo_path')->nullable();
            $table->json('photo_media')->nullable();
            $table->text('review');
            $table->unsignedTinyInteger('rating')->default(5);
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('team_members', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('position');
            $table->string('photo_path')->nullable();
            $table->json('photo_media')->nullable();
            $table->text('bio')->nullable();
            $table->json('social_links')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->string('question');
            $table->text('answer');
            $table->string('category')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('blog_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('blog_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('blog_category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('thumbnail_path')->nullable();
            $table->json('thumbnail_media')->nullable();
            $table->text('excerpt')->nullable();
            $table->longText('content');
            $table->json('tags')->nullable();
            $table->json('seo')->nullable();
            $table->string('status')->default('draft');
            $table->timestamp('published_at')->nullable();
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamps();
        });

        Schema::create('pages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('banner_path')->nullable();
            $table->json('banner_media')->nullable();
            $table->longText('content')->nullable();
            $table->json('sections')->nullable();
            $table->json('seo')->nullable();
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });

        Schema::create('contact_submissions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('company')->nullable();
            $table->string('service')->nullable();
            $table->string('budget')->nullable();
            $table->text('message');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });

        Schema::create('media_items', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('file_path');
            $table->string('disk')->default('local');
            $table->string('cloudinary_public_id')->nullable();
            $table->string('secure_url')->nullable();
            $table->string('mime_type')->nullable();
            $table->unsignedBigInteger('size')->default(0);
            $table->string('alt_text')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media_items');
        Schema::dropIfExists('contact_submissions');
        Schema::dropIfExists('pages');
        Schema::dropIfExists('blog_posts');
        Schema::dropIfExists('blog_categories');
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('team_members');
        Schema::dropIfExists('testimonials');
        Schema::dropIfExists('packages');
        Schema::dropIfExists('portfolios');
        Schema::dropIfExists('statistics');
        Schema::dropIfExists('services');
        Schema::dropIfExists('client_logos');
        Schema::dropIfExists('homepage_sections');
        Schema::dropIfExists('site_settings');
    }
};
