Module.register("MMM-ImmichSlideShow", {
  defaults: {
    immichUrl: "http://your-immich-server:2283",
    apiKey: "your-api-key-here",
    albums: [], // Array of album names to display
    updateInterval: 3000, // Time between image changes (ms)
    transitionSpeed: 1000, // Transition duration (ms)
    transition: "fade", // fade, slideLeft, slideRight, slideUp, slideDown, zoom
    showImageInfo: true,
    showFileName: false,
    showCamera: false,
    showDate: true,
    showLocation: true,
    showImageRating: true, // New option
    imageWidth: "100%",
    imageHeight: "auto",
    maxWidth: "1200px",
    maxHeight: "800px",
    refreshInterval: 60 * 60 * 1000, // 1 hour
  },

   updateClockDom: function () {
    // Scope search to this module's container
    const digitalWrapper = document.querySelector("#" + this.identifier + " .immich-digital");
    if (digitalWrapper) {
      const dateWrapper = digitalWrapper.querySelector(".date");
      const hoursWrapper = digitalWrapper.querySelector(".clock-hour-digital");
      const minutesWrapper = digitalWrapper.querySelector(".clock-minute-digital");
      const secondsWrapper = digitalWrapper.querySelector(".clock-second-digital");

      const now = moment();
      if (dateWrapper) dateWrapper.innerHTML = now.format("dddd, LL");
      if (hoursWrapper) hoursWrapper.innerHTML = now.format("HH");
      if (minutesWrapper) minutesWrapper.innerHTML = now.format("mm");
      if (secondsWrapper) secondsWrapper.innerHTML = now.format("ss");
    } else {
      // If DOM isn't ready, updateDom will create it
      this.updateDom();
    }
  },

  start: function () {
    Log.info("Starting module: " + this.name);
    this.albumData = [];
    this.allImages = [];
    this.currentImageIndex = 0;
    this.loaded = false;
    this.error = null;

    this.fetchAlbumData();
    this.scheduleUpdate();

    // Schedule periodic refresh
    setInterval(() => {
      this.fetchAlbumData();
    }, this.config.refreshInterval);

    this.startClock();
  },

  startClock() {
    // Schedule update interval.
    this.second = moment().second();
    this.minute = moment().minute();

    // Calculate how many ms should pass until next update depending on if seconds is displayed or not
    const delayCalculator = (reducedSeconds) => {
      const EXTRA_DELAY = 50; // Deliberate imperceptible delay to prevent off-by-one timekeeping errors
      return 1000 - moment().milliseconds() + EXTRA_DELAY;      
    };

    // A recursive timeout function instead of interval to avoid drifting
    const notificationTimer = () => {
      this.updateClockDom();

      if (this.config.sendNotifications) {
        // If seconds is displayed CLOCK_SECOND-notification should be sent (but not when CLOCK_MINUTE-notification is sent)
        if (this.config.displaySeconds) {
          this.second = moment().second();
          if (this.second !== 0) {
            this.sendNotification("CLOCK_SECOND", this.second);
            setTimeout(notificationTimer, delayCalculator(0));
            return;
          }
        }

        // If minute changed or seconds isn't displayed send CLOCK_MINUTE-notification
        this.minute = moment().minute();
        this.sendNotification("CLOCK_MINUTE", this.minute);
      }

      setTimeout(notificationTimer, delayCalculator(0));
    };

    // Set the initial timeout with the amount of seconds elapsed as
    // reducedSeconds, so it will trigger when the minute changes
    setTimeout(notificationTimer, delayCalculator(this.second));

    // Set locale.
    moment.locale(config.language);
  },

  getDom: function () {
    const wrapper = document.createElement("div");
    wrapper.className = "immich-slideshow-wrapper";

    if (this.error) {
      wrapper.innerHTML = `<div class="error">Error: ${this.error}</div>`;
      return wrapper;
    }

    if (!this.loaded) {
      wrapper.innerHTML = '<div class="loading">Loading images...</div>';
      return wrapper;
    }

    if (this.allImages.length === 0) {
      wrapper.innerHTML = '<div class="no-images">No images found in albums</div>';
      return wrapper;
    }

    const currentImage = this.allImages[this.currentImageIndex];

    const container = document.createElement("div");
    container.className = "image-container";

    // Determine if image is portrait based on exif data
    const isPortrait = this.isPortraitImage(currentImage);
    if (isPortrait) {
      container.classList.add("portrait");
    } else {
      container.classList.add("landscape");
    }

    const img = document.createElement("img");
    img.src = currentImage.url;
    img.className = "slideshow-image";
    img.alt = currentImage.originalFileName || "Immich Image";

    container.appendChild(img);

    if (this.config.showImageInfo) {
      const info = document.createElement("div");
      info.className = "image-info";

      const parts = [];

      // Add filename if enabled
      if (this.config.showFileName && currentImage.originalFileName) {
        parts.push(currentImage.originalFileName);
      }

      // Add camera make and model if enabled
      if (this.config.showCamera && currentImage.exifInfo && (currentImage.exifInfo.make || currentImage.exifInfo.model)) {
        const camera = `${currentImage.exifInfo.make || ''} ${currentImage.exifInfo.model || ''}`.trim();
        if (camera) {
          parts.push(camera);
        }
      }

      // Add date if enabled
      if (this.config.showDate && currentImage.exifInfo && currentImage.exifInfo.dateTimeOriginal) {
        const date = new Date(currentImage.exifInfo.dateTimeOriginal);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        parts.push(`${day} ${month} ${year}`);
      }

      // Add location if enabled
      if (this.config.showLocation && currentImage.location) {
        parts.push(currentImage.location);
      }

      // Add image rating if enabled
      if (this.config.showImageRating && currentImage.exifInfo.rating && currentImage.exifInfo.rating > 0) {
        parts.push("⭐".repeat(currentImage.exifInfo.rating));
      }

      if (parts.length > 0) {
        info.innerHTML = parts.join(" • ");
        container.appendChild(info);
      }
    }

    wrapper.appendChild(container);

    const digitalWrapper = document.createElement("div");
    digitalWrapper.className = "immich-digital";

    /************************************
     * Create wrappers for DIGITAL clock
     */
    const dateWrapper = document.createElement("div");
    const timeWrapper = document.createElement("div");
    const hoursWrapper = document.createElement("span");
    const minutesWrapper = document.createElement("span");
    const secondsWrapper = document.createElement("sup");

    // Style Wrappers
    dateWrapper.className = "date bright large";
    timeWrapper.className = "time bright large light";
    hoursWrapper.className = "clock-hour-digital";
    minutesWrapper.className = "clock-minute-digital";
    secondsWrapper.className = "clock-second-digital dimmed";

    // Set content of wrappers.    
    const now = moment();
  
    dateWrapper.innerHTML = now.format('dddd, LL');
    digitalWrapper.appendChild(dateWrapper);

    let hourSymbol = "HH";    
    hoursWrapper.innerHTML = now.format(hourSymbol);
    minutesWrapper.innerHTML = now.format("mm");

    timeWrapper.appendChild(hoursWrapper);
    timeWrapper.innerHTML += ":";  
    timeWrapper.appendChild(minutesWrapper);
    secondsWrapper.innerHTML = now.format("ss");    
    timeWrapper.appendChild(secondsWrapper);    
    digitalWrapper.appendChild(timeWrapper);

    wrapper.appendChild(digitalWrapper);

    // Return the wrapper to the dom.
    return wrapper;
  },

  getScripts() {
    return ["moment.js", "moment-timezone.js", "suncalc.js"];
  },

  getStyles: function () {
    return ["MMM-ImmichSlideShow.css"];
  },

  scheduleUpdate: function () {
    setInterval(() => {
      this.nextImage();
    }, this.config.updateInterval);
  },

//   nextImage: function () {
//     if (this.allImages.length === 0) return;

//     const oldIndex = this.currentImageIndex;
//     this.currentImageIndex = (this.currentImageIndex + 1) % this.allImages.length;

//     // Preload the next image
//     const nextImageIndex = (this.currentImageIndex + 1) % this.allImages.length;
//     if (this.allImages[nextImageIndex]) {
//       const img = new Image();
//       img.src = this.allImages[nextImageIndex].url;
//     }

//     this.updateDom(this.config.transitionSpeed);
//   },


  nextImage: function () {
    if (this.allImages.length === 0 || this.preloadingNext) return;

    this.preloadingNext = true;
    const nextIndex = (this.currentImageIndex + 1) % this.allImages.length;
    const nextImage = this.allImages[nextIndex];

    // Preload the image
    const imgLoader = new Image();
    imgLoader.onload = () => {
      this.currentImageIndex = nextIndex;
      this.transitionToNextImage(nextImage);
      this.preloadingNext = false;
    };
    imgLoader.onerror = () => {
      Log.error("Failed to preload image: " + nextImage.url);
      this.currentImageIndex = nextIndex; // Skip it or try anyway
      this.preloadingNext = false;
    };
    imgLoader.src = nextImage.url;
  },

  transitionToNextImage: function (image) {
    const inactiveLayerId = this.activeLayer === 1 ? 2 : 1;
    const activeLayer = document.getElementById(`immich-layer-${this.activeLayer}`);
    const inactiveLayer = document.getElementById(`immich-layer-${inactiveLayerId}`);

    if (activeLayer && inactiveLayer) {
      // Update content of background layer
      this.updateLayerContent(inactiveLayer, image);

      // Swap classes
      activeLayer.classList.remove("active");
      activeLayer.classList.add("background");

      inactiveLayer.classList.remove("background");
      inactiveLayer.classList.add("active");

      this.activeLayer = inactiveLayerId;
    } else {
      // Fallback if DOM is not ready
      this.updateDom(this.config.transitionSpeed);
    }
  },

  fetchAlbumData: function () {
    this.sendSocketNotification("FETCH_ALBUMS", {
      immichUrl: this.config.immichUrl,
      apiKey: this.config.apiKey,
      albumNames: this.config.albums
    });
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "ALBUMS_DATA") {
      this.albumData = payload.albums;
      this.allImages = payload.images;
      this.loaded = true;
      this.error = null;
      this.updateDom(this.config.transitionSpeed);
    } else if (notification === "FETCH_ERROR") {
      this.error = payload.error;
      this.loaded = true;
      this.updateDom();
    }
  },

  isPortraitImage: function (image) {
    if (!image.exifInfo) return false;

    const width = image.exifInfo.exifImageWidth || 0;
    const height = image.exifInfo.exifImageHeight || 0;

    // If we have dimensions, check if height > width
    if (width > 0 && height > 0) {
      return height > width;
    }

    // Check orientation tag if available
    const orientation = image.exifInfo.orientation;
    // Orientations 5, 6, 7, 8 are rotated 90 degrees (portrait)
    if (orientation && [5, 6, 7, 8].includes(parseInt(orientation))) {
      return true;
    }

    return false;
  }
});