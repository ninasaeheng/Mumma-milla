// Create constants for common configurations
let commonArrows = {
  prevArrow:
    '<div class="slick-slider__prev"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-caret" viewBox="0 0 10 6"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor"></svg></div>',
  nextArrow:
    '<div class="slick-slider__next"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-caret" viewBox="0 0 10 6"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor"></svg></div>',
};

let commonSettings = {
  infinite: true,
  autoplay: false,
  dots: false,
  arrows: true,
  ...commonArrows,
  // Safari-specific optimizations
  touchThreshold: 10,
  waitForAnimate: false,
  useTransform: true,
  respondTo: "slider",
};

// Enhanced initialize function with Safari fixes
function initReviewSliders() {
  // Force layout recalculation for Safari
  document.body.offsetHeight;

  const sliderConfigs = [
    {
      selector: ".customer-review-main",
      options: {
        ...commonSettings,
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ];

  // Enhanced initialization with error handling
  sliderConfigs.forEach(({ selector, options }) => {
    const $slider = $(selector);
    if (!$slider.length) return;

    try {
      // Hide slider during initialization to prevent FOUC
      $slider.css("visibility", "hidden");

      // Initialize with error handling
      $slider.slick(options);

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
      initReviewSliders();
    } else {
      document.addEventListener("DOMContentLoaded", initReviewSliders);
    }

    // Reinitialize on Shopify section updates
    document.addEventListener("shopify:section:load", function () {
      initReviewSliders();
    });
  } catch (error) {
    console.error("Slider initialization failed:", error);
  }
}

// Start initialization
init();
