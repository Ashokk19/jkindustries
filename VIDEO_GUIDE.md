# J.K. Industries — Machine Video Management Guide

This guide explains how to add, update, and manage videos for machines displayed on the **Products Catalogue page** (the Spotlight Machine Viewport) and individual **Product Detail pages**.

---

## 1. Where to Add or Update Video Links

All machine videos are configured in a single, central file:

📁 **[`src/data/videos.ts`](file:///c:/Users/ASureshKumar/Documents/JKIndu/src/data/videos.ts)**

You do **not** need to touch any UI components, HTML, or styling files. Adding or updating a link in `videos.ts` automatically updates both:
- **Catalogue Spotlight Machine** (`/products`)
- **Product Detail Page** (`/products/:slug`)

---

## 2. How to Add a Single Video to a Machine

### Step 1: Upload the Video to Supabase Storage
1. Open your Supabase Dashboard → **Storage** → `machine-videos` bucket (ensure it is marked Public).
2. Upload your `.mp4` video (e.g., `TagCardCounting.mp4`).
3. Copy the **Public URL** of the uploaded video.

### Step 2: Open `src/data/videos.ts`
Locate the `MACHINE_VIDEOS` dictionary in [src/data/videos.ts](file:///c:/Users/ASureshKumar/Documents/JKIndu/src/data/videos.ts):

```typescript
export const MACHINE_VIDEOS: Record<string, string | string[]> = {
  'flatbed-label-printing-machine':
    'https://rrhxvbvwoflmcuambkic.supabase.co/storage/v1/object/public/machine-videos/FlatbedLabelPrinting.mp4',
  'flatbed-screen-printing-machine':
    'https://rrhxvbvwoflmcuambkic.supabase.co/storage/v1/object/public/machine-videos/FlatbedScreenPrinting.mp4',
  'tape-roll-screen-printing-machine':
    'https://rrhxvbvwoflmcuambkic.supabase.co/storage/v1/object/public/machine-videos/TapeRollScreenPrinting.mp4',
  'label-ultrasonic-cutting-machine':
    'https://rrhxvbvwoflmcuambkic.supabase.co/storage/v1/object/public/machine-videos/UltrasonicLabelCutting.mp4',

  // ➕ ADD YOUR NEW MACHINE VIDEO HERE:
  'tag-card-counting-machine':
    'https://rrhxvbvwoflmcuambkic.supabase.co/storage/v1/object/public/machine-videos/TagCardCounting.mp4',
};
```

### Step 3: Save and Verify
Save the file. Your dev server will automatically reload (`HMR`), and the new video will immediately appear and run for that machine!

---

## 3. How to Add Multiple Videos for a Machine (2 or More)

The viewer natively supports **multiple videos** per machine. If you have multiple videos (e.g. an overall overview video + an operational close-up or feeding demo), supply an **array of URLs `[...]`**:

### Example in `src/data/videos.ts`:

```typescript
export const MACHINE_VIDEOS: Record<string, string | string[]> = {
  // Machine with multiple videos:
  'flatbed-label-printing-machine': [
    'https://rrhxvbvwoflmcuambkic.supabase.co/storage/v1/object/public/machine-videos/FlatbedLabelPrinting_Overview.mp4',
    'https://rrhxvbvwoflmcuambkic.supabase.co/storage/v1/object/public/machine-videos/FlatbedLabelPrinting_Operation.mp4',
  ],

  // Machines with a single video continue to use a simple string:
  'label-ultrasonic-cutting-machine':
    'https://rrhxvbvwoflmcuambkic.supabase.co/storage/v1/object/public/machine-videos/UltrasonicLabelCutting.mp4',
};
```

### How the UI Displays Multiple Videos:
- **First video plays by default** when viewing the machine.
- **Thumbnail bar** displays numbered video buttons:
  - `Video 1` with play icon
  - `Video 2` with play icon
  - Followed by machine photo thumbnails
- Clicking `Video 1` switches the main screen to Video 1.
- Clicking `Video 2` switches the main screen to Video 2.
- Clicking any photo thumbnail switches the screen to that photo.
- Clicking back to any video thumbnail switches back to that video.

---

## 4. Machine Slugs Reference Table

Use the exact slug string as the key in `MACHINE_VIDEOS`:

| # | Machine Name | Model Code | Slug Key | Current Video Status |
|---|---|---|---|---|
| 01 | Flatbed Label Printing Machine | `JKI-FPM-01` | `flatbed-label-printing-machine` | ✅ Active |
| 02 | Label Ultrasonic Cutting Machine | `JKI-UCM-02` | `label-ultrasonic-cutting-machine` | ✅ Active |
| 03 | Tape Roll Screen Printing Machine | `JKI-TSP-03` | `tape-roll-screen-printing-machine` | ✅ Active |
| 04 | Flatbed Screen Printing Machine | `JKI-FSP-04` | `flatbed-screen-printing-machine` | ✅ Active |
| 05 | Tag / Card Counting Machine | `JKI-TCC-05` | `tag-card-counting-machine` | ⚪ Add link when ready |
| 06 | Roll to Roll Winding Machine | `JKI-RWM-06` | `roll-to-roll-winding-machine` | ⚪ Add link when ready |
| 07 | Screen Printing Machine | `JKI-SPM-07` | `screen-printing-machine` | ⚪ Add link when ready |
| 08 | Die Cutting Machine | `JKI-DCM-08` | `die-cutting-machine` | ⚪ Add link when ready |
| 09 | BOPP Core Cutting Machine | `JKI-CCR-09` | `bopp-core-cutting-machine` | ⚪ Add link when ready |
| 10 | Label Winding Machine | `JKI-LWM-10` | `label-winding-machine` | ⚪ Add link when ready |

> **Note:** If an admin creates a custom machine with a new slug via the admin panel, simply use that new machine's slug as the key in `src/data/videos.ts`.

---

## 5. Recommended Video Specs

For the fastest loading and smoothest playback on mobile and desktop:
- **Format:** MP4 (`video/mp4`) with H.264 video codec and AAC audio (if audio is present)
- **Resolution:** 1080p (1920×1080) or 720p (1280×720)
- **Compression:** HandBrake or ffmpeg with `faststart` (web-optimized so playback starts before full download)
- **Audio:** Videos play muted by default (standard browser autoplay requirement). Users can unmute using player controls.

---

## 6. How to Deploy Changes

After editing [`src/data/videos.ts`](file:///c:/Users/ASureshKumar/Documents/JKIndu/src/data/videos.ts):

```powershell
git add src/data/videos.ts
git commit -m "Update machine videos"
git push
```

Vercel will automatically build and deploy the updated video links live within ~1 minute.
