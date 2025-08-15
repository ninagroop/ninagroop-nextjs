# DecapCMS Setup Guide

## Overview

This project uses DecapCMS (formerly NetlifyCMS) for content management. DecapCMS is configured to work with the Next.js application and can be used both in development (with local backend) and production (with git-gateway).

## Directory Structure

```
nina/ninagroop-nextjs/
├── app/admin/              # Next.js admin route
│   ├── page.tsx           # Dynamic CMS loader
│   └── layout.tsx         # Admin layout
├── public/admin/          # Static CMS files
│   ├── index.html         # Static HTML fallback
│   ├── config.yml         # CMS configuration
│   └── preview.css        # Preview pane styles
└── content/               # Markdown content
    ├── blog/             # Blog posts
    ├── pages/            # Static pages
    └── home/             # Homepage content
```

## Accessing the CMS

### Development Mode

1. **Start the local backend server:**
   ```bash
   pnpm run dev:cms
   ```
   This runs `decap-server` on port 8081

2. **Start the Next.js development server:**
   ```bash
   pnpm run dev
   ```
   Or run both together:
   ```bash
   pnpm run dev:all
   ```

3. **Access the CMS:**
   - Navigate to `http://localhost:3000/admin`
   - Or use the static version at `http://localhost:3000/admin/index.html`

### Production Mode

1. **Access the CMS:**
   - Navigate to `https://yourdomain.com/admin`
   - Login with Netlify Identity credentials

## Configuration

### Content Collections

The CMS is configured to manage three types of content:

#### 1. Blog Posts
- **Location:** `content/blog/`
- **URL Pattern:** `/blog/[year]/[month]/[title]`
- **Fields:**
  - Title
  - Publish Date
  - Description
  - Body (Markdown)
  - Featured Post (boolean)
  - Featured Image

#### 2. Pages
- **Location:** `content/pages/`
- **URL Pattern:** `/[page-name]`
- **Fields:**
  - Title
  - Body (Markdown)
  - Featured Image

#### 3. Home Page
- **Location:** `content/home/index.md`
- **Type:** Single file
- **Fields:**
  - Navigation menu
  - Tagline
  - Home quote
  - Social links
  - Footer information
  - Body (Markdown)

### Authentication

#### Local Development
- Uses `decap-server` for local file system access
- No authentication required
- Enabled by `local_backend: true` in config.yml

#### Production
- Uses Netlify Identity with git-gateway
- Requires Netlify Identity setup
- Users must be invited through Netlify dashboard

## Development Workflow

### Creating New Content

1. **Via CMS Interface:**
   - Navigate to `/admin`
   - Select collection (Blog, Pages)
   - Click "New [Collection]"
   - Fill in fields
   - Save draft or publish

2. **Via File System:**
   - Create markdown file in appropriate directory
   - Follow existing frontmatter structure
   - CMS will recognize new files

### Editing Content

1. **Via CMS:**
   - Navigate to content in CMS
   - Click to edit
   - Make changes
   - Save/publish

2. **Direct File Edit:**
   - Edit markdown files directly
   - Changes appear in CMS

### Media Management

- **Upload Location:** Files uploaded through CMS go to `public/img/`
- **In-content Images:** Blog/page images stored alongside markdown files
- **Reference:** Use relative paths in markdown

## Preview Configuration

The CMS preview pane uses custom styles defined in `public/admin/preview.css`. These styles ensure content appears similar to the actual site.

## Troubleshooting

### CMS Not Loading

1. **Check console for errors**
2. **Verify config.yml is valid YAML**
3. **Ensure decap-cms-app is installed:**
   ```bash
   pnpm add decap-cms-app
   ```

### Local Backend Issues

1. **Ensure decap-server is running:**
   ```bash
   pnpm run dev:cms
   ```

2. **Check port 8081 is not in use**

3. **Verify local_backend is enabled in config.yml:**
   ```yaml
   local_backend: true
   ```

### Authentication Issues (Production)

1. **Verify Netlify Identity is enabled**
2. **Check user is invited/confirmed**
3. **Ensure git-gateway is configured**
4. **Verify branch permissions**

### Content Not Appearing

1. **Check frontmatter is valid**
2. **Verify templatekey matches expected value**
3. **Ensure file is in correct directory**
4. **Check for build errors**

## Customization

### Adding New Fields

Edit `public/admin/config.yml`:

```yaml
fields:
  - { label: 'New Field', name: 'newfield', widget: 'string' }
```

Update TypeScript types in `types/content.ts`.

### Adding New Collections

1. Add collection to `config.yml`
2. Create corresponding TypeScript interface
3. Update markdown processing functions

### Custom Widgets

Register custom widgets in `app/admin/page.tsx`:

```typescript
CMS.registerWidget('custom-widget', CustomWidget);
```

## Migration from NetlifyCMS

This project has been migrated from NetlifyCMS to DecapCMS. The changes include:

1. **Package:** `netlify-cms-app` → `decap-cms-app`
2. **Local Dev:** Added `decap-server` for local backend
3. **Config:** Updated paths for Next.js structure
4. **Preview:** Enabled preview mode (was disabled)

## Best Practices

1. **Always test locally** before deploying CMS changes
2. **Backup content** before major CMS updates
3. **Validate YAML** config before committing
4. **Test preview** after field changes
5. **Document custom fields** in TypeScript types

## Resources

- [DecapCMS Documentation](https://decapcms.org/docs/)
- [Configuration Options](https://decapcms.org/docs/configuration-options/)
- [Widgets Reference](https://decapcms.org/docs/widgets/)
- [Custom Previews](https://decapcms.org/docs/customization/)