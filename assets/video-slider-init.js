// Create constants for common configurations
const commonVideoArrows = {
  prevArrow:
    '<div class="slick-slider__prev"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-caret" viewBox="0 0 10 6"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor"></svg></div>',
  nextArrow:
    '<div class="slick-slider__next"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-caret" viewBox="0 0 10 6"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor"></svg></div>',
};

const commonVideoSettings = {
  infinite: true,
  autoplay: false,
  dots: false,
  arrows: true,
  ...commonVideoArrows,
  touchThreshold: 10,
  waitForAnimate: true, // Changed to true for better performance
  useTransform: true,
  respondTo: 'window' // Changed to window for better caching
};

const sliderVideoConfigs = [
  {
    selector: '.video-slider',
    options: {
      ...commonVideoSettings,
      slidesToShow: 3,
      slidesToScroll: 1,
      lazyLoad: 'ondemand',
      responsive: [
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            adaptiveHeight: true,
          },
        },
        {
          breakpoint: 370,
          settings: {
            arrows: false,
            slidesToShow: 1,
            adaptiveHeight: true,
          },
        },
      ],
    },
  },
  {
    selector: ".customer-review-main",
    options: {
      ...commonVideoSettings,
      slidesToShow: 1,
      slidesToScroll: 1,
    },
  },
];
// Enhanced initialize function with Safari fixes
function initVideoSliders() {
  // Force layout recalculation for Safari
  document.body.offsetHeight;
  
  // Enhanced initialization with error handling
  sliderVideoConfigs.forEach(({ selector, options }) => {
    const $slider = $(selector);
    if (!$slider.length) return;

    try {
      // Hide slider during initialization to prevent FOUC
      $slider.css("visibility", "hidden");

      // Initialize with error handling
      $slider.slick(options);

      // Special handling for video sliders
      if (selector === ".video-slider") {
        $slider.on(
          "beforeChange",
          function (event, slick, currentSlide, nextSlide) {
            const videos = slick.$slides.find("video").get();
            videos.forEach((video) => {
              video.pause();
              video.currentTime = 0;
            });
          }
        );

        $slider.on("afterChange", function (event, slick, currentSlide) {
          const currentVideo = $(slick.$slides[currentSlide]).find("video")[0];
          if (currentVideo) {
            currentVideo
              .play()
              .catch((e) => console.log("Video autoplay prevented:", e));
          }
        });
      }

      // Force slider refresh and show
      setTimeout(() => {
        $slider.slick("setPosition");
        $slider.css("visibility", "visible");
      }, 100);
    } catch (error) {
      console.error(`Error initializing slider ${selector}:`, error);
      $slider.css("visibility", "visible");
    }
  });
}

// Enhanced loading check
function checkSlickLoaded() {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const timeout = 5000; // 5 second timeout

    function check() {
      if (window.jQuery && jQuery().slick) {
        resolve();
        return;
      }

      if (Date.now() - startTime > timeout) {
        reject(new Error("Slick loading timeout"));
        return;
      }

      setTimeout(check, 100);
    }

    check();
  });
}

// Initialize everything with better error handling
async function init() {
  try {
    await checkSlickLoaded();

    // Check if we're in Safari
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isSafari) {
      // Add Safari-specific CSS fixes
      const style = document.createElement("style");
      style.textContent = `
        .slick-slider {
          -webkit-transform: translate3d(0,0,0);
          -webkit-backface-visibility: hidden;
          -webkit-perspective: 1000;
        }
        .slick-slide {
          -webkit-transform: translate3d(0,0,0);
        }
      `;
      document.head.appendChild(style);
    }

    // Initialize sliders
    if (document.readyState === "complete") {
      initVideoSliders();
    } else {
      document.addEventListener("DOMContentLoaded", initVideoSliders);
    }

    // Reinitialize on Shopify section updates
    document.addEventListener("shopify:section:load", function () {
      initVideoSliders();
    });
  } catch (error) {
    console.error("Slider initialization failed:", error);
  }
}

// Start initialization
init();
