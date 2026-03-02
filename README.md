# MMM-ImmichSlideShow
<<<<<<< HEAD
A MagicMirror² module that displays a slideshow of images from an Immich server album.
=======
>>>>>>> 8bbbdc76cf591094f0d989cf1a52a7bb122f721b

A MagicMirror² module to display images from your Immich server albums as a slideshow with various transition effects.

<<<<<<< HEAD
# MMM-ImmichSlideShow

*MMM-ImmichSlideshow* is a module for [MagicMirror²](https://github.com/MagicMirrorOrg/MagicMirror) that displays a slideshow of images from an Immich server album.

## Screenshot

(Please add a screenshot of the module here)
=======
## Features

- Display images from multiple Immich albums
- Multiple transition effects (fade, slide, zoom)
- Display image metadata (filename, camera info, date)
- Automatic shared link creation for albums
- Configurable update intervals and image sizes
- No external dependencies (uses only Node.js built-in modules)
>>>>>>> 8bbbdc76cf591094f0d989cf1a52a7bb122f721b

## Installation

1. Navigate to your MagicMirror's modules folder:
```bash
cd ~/MagicMirror/modules
```

2. Clone or create this module:
```bash
<<<<<<< HEAD
cd ~/MagicMirror/modules/MMM-ImmichSlideshow
git pull
=======
mkdir MMM-ImmichSlideShow
cd MMM-ImmichSlideShow
>>>>>>> 8bbbdc76cf591094f0d989cf1a52a7bb122f721b
```

3. Copy the following files into the module directory:
   - `MMM-ImmichSlideShow.js`
   - `node_helper.js`
   - `MMM-ImmichSlideShow.css`

## Configuration

Add the module to your `config/config.js` file:

<<<<<<< HEAD
### Example configuration

Minimal configuration to use the module:

```js
    {
        module: 'MMM-ImmichSlideshow',
        position: 'fullscreen_below',
        config: {
            immichUrl: "http://your-immich-server:2283",
            apiKey: "your-api-key-here",
            albums: ["Family Photos"], // Array of album names to display
            updateInterval: 5000, // Time between image changes (ms)
            transitionSpeed: 2000, // Transition duration (ms)
            refreshInterval: 3600000 // 1 hour
        }
    },
=======
```javascript
{
  module: "MMM-ImmichSlideShow",
  position: "middle_center", // or any other position
  config: {
    immichUrl: "http://your-immich-server:2283",
    apiKey: "your-immich-api-key",
    albums: ["Family Photos", "Vacation 2024", "Nature"],
    updateInterval: 10000, // 10 seconds between images
    transitionSpeed: 1000, // 1 second transition
    transition: "fade", // fade, slideLeft, slideRight, slideUp, slideDown, zoom
    showImageInfo: true,
    showFileName: true,
    showCamera: true,
    showDate: true,
    showLocation: true,
    imageWidth: "100%",
    imageHeight: "auto",
    maxWidth: "1200px",
    maxHeight: "800px"
  }
}
>>>>>>> 8bbbdc76cf591094f0d989cf1a52a7bb122f721b
```

## Configuration Options

<<<<<<< HEAD
```js
    {
        module: 'MMM-ImmichSlideshow',
        position: 'fullscreen_below',
        config: {
            immichUrl: "http://your-immich-server:2283",
            apiKey: "your-api-key-here",
            albums: ["Family Photos", "Vacation"], // Array of album names to display
            updateInterval: 5000, // Time between image changes (ms)
            transitionSpeed: 2000, // Transition duration (ms)
            transition: "fade", // fade, slideLeft, slideRight, slideUp, slideDown, zoom
            showImageInfo: true,
            showFileName: false,
            showCamera: false,
            showDate: true,
            showLocation: true,
            imageWidth: "100%",
            imageHeight: "auto",
            maxWidth: "1200px",
            maxHeight: "800px",
            refreshInterval: 3600000 // 1 hour
        }
    },
=======
| Option | Description | Default | Required |
|--------|-------------|---------|----------|
| `immichUrl` | URL of your Immich server | `http://your-immich-server:2283` | Yes |
| `apiKey` | Your Immich API key | `your-api-key-here` | Yes |
| `albums` | Array of album names to display | `[]` | Yes |
| `updateInterval` | Time between image changes (ms) | `10000` | No |
| `transitionSpeed` | Transition duration (ms) | `1000` | No |
| `transition` | Transition effect | `fade` | No |
| `showImageInfo` | Show image metadata overlay | `true` | No |
| `showFileName` | Show original filename | `true` | No |
| `showCamera` | Show camera make and model | `true` | No |
| `showDate` | Show date taken | `true` | No |
| `showLocation` | Show location (city, state, country) | `true` | No |
| `imageWidth` | CSS width for images | `100%` | No |
| `imageHeight` | CSS height for images | `auto` | No |
| `maxWidth` | Maximum container width | `1200px` | No |
| `maxHeight` | Maximum container height | `800px` | No |
>>>>>>> 8bbbdc76cf591094f0d989cf1a52a7bb122f721b

## Transition Effects

<<<<<<< HEAD
Option|Possible values|Default|Description
------|------|------|-----------
`immichUrl`|`string`|`"http://your-immich-server:2283"`|The URL of your Immich server.
`apiKey`|`string`|`"your-api-key-here"`|Your Immich API key.
`albums`|`array`|`[]`|An array of album names to display.
`updateInterval`|`number`|`5000`|Time between image changes in milliseconds.
`transitionSpeed`|`number`|`2000`|Transition duration in milliseconds.
`transition`|`string`|`"fade"`|Type of transition: `fade`, `slideLeft`, `slideRight`, `slideUp`, `slideDown`, `zoom`.
`showImageInfo`|`boolean`|`true`|Whether to show image information (filename, camera, date, location).
`showFileName`|`boolean`|`false`|Whether to show the original file name.
`showCamera`|`boolean`|`false`|Whether to show camera make and model from EXIF data.
`showDate`|`boolean`|`true`|Whether to show the date the photo was taken from EXIF data.
`showLocation`|`boolean`|`true`|Whether to show location information from EXIF data.
`imageWidth`|`string`|`"100%"`|CSS width for the image.
`imageHeight`|`string`|`"auto"`|CSS height for the image.
`maxWidth`|`string`|`"1200px"`|Maximum width for the image container.
`maxHeight`|`string`|`"800px"`|Maximum height for the image container.
`refreshInterval`|`number`|`3600000`|Time between refreshing the album data from the Immich server in milliseconds (1 hour).


=======
Available transition options:
- `fade` - Smooth fade in/out
- `slideLeft` - Slide in from the right
- `slideRight` - Slide in from the left
- `slideUp` - Slide in from the bottom
- `slideDown` - Slide in from the top
- `zoom` - Zoom in effect

## Getting Your Immich API Key

1. Log in to your Immich web interface
2. Go to Account Settings (click your profile icon)
3. Navigate to the "API Keys" section
4. Click "New API Key"
5. Give it a name (e.g., "MagicMirror") and create it
6. Copy the generated key and use it in your config
>>>>>>> 8bbbdc76cf591094f0d989cf1a52a7bb122f721b

## How It Works

1. The module fetches all albums from your Immich server
2. It filters albums based on the names you specified in the config
3. For each album, it retrieves or creates a shared link
4. It fetches all assets (images) from those albums
5. Images are displayed using the shared link key and asset ID
6. Images rotate automatically with your chosen transition effect

## Troubleshooting

### Images not loading
- Verify your `immichUrl` is correct and accessible from your MagicMirror
- Check that your API key is valid
- Ensure the album names in your config exactly match your Immich album names
- Check the MagicMirror logs for errors: `pm2 logs MagicMirror`

### Module shows "No images found"
- Verify your albums exist and contain images
- Check album names for exact spelling (case-sensitive)
- Ensure your API key has permission to access the albums

### Module not appearing
- Verify the module is in the correct directory: `~/MagicMirror/modules/MMM-ImmichSlideShow/`
- Check that all three files are present
- Restart MagicMirror: `pm2 restart MagicMirror`

## License

MIT

## Credits

Created for MagicMirror² to integrate with Immich photo management.

## Notes
This was created using Claude
https://claude.ai/share/c0504d38-c95e-4b3b-9ffc-2cc6738596df

