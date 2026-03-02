const NodeHelper = require("node_helper");
const https = require("https");
const http = require("http");

module.exports = NodeHelper.create({
  start: function() {
    console.log("Starting node helper for: " + this.name);
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "FETCH_ALBUMS") {
      this.fetchAlbumsData(payload);
    }
  },

  fetchAlbumsData: async function(config) {
    try {
      // First, get all albums to find the ones we want
      const albums = await this.makeRequest(
        config.immichUrl,
        "/api/albums",
        "GET",
        config.apiKey
      );

      const albumData = [];
      const allImages = [];

      // Filter albums by name
      const targetAlbums = albums.filter(album => 
        config.albumNames.includes(album.albumName)
      );

      // For each target album, get shared link and assets
      for (const album of targetAlbums) {
        try {
          // Get or create shared link for this album
          let sharedLink = await this.getSharedLink(config, album.id);
          
          if (!sharedLink) {
            // Create a new shared link if one doesn't exist
            sharedLink = await this.createSharedLink(config, album.id);
          }

          if (sharedLink && sharedLink.key) {
            // Get album details with assets
            const albumDetails = await this.makeRequest(
              config.immichUrl,
              `/api/albums/${album.id}`,
              "GET",
              config.apiKey
            );

            // Build image URLs using shared link
            if (albumDetails.assets && albumDetails.assets.length > 0) {
              albumDetails.assets.forEach(asset => {
                const imageUrl = `${config.immichUrl}/api/assets/${asset.id}/thumbnail?key=${sharedLink.key}&size=preview`;
                
                // Build location string from exif data
                let location = null;
                if (asset.exifInfo) {
                  const locationParts = [];
                  if (asset.exifInfo.city) locationParts.push(asset.exifInfo.city);
                  if (asset.exifInfo.state) locationParts.push(asset.exifInfo.state);
                  if (asset.exifInfo.country) locationParts.push(asset.exifInfo.country);
                  
                  if (locationParts.length > 0) {
                    location = locationParts.join(", ");
                  }
                }
                
                allImages.push({
                  id: asset.id,
                  url: imageUrl,
                  albumName: album.albumName,
                  sharedKey: sharedLink.key,
                  originalFileName: asset.originalFileName,
                  exifInfo: asset.exifInfo || {},
                  location: location
                });
              });

              albumData.push({
                albumId: album.id,
                albumName: album.albumName,
                sharedKey: sharedLink.key,
                assetCount: albumDetails.assets.length
              });
            }
          }
        } catch (error) {
          console.error(`Error processing album ${album.albumName}:`, error.message);
        }
      }

      // Shuffle images for variety
      this.shuffleArray(allImages);

      this.sendSocketNotification("ALBUMS_DATA", {
        albums: albumData,
        images: allImages
      });

    } catch (error) {
      console.error("Error fetching albums:", error);
      this.sendSocketNotification("FETCH_ERROR", {
        error: error.message
      });
    }
  },

  getSharedLink: async function(config, albumId) {
    try {
      const sharedLinks = await this.makeRequest(
        config.immichUrl,
        "/api/shared-links",
        "GET",
        config.apiKey
      );

      // Find existing shared link for this album
      const link = sharedLinks.find(link => 
        link.album && link.album.id === albumId
      );

      return link || null;
    } catch (error) {
      console.error("Error getting shared links:", error.message);
      return null;
    }
  },

  createSharedLink: async function(config, albumId) {
    try {
      const sharedLink = await this.makeRequest(
        config.immichUrl,
        "/api/shared-links",
        "POST",
        config.apiKey,
        {
          type: "ALBUM",
          albumId: albumId,
          showMetadata: true,
          allowDownload: false
        }
      );

      return sharedLink;
    } catch (error) {
      console.error("Error creating shared link:", error.message);
      return null;
    }
  },

  makeRequest: function(baseUrl, path, method, apiKey, body = null) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, baseUrl);
      const protocol = url.protocol === "https:" ? https : http;

      const options = {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method: method,
        headers: {
          "x-api-key": apiKey,
          "Accept": "application/json"
        }
      };

      if (body) {
        const bodyString = JSON.stringify(body);
        options.headers["Content-Type"] = "application/json";
        options.headers["Content-Length"] = Buffer.byteLength(bodyString);
      }

      const req = protocol.request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const parsed = JSON.parse(data);
              resolve(parsed);
            } catch (e) {
              resolve(data);
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      });

      req.on("error", (error) => {
        reject(error);
      });

      if (body) {
        req.write(JSON.stringify(body));
      }

      req.end();
    });
  },

  shuffleArray: function(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
});