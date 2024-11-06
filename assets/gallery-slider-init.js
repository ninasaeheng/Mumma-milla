

// Enhanced initialize function with Safari fixes
function initGallerySliders() {
  // Force layout recalculation for Safari
  document.body.offsetHeight;

  // Create constants for common configurations
  let commonArrows = {
    prevArrow:
      '<div class="slick-slider__prev"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-caret" viewBox="0 0 10 6"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor"></svg></div>',
    nextArrow:
      '<div class="slick-slider__next"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-caret" viewBox="0 0 10 6"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor"></svg></div>',
  };

  let thumbnailArrows = {
    prevArrow:
      '<button class="slide-arrow prev-arrow"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>',
    nextArrow:
      '<button class="slide-arrow next-arrow"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></button>',
  };

  const sliderConfigs = [
    {
      selector: ".thumbnail-slider .slider--mobile",
      options: {
        ...thumbnailArrows,
        vertical: true,
        verticalSwiping: true,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 2000,
        infinite: false,
        dots: false,
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
async function initGallerySlider() {
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
      initGallerySliders();
    } else {
      document.addEventListener("DOMContentLoaded", initGallerySliders);
    }

    // Reinitialize on Shopify section updates
    document.addEventListener("shopify:section:load", function () {
      initGallerySliders();
    });
  } catch (error) {
    console.error("Slider initialization failed:", error);
  }
}

// Start initialization
initGallerySlider();
