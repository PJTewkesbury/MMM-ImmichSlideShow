# MMM-ImmichSlideShow

A MagicMirror² module that displays a slideshow of images from an Immich server album.

## Screenshot


## Features

- Display images from multiple Immich albums
- Multiple transition effects (fade, slide, zoom)
- Display image metadata (filename, camera info, date)
- Automatic shared link creation for albums
- Configurable update intervals and image sizes
- No external dependencies (uses only Node.js built-in modules)

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

```javascript
{
  module: "MMM-ImmichSlideShow",
  position: "middle_center", // or any other position
  config: {
    immichUrl: "http://your-immich-server:2283",
    apiKey: "your-immich-api-key",
    albums: ["Family Photos", "Vacation 2024", "Nature"],
    updateInterval: 10000, // 10 seconds between images
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
```

## Configuration Options

Option|Possible values|Default|Description
------|------|------|-----------
`immichUrl`|`string`|`"http://your-immich-server:2283"`|The URL of your Immich server.
`apiKey`|`string`|`"your-api-key-here"`|Your Immich API key.
`albums`|`array`|`[]`|An array of album names to display.
`updateInterval`|`number`|`5000`|Time between image changes in milliseconds.
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

## Getting Your Immich API Key

1. Log in to your Immich web interface
2. Go to Account Settings (click your profile icon)
3. Navigate to the "API Keys" section
4. Click "New API Key"
5. Give it a name (e.g., "MagicMirror") and create it with the following permissions - album.read, asset.read, sharedLink.read
6. Copy the generated key and use it in your config

## How It Works

1. The module fetches all albums from your Immich server
2. It filters albums based on the names you specified in the config
3. For each album, it retrieves or creates a shared link
4. It fetches all assets (images) from those albums
5. Images are displayed using the shared link key and asset ID

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

