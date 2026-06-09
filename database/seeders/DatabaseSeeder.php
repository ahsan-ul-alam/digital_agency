<?php

namespace Database\Seeders;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\ClientLogo;
use App\Models\Faq;
use App\Models\HomepageSection;
use App\Models\Package;
use App\Models\Page;
use App\Models\Portfolio;
use App\Models\Service;
use App\Models\SiteSetting;
use App\Models\Statistic;
use App\Models\TeamMember;
use App\Models\Testimonial;
use App\Models\User;
use App\Support\MenuSettings;
use App\Support\ThemePalette;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(['email' => 'admin@arsoftbd.com'], [
            'name' => 'AR Soft BD Admin',
            'password' => Hash::make('password'),
        ]);

        $this->call(RolePermissionSeeder::class);
        $this->call(QuoteTypeSeeder::class);
        $this->call(MeetingTypeSeeder::class);
        $this->call(JobOpeningSeeder::class);
        $this->call(PaymentSettingsSeeder::class);

        collect([
            'site' => ['name' => 'AR Soft BD', 'tagline' => 'Software Development & Digital Agency', 'logo' => '', 'favicon' => ''],
            'contact' => ['email' => 'hello@arsoftbd.com', 'phone' => '+880 1700-000000', 'address' => 'Dhaka, Bangladesh', 'map' => 'https://maps.google.com'],
            'social' => ['facebook' => '#', 'linkedin' => '#', 'github' => '#'],
            'seo' => ['title' => 'AR Soft BD - Software Agency in Bangladesh', 'description' => 'Modern Laravel, React, ecommerce, ERP and SaaS development agency.', 'keywords' => 'software agency, Laravel, React, ecommerce, ERP, Bangladesh'],
            'cloudinary' => ['cloud_name' => '', 'api_key' => '', 'api_secret' => '', 'upload_preset' => '', 'folder' => 'arsoftbd'],
            'theme' => ThemePalette::defaults(),
            'menus' => MenuSettings::defaults(),
        ])->each(fn ($value, $key) => SiteSetting::updateOrCreate(['key' => $key], ['value' => $value]));

        collect([
            [
                'section_key' => 'hero',
                'title' => 'Building Software That Drives Growth',
                'subtitle' => 'Digital Transformation Partner',
                'content' => 'We solve business problems through custom software — ERP, CRM, ecommerce and platforms that automate operations and unlock revenue.',
                'payload' => [
                    'highlight' => 'Drives Growth',
                    'primary_cta' => 'Explore Services',
                    'primary_url' => '/services',
                    'secondary_cta' => 'Our Portfolio',
                    'secondary_url' => '/portfolio',
                    'form_title' => 'Get a Free Quote',
                    'form_subtitle' => 'Tell us about your project and we will get back within 24 hours.',
                ],
                'sort_order' => 1,
            ],
            [
                'section_key' => 'about',
                'title' => 'We Are More Than Just A Development Company',
                'subtitle' => 'AR Soft BD is a full-service digital agency committed to helping businesses thrive in the digital age.',
                'content' => 'With years of experience and a passion for innovation, we deliver solutions that drive real business results.',
                'payload' => [
                    'features' => ['Experienced & Professional Team', 'Quality-First Development Approach', 'On-Time Project Delivery', '24/7 Dedicated Support'],
                    'cards' => [
                        ['title' => 'Our Mission', 'body' => 'Empower businesses with innovative digital solutions that drive growth and create lasting value.'],
                        ['title' => 'Our Vision', 'body' => 'Become the most trusted digital partner for businesses seeking transformation and excellence.'],
                    ],
                    'why_points' => ['Experienced & Professional Team', 'Quality-First Development', 'On-Time Delivery', '24/7 Support'],
                ],
                'sort_order' => 2,
            ],
            [
                'section_key' => 'process',
                'title' => 'Our Proven Development Process',
                'subtitle' => 'A structured approach that ensures quality delivery every time.',
                'payload' => [
                    'steps' => [
                        ['title' => 'Discover', 'body' => 'We analyze your needs, goals and target audience to create a solid foundation.', 'icon' => 'RiSearchLine'],
                        ['title' => 'Plan', 'body' => 'Detailed project roadmap with timelines, milestones and resource allocation.', 'icon' => 'RiFileList3Line'],
                        ['title' => 'Design & Develop', 'body' => 'Beautiful interfaces and robust code built with modern technologies.', 'icon' => 'RiPaletteLine'],
                        ['title' => 'Test & Deliver', 'body' => 'Rigorous testing and seamless deployment to production.', 'icon' => 'RiComputerLine'],
                        ['title' => 'Support', 'body' => 'Ongoing maintenance, updates and dedicated support for your success.', 'icon' => 'RiCustomerService2Line'],
                    ],
                ],
                'sort_order' => 3,
            ],
            ['section_key' => 'why', 'title' => 'Why teams choose AR Soft BD', 'subtitle' => 'Strategy, engineering and design in one focused delivery partner.', 'content' => 'We blend SaaS-level user experience with maintainable backend architecture.', 'payload' => ['features' => ['Conversion-focused interfaces', 'Reusable Laravel architecture', 'Admin-first content management', 'SEO and performance baked in']], 'sort_order' => 4],
            ['section_key' => 'contact_cta', 'title' => "Let's Build Your Next Software Product", 'subtitle' => 'Free consultation · Scoped proposal · Engineering partnership', 'content' => 'Tell us the business problem. We will design the software roadmap, architecture and delivery plan.', 'payload' => ['button' => 'Book Consultation', 'url' => '/contact'], 'sort_order' => 99],
        ])->each(fn ($row) => HomepageSection::updateOrCreate(['section_key' => $row['section_key']], $row));

        collect(['Northstar ERP', 'Dhaka Retail Co', 'CloudOps Lab', 'NexCommerce', 'GrowthStack'])->each(fn ($name, $i) => ClientLogo::updateOrCreate(['name' => $name], ['logo_path' => null, 'url' => '#', 'sort_order' => $i + 1]));

        collect([
            ['name' => 'Web Development', 'slug' => 'web-development', 'icon' => 'RiCodeSSlashLine', 'excerpt' => 'Custom websites and web applications built with modern technologies for optimal performance.', 'description' => 'Responsive, SEO-friendly Laravel and React websites built for speed and easy content control.', 'benefits' => ['Modern React interfaces', 'Dynamic CMS sections', 'Lighthouse-minded performance'], 'is_featured' => true],
            ['name' => 'Mobile App Development', 'slug' => 'mobile-app-development', 'icon' => 'RiSmartphoneLine', 'excerpt' => 'Native and cross-platform mobile applications for iOS and Android devices.', 'description' => 'Build engaging mobile experiences with React Native and native technologies.', 'benefits' => ['iOS & Android', 'Cross-platform', 'App store ready'], 'is_featured' => true],
            ['name' => 'UI/UX Design', 'slug' => 'ui-ux-design', 'icon' => 'RiPaletteLine', 'excerpt' => 'User-centered design that creates intuitive and engaging digital experiences.', 'description' => 'Research-driven interface design with prototyping and design systems.', 'benefits' => ['User research', 'Prototyping', 'Design systems'], 'is_featured' => true],
            ['name' => 'E-commerce Solutions', 'slug' => 'ecommerce-development', 'icon' => 'RiShoppingBag3Line', 'excerpt' => 'Complete online store solutions with payment integration and inventory management.', 'description' => 'Custom ecommerce systems with product, order, payment and operations workflows.', 'benefits' => ['Checkout optimization', 'Inventory workflows', 'Admin reporting'], 'is_featured' => true],
            ['name' => 'ERP Solutions', 'slug' => 'erp-crm-systems', 'icon' => 'RiNodeTree', 'excerpt' => 'Enterprise resource planning systems to streamline your business operations.', 'description' => 'Tailored ERP and CRM platforms that replace spreadsheet-heavy manual work.', 'benefits' => ['Role-based dashboards', 'Automated reporting', 'Department workflows'], 'is_featured' => true],
            ['name' => 'Digital Marketing', 'slug' => 'digital-marketing', 'icon' => 'RiFlashlightLine', 'excerpt' => 'Strategic digital marketing campaigns to grow your online presence and reach.', 'description' => 'SEO, content marketing, social media and paid campaigns for measurable growth.', 'benefits' => ['SEO optimization', 'Social media', 'Analytics'], 'is_featured' => true],
        ])->each(fn ($row, $i) => Service::updateOrCreate(['slug' => $row['slug']], [...$row, 'sort_order' => $i + 1, 'seo' => ['title' => $row['name'].' - AR Soft BD']]));

        collect([
            ['label' => 'Projects Delivered', 'value' => 500, 'suffix' => '+'],
            ['label' => 'Business Processes Automated', 'value' => 50, 'suffix' => '+'],
            ['label' => 'Clients Served', 'value' => 100, 'suffix' => '+'],
        ])->each(fn ($row, $i) => Statistic::updateOrCreate(['label' => $row['label']], [...$row, 'sort_order' => $i + 1]));

        collect([
            ['project_name' => 'RetailFlow Ecommerce', 'slug' => 'retailflow-ecommerce', 'client' => 'NexCommerce', 'category' => 'Ecommerce', 'excerpt' => 'A fast Laravel storefront with order operations dashboard.', 'description' => 'Designed and built a custom ecommerce stack with product management, order lifecycle and analytics.', 'is_featured' => true],
            ['project_name' => 'OpsPilot ERP', 'slug' => 'opspilot-erp', 'client' => 'Northstar ERP', 'category' => 'ERP', 'excerpt' => 'Internal ERP for procurement, inventory and reporting.', 'description' => 'Replaced manual approval workflows with a centralized Laravel ERP.', 'is_featured' => true],
            ['project_name' => 'LaunchDesk SaaS', 'slug' => 'launchdesk-saas', 'client' => 'GrowthStack', 'category' => 'SaaS', 'excerpt' => 'A subscription-ready client portal for service teams.', 'description' => 'Built a SaaS portal with team accounts, plans, invoices and project workspaces.', 'is_featured' => true],
        ])->each(fn ($row, $i) => Portfolio::updateOrCreate(['slug' => $row['slug']], [...$row, 'url' => '#', 'sort_order' => $i + 1, 'seo' => ['title' => $row['project_name'].' case study']]));

        collect([
            ['name' => 'Startup Website', 'type' => 'one-time', 'price' => 'BDT 45,000', 'duration' => '2-3 weeks', 'features' => ['Premium landing page', 'Dynamic admin content', 'SEO setup', 'Contact form'], 'is_highlighted' => false],
            ['name' => 'Business Growth', 'type' => 'one-time', 'price' => 'BDT 95,000', 'duration' => '4-6 weeks', 'features' => ['Up to 8 dynamic pages', 'Portfolio/blog CMS', 'Performance optimization', 'Analytics integration'], 'is_highlighted' => true],
            ['name' => 'Custom Platform', 'type' => 'monthly', 'price' => 'Custom', 'duration' => 'Roadmap based', 'features' => ['SaaS, ERP or ecommerce', 'Product strategy', 'Dedicated sprint delivery', 'Ongoing support'], 'is_highlighted' => false],
        ])->each(fn ($row, $i) => Package::updateOrCreate(['name' => $row['name']], [...$row, 'button_text' => 'Discuss package', 'button_url' => '/contact', 'sort_order' => $i + 1]));

        collect([
            ['client_name' => 'Tanvir Rahman', 'designation' => 'Founder', 'company' => 'GrowthStack', 'review' => 'AR Soft BD translated our scattered product idea into a sharp SaaS MVP and moved quickly without sacrificing quality.', 'rating' => 5],
            ['client_name' => 'Nadia Islam', 'designation' => 'Operations Lead', 'company' => 'Northstar ERP', 'review' => 'Their team understood our workflow deeply and delivered an admin experience our staff could use from week one.', 'rating' => 5],
        ])->each(fn ($row, $i) => Testimonial::updateOrCreate(['client_name' => $row['client_name']], [...$row, 'sort_order' => $i + 1]));

        collect([
            ['name' => 'Ahsan Habib', 'position' => 'Lead Engineer', 'bio' => 'Laravel and React architect focused on maintainable systems.', 'social_links' => ['linkedin' => '#']],
            ['name' => 'Samia Noor', 'position' => 'Product Designer', 'bio' => 'Designs clean SaaS interfaces and conversion-focused journeys.', 'social_links' => ['dribbble' => '#']],
            ['name' => 'Rafi Ahmed', 'position' => 'Full Stack Developer', 'bio' => 'Builds dashboards, APIs and frontend experiences.', 'social_links' => ['github' => '#']],
        ])->each(fn ($row, $i) => TeamMember::updateOrCreate(['name' => $row['name']], [...$row, 'sort_order' => $i + 1]));

        collect([
            ['question' => 'Can we manage all website content from the dashboard?', 'answer' => 'Yes. Pages, homepage sections, services, packages, portfolio, blogs, team, testimonials, FAQs, settings and submissions are dashboard-managed.'],
            ['question' => 'Is the project shared hosting friendly?', 'answer' => 'Yes. It uses standard Laravel, Vite-built assets and MySQL-compatible migrations for cPanel or VPS deployment.'],
            ['question' => 'Can new pages be added without code?', 'answer' => 'Yes. The dynamic page module publishes custom pages by slug automatically.'],
        ])->each(fn ($row, $i) => Faq::updateOrCreate(['question' => $row['question']], [...$row, 'sort_order' => $i + 1]));

        $category = BlogCategory::updateOrCreate(['slug' => 'software-growth'], ['name' => 'Software Growth']);
        BlogPost::updateOrCreate(['slug' => 'how-to-plan-a-custom-software-project'], [
            'blog_category_id' => $category->id,
            'title' => 'How to plan a custom software project without wasting the first sprint',
            'excerpt' => 'A practical roadmap for founders and operations teams before development starts.',
            'content' => 'Start with the business workflow, define the user roles, map the core data, and choose the smallest release that creates operational value. This keeps the first sprint grounded in outcomes instead of feature noise.',
            'tags' => ['planning', 'saas', 'erp'],
            'seo' => ['title' => 'How to plan a custom software project'],
            'status' => 'published',
            'published_at' => now(),
        ]);

        Page::updateOrCreate(['slug' => 'about'], [
            'name' => 'About AR Soft BD',
            'content' => 'AR Soft BD is a software agency from Bangladesh helping businesses launch premium websites, SaaS products, ecommerce platforms, ERP systems and custom digital operations tools.',
            'sections' => [
                ['type' => 'hero', 'eyebrow' => 'Company', 'title' => 'A product-minded software team for serious business systems.', 'body' => 'We combine software architecture, interface craft and operational clarity so clients can launch with confidence.'],
                ['type' => 'features', 'items' => [
                    ['title' => 'Mission', 'body' => 'Make high-quality software delivery accessible, strategic and dependable.'],
                    ['title' => 'Vision', 'body' => 'Become a trusted product engineering partner for growing companies across Bangladesh and beyond.'],
                    ['title' => 'Delivery Style', 'body' => 'Small senior teams, clear milestones and maintainable Laravel/React foundations.'],
                ]],
                ['type' => 'cta', 'title' => 'Ready to modernize your business workflow?', 'body' => 'Bring us the messy process. We will turn it into a practical product roadmap.', 'button' => 'Book discovery', 'url' => '/contact'],
            ],
            'seo' => ['title' => 'About AR Soft BD'],
        ]);

        collect([
            ['slug' => 'privacy-policy', 'name' => 'Privacy Policy', 'content' => 'This page can be edited from the dashboard to match your final legal policy.'],
            ['slug' => 'terms', 'name' => 'Terms and Conditions', 'content' => 'This page can be edited from the dashboard to match your final terms.'],
            ['slug' => 'refund-policy', 'name' => 'Refund Policy', 'content' => 'This page can be edited from the dashboard to match your final refund policy.'],
        ])->each(fn ($row) => Page::updateOrCreate(['slug' => $row['slug']], [...$row, 'seo' => ['title' => $row['name']]]));
    }
}
