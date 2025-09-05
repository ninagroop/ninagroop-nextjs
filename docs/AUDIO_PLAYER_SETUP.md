# Audio Player System Documentation

This documentation covers the audio player system integrated with DecapCMS for managing audiobook excerpts on your Next.js site.

## Overview

The audio player system allows you to:
- Upload and manage MP3 files through DecapCMS
- Add audio players to pages, blog posts, and the home page
- Play audiobook excerpts with a clean, responsive player interface
- Manage audio content through the CMS admin interface

## Features

- **DecapCMS Integration**: Upload and manage audio files directly through the CMS
- **Responsive Player**: Built with `react-h5-audio-player` and custom styling
- **Multiple Integration Points**: Add audio to pages, blog posts, and home page
- **Clean UI**: Styled to match your existing design system using CSS modules
- **Accessibility**: Keyboard navigation and screen reader support

## File Structure

```
ninagroop-nextjs/
├── components/
│   ├── AudioPlayer.tsx              # Main audio player component
│   ├── AudioPlayer.module.css       # Player styling
│   ├── AudioPlayerList.tsx          # Component for multiple players
│   ├── PageWithAudio.tsx            # Example page integration
│   └── BlogPostWithAudio.tsx        # Example blog integration
├── content/
│   └── audio-excerpts/              # Audio excerpt markdown files
│       └── sample-excerpt.md
├── public/
│   └── content/
│       └── audio/                   # Uploaded MP3 files
├── types/
│   └── audio.ts                     # TypeScript types
├── lib/
│   └── audio.ts                     # Utility functions
└── public/admin/
    └── config.yml                   # Updated CMS configuration
```

## Getting Started

### 1. Dependencies

The following dependency has been installed:
- `react-h5-audio-player`: Audio player component

### 2. CMS Collections

The DecapCMS configuration now includes:

#### Audio Excerpts Collection
- **Collection Name**: `audio-excerpts`
- **Location**: `content/audio-excerpts/`
- **Media Folder**: `public/content/audio/`

#### Fields:
- **Title**: Name of the excerpt
- **Audio File**: MP3 file upload
- **Description**: Optional description
- **Published**: Boolean to show/hide excerpt

## Using the Audio Player System

### Adding Audio Excerpts via CMS

1. Go to your CMS admin interface (`/admin`)
2. Navigate to "Audio Excerpts" collection
3. Click "New Audio Excerpts"
4. Fill out the form:
   - **Title**: e.g., "Chapter 1: The Beginning"
   - **Audio File**: Upload your MP3 file
   - **Description**: Brief description of the excerpt
   - **Published**: Check to make it available
5. Save and publish

### Adding Audio to Pages

In the CMS when editing a page:

1. Scroll to the "Audio Players" section
2. Click "Add Audio Players"
3. Select an audio excerpt from the dropdown
4. Save the page

### Adding Audio to Blog Posts

When creating or editing a blog post:

1. Find the "Audio Excerpt" field
2. Select an excerpt from the dropdown
3. Save the post

### Adding Featured Audio to Home Page

When editing the home page:

1. Find the "Featured Audio Excerpt" field
2. Select an excerpt from the dropdown
3. Save the page

### Adding Inline Audio Players to Markdown Content

You can embed audio players directly within your markdown content using custom tags, similar to `<vertical-tiles-grid>`. This allows you to place audio players anywhere in your page or blog post content.

**Syntax:**
```
<audio-player slug="your-excerpt-slug"></audio-player>
```

**With optional title:**
```
<audio-player slug="your-excerpt-slug" title="Custom Player Title"></audio-player>
```

**Example in markdown:**
```markdown
# My Blog Post

Here's some content about my latest audiobook.

<audio-player slug="chapter-1-the-beginning" title="Listen to Chapter 1"></audio-player>

And here's more content after the audio player...
```

**How it works:**
- The audio player will be rendered inline wherever you place the tag
- Uses the same styling as other audio players but fits naturally in content flow
- Loads audio excerpt data dynamically
- Shows loading state while fetching data
- Displays error message if excerpt is not found

## Component Usage

### Basic Audio Player

```tsx
import AudioPlayerComponent from '@/components/AudioPlayer';
import { getAudioExcerptBySlug } from '@/lib/audio';

export default async function MyPage() {
  const excerpt = await getAudioExcerptBySlug('chapter-1-the-beginning');
  
  return (
    <div>
      {excerpt && (
        <AudioPlayerComponent 
          excerpt={excerpt}
          autoPlay={false}
        />
      )}
    </div>
  );
}
```

### Multiple Audio Players

```tsx
import AudioPlayerList from '@/components/AudioPlayerList';
import { getAudioExcerptsForPage } from '@/lib/audio';

export default async function MyPage({ page }) {
  const excerpts = page.audioplayers?.length
    ? await getAudioExcerptsForPage(page.audioplayers.map(config => config.excerpt))
    : [];

  return (
    <div>
      {excerpts.length > 0 && (
        <AudioPlayerList excerpts={excerpts} />
      )}
    </div>
  );
}
```

### Using with Page Content

```tsx
import PageWithAudioComponent from '@/components/PageWithAudio';

export default function Page({ pageData }) {
  return (
    <PageWithAudioComponent 
      page={pageData}
      className="container mx-auto py-8"
    />
  );
}
```

## Available Components

### `AudioPlayerComponent`

**Props:**
- `excerpt: AudioExcerpt` - The audio excerpt data
- `autoPlay?: boolean` - Whether to start playing automatically (default: false)
- `className?: string` - Additional CSS classes
- `onPlay?: () => void` - Callback when playback starts
- `onPause?: () => void` - Callback when playback pauses
- `onEnded?: () => void` - Callback when playback ends

### `AudioPlayerList`

**Props:**
- `excerpts: AudioExcerpt[]` - Array of audio excerpts
- `playerConfigs?: AudioPlayerConfig[]` - Optional configuration array
- `className?: string` - Additional CSS classes

## Utility Functions

### `getAllAudioExcerpts()`
Returns all published audio excerpts, sorted alphabetically by title.

### `getAudioExcerptBySlug(slug: string)`
Returns a specific audio excerpt by its slug, or null if not found.

### `getAudioExcerptsForPage(slugs: string[])`
Returns an array of audio excerpts for the given slugs.

## Styling

The audio player uses CSS modules (`AudioPlayer.module.css`) with custom styling that integrates with your design system:

- Uses CSS custom properties for theming
- Responsive design for mobile and desktop
- Matches your existing color scheme
- Clean, minimal interface

### Customizing Styles

To customize the player appearance, edit `components/AudioPlayer.module.css`:

```css
.audioPlayer :global(.rhap_play-pause-button) {
  color: hsl(var(--your-custom-color)) !important;
}
```

## File Formats and Limitations

### Supported Formats
- **Primary**: MP3 (recommended)
- **Also supported**: WAV, OGG, M4A (browser-dependent)

### Recommendations
- **File Size**: Keep excerpts under 10MB for optimal loading
- **Duration**: 1-5 minutes for excerpts
- **Quality**: 128kbps MP3 for good quality/size balance
- **Naming**: Use descriptive filenames (e.g., `chapter-1-excerpt.mp3`)

## Troubleshooting

### Audio File Not Playing

1. **Check file format**: Ensure MP3 format
2. **Verify file path**: Check that the file exists in `public/content/audio/`
3. **Browser compatibility**: Test in multiple browsers
4. **File size**: Large files may take time to load

### CMS Upload Issues

1. **File size limit**: Check your hosting provider's upload limits
2. **File permissions**: Ensure the `public/content/audio/` directory is writable
3. **File format**: Only upload supported audio formats

### Player Not Appearing

1. **Check excerpt data**: Ensure the excerpt has a valid `audiofile` path
2. **Verify slug**: Make sure the excerpt slug matches what's in the CMS
3. **Published status**: Confirm the excerpt is marked as published

### Styling Issues

1. **CSS conflicts**: Check for conflicting styles in global CSS
2. **CSS variables**: Ensure your design system's CSS variables are defined
3. **Module import**: Verify the CSS module is properly imported

### Inline Audio Player Tags

The system supports embedding audio players directly in markdown content using custom tags:

**Attributes:**
- `slug` (required): The slug of the audio excerpt to play
- `title` (optional): Custom title to display above the player

**Examples:**
```html
<!-- Basic usage -->
<audio-player slug="chapter-1-excerpt"></audio-player>

<!-- With custom title -->
<audio-player slug="meditation-guide" title="Guided Meditation"></audio-player>
```

**Styling:**
- Automatically styled to match your design system
- Responsive design for mobile and desktop
- Loading states and error handling built-in
- Integrates seamlessly with your existing content flow

## Development

### Adding New Features

To extend the audio player system:

1. **New fields**: Add fields to the CMS configuration in `public/admin/config.yml`
2. **Types**: Update TypeScript interfaces in `types/audio.ts`
3. **Components**: Create new components following the existing patterns
4. **Utilities**: Add helper functions to `lib/audio.ts`

### Testing

Test the audio system by:

1. Creating sample excerpts through the CMS
2. Adding them to different page types
3. Testing playback in multiple browsers
4. Verifying mobile responsiveness

## Support

For issues related to:
- **DecapCMS**: Check the [DecapCMS documentation](https://decapcms.org/docs/)
- **Audio Player**: See [react-h5-audio-player docs](https://www.npmjs.com/package/react-h5-audio-player)
- **Next.js**: Refer to [Next.js documentation](https://nextjs.org/docs)