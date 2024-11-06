// Enhanced initialize function with Safari fixes
function initBundleSliders() {

  console.log("initBundleSliders");
  // Force layout recalculation for Safari
  document.body.offsetHeight;

  // Create constants for common configurations
  const commonArrows = {
    prevArrow:
      '<div class="slick-slider__prev"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-caret" viewBox="0 0 10 6"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor"></svg></div>',
    nextArrow:
      '<div class="slick-slider__next"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-caret" viewBox="0 0 10 6"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor"></svg></div>',
  };

  const productBundleArrows = {
    prevArrow:
      '<div class="slick-slider__prev"><svg xmlns="http://www.w3.org/2000/svg" width="24.105" height="42.731" viewBox="0 0 24.105 42.731"><g id="g2193" transform="translate(180.386 456.21)"><path id="path1803-1-2" d="M-179.326-367.222l21.986,20.306" transform="translate(0 -67.623)" fill="none" stroke="#c3c3c3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path id="path1805-1-8" d="M-179.326-434.845l21.986-20.306" transform="translate(0)" fill="none" stroke="#c3c3c3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></g></svg></div>',
    nextArrow:
      '<div class="slick-slider__next"><svg xmlns="http://www.w3.org/2000/svg" width="24.105" height="42.731" viewBox="0 0 24.105 42.731"><g id="g2193" transform="translate(1.06 1.06)"><path id="path1803-1-2" d="M-157.341-367.222l-21.986,20.306" transform="translate(179.326 387.528)" fill="none" stroke="#c3c3c3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path id="path1805-1-8" d="M-157.341-434.845l-21.986-20.306" transform="translate(179.326 455.151)" fill="none" stroke="#c3c3c3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></g></svg></div>',
  };

  const commonSettings = {
    infinite: true,
    autoplay: false,
    dots: false,
    arrows: true,
    // ...commonArrows,
    // Safari-specific optimizations
    touchThreshold: 10,
    waitForAnimate: false,
    useTransform: true,
    respondTo: "slider",
  };

  const sliderConfigs = [
    {
      selector: ".pb_top_products .product__slider",
      options: {
        ...commonSettings,
        ...productBundleArrows,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
              centerMode: true,
            },
          },
        ],
      },
    },
    {
      selector: ".pb_bottom_products .product__slider",
      options: {
        ...commonSettings,
        ...productBundleArrows,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
              centerMode: true,
            },
          },
        ],
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

  // Bind events after initialization
  bindSlickEvents();
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
async function initBundleSlide() {
  console.log("initBundleSlide");
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
      initBundleSliders();
    } else {
      document.addEventListener("DOMContentLoaded", initBundleSliders);
    }

    // Reinitialize on Shopify section updates
    document.addEventListener("shopify:section:load", function () {
      initBundleSliders();
    });
  } catch (error) {
    console.error("Slider initialization failed:", error);
  }
}

// Start initialization
initBundleSlide();

// Optimized event binding function
function bindSlickEvents() { 
  const $topSlider = $(".pb_top_products .product__slider");
  const $bottomSlider = $(".pb_bottom_products .product__slider");

  if ($topSlider.length) {
    $topSlider.on("afterChange", function (event, slick, currentSlide) {
      const element = slick.$slides
        .get(currentSlide)
        .querySelector(".pb__product");
      const dataId = element?.getAttribute("data-id");
      if (!dataId) return;

      const $details = $(`.pb_top_detail [data-id="${dataId}"]`);
      $details
        .removeClass("hidden")
        .addClass("selected")
        .siblings()
        .addClass("hidden")
        .removeClass("selected");

      // Update the form variant
      const selectedProduct = $details[0];
      if (selectedProduct) {
        const variantId = selectedProduct.getAttribute("v-id");
        if (variantId) {
          const formWrapper = selectedProduct.closest(".pb__sibar");
          if (formWrapper) {
            const form = formWrapper.querySelector("product-form");
            const formInput = form?.querySelector('input[name="id"]');
            if (form && formInput) {
              formInput.value = variantId;
              form.setAttribute("data-variant-id", variantId);
              console.log("Updated top slider form variant:", variantId);
            }
          }
        }
      }

      totalPrice();
      updateProductOptionsText();
    });
  }

  if ($bottomSlider.length) {
    console.log($bottomSlider.length);
    $bottomSlider.on("afterChange", function (event, slick, currentSlide) {
      const element = slick.$slides
        .get(currentSlide)
        .querySelector(".pb__product");
      const dataId = element?.getAttribute("data-id");
      if (!dataId) return;

      const $details = $(`.pb_bottom_detail [data-id="${dataId}"]`);
      $details
        .removeClass("hidden")
        .addClass("selected")
        .siblings()
        .addClass("hidden")
        .removeClass("selected");

      // Update the form variant
      const selectedProduct = $details[0];
      if (selectedProduct) {
        const variantId = selectedProduct.getAttribute("v-id");
        if (variantId) {
          const formWrapper = selectedProduct.closest(".pb__sibar");
          if (formWrapper) {
            const form = formWrapper.querySelector("product-form");
            const formInput = form?.querySelector('input[name="id"]');
            if (form && formInput) {
              formInput.value = variantId;
              form.setAttribute("data-variant-id", variantId);
              console.log("Updated bottom slider form variant:", variantId);
            }
          }
        }
      }

      totalPrice();
      updateProductOptionsText();
    });
  }
}

function handleBundleVariantChange(event) {
  console.debug("handle bundle variant change...");
  const productForm = event.target.closest(".pb__td_item");
  if (!productForm) return;

  try {
    const selectedOptions = Array.from(
      productForm.querySelectorAll('input[type="radio"]:checked')
    ).map((input) => input.value);
    const scriptElement = productForm.querySelector(
      'script[type="application/json"]'
    );
    if (!scriptElement) return;

    const script = JSON.parse(scriptElement.textContent);
    const currentVariant = script.find((item) =>
      item.options.every((option, index) => option === selectedOptions[index])
    );

    if (currentVariant) {
      console.log("handleBundleVariantChange currentVariant ", currentVariant);

      // Check for bottom section before updating
      const productFormUpdateBtm = productForm.closest(".pb_bottom_detail");
      if (productFormUpdateBtm) {
        const formWrapper = productFormUpdateBtm.closest(".pb__sibar");
        if (formWrapper) {
          const form = formWrapper.querySelector("product-form");
          const formInput = form?.querySelector('input[name="id"]');
          if (form && formInput) {
            formInput.value = currentVariant.id;
            form.setAttribute("data-variant-id", currentVariant.id);
            console.log("Updated bottom form variant:", currentVariant.id);
          }
        }
      }

      // Check for top section before updating
      const productFormUpdateTop = productForm.closest(".pb_top_detail");
      if (productFormUpdateTop) {
        const formWrapper = productFormUpdateTop.closest(".pb__sibar");
        if (formWrapper) {
          const form = formWrapper.querySelector("product-form");
          const formInput = form?.querySelector('input[name="id"]');
          if (form && formInput) {
            formInput.value = currentVariant.id;
            form.setAttribute("data-variant-id", currentVariant.id);
            console.log("Updated top form variant:", currentVariant.id);
          }
        }
      }

      // Update other elements
      productForm.setAttribute("v-id", currentVariant.id);
      const priceElement = productForm.querySelector(".pd_price");
      if (priceElement) {
        priceElement.setAttribute("data-price", currentVariant.price);
        const priceDisplay = priceElement.querySelector(".price");
        if (
          priceDisplay &&
          typeof Shopify !== "undefined" &&
          typeof Shopify.formatMoney === "function"
        ) {
          priceDisplay.textContent = Shopify.formatMoney(
            currentVariant.price,
            cartStrings?.money_format
          );
        }
      }

      totalPrice();
    }
  } catch (error) {
    console.error("Error updating bundle variant:", error);
  }
}

function totalPrice() {
  try {
    const totalItems = document.querySelectorAll(
      ".pb__td_item.selected .pd_price"
    );
    const totalPrice = Array.from(totalItems).reduce(
      (sum, item) => sum + parseInt(item.getAttribute("data-price")),
      0
    );

    const totalPriceElement = document.querySelector(".total_price .tp_ptice");
    // Add null check before updating the total price element
    if (!totalPriceElement) {
      console.log("Total price element not found, skipping price update");
      return;
    }

    // Check if Shopify.formatMoney exists, otherwise use a fallback formatter
    if (
      typeof Shopify !== "undefined" &&
      typeof Shopify.formatMoney === "function"
    ) {
      totalPriceElement.textContent = Shopify.formatMoney(
        totalPrice,
        cartStrings?.money_format
      );
    } else {
      // Fallback formatter - formats as basic currency with 2 decimal places
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(totalPrice / 100);

      totalPriceElement.textContent = formatted;
    }
  } catch (error) {
    console.warn("Error updating total price:", error);
  }
}

// Text update function for product options
function updateProductOptionsText() {
  console.log("Updating text");
  $(".top-text").text("Options");
  $(".slick-current .top-text").text("Your Selection");
}

function waitForShopify() {
  return new Promise((resolve) => {
    if (
      typeof Shopify !== "undefined" &&
      typeof Shopify.formatMoney === "function"
    ) {
      resolve();
    } else {
      const check = () => {
        if (
          typeof Shopify !== "undefined" &&
          typeof Shopify.formatMoney === "function"
        ) {
          resolve();
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    }
  });
}

// Product bundle functionality
function initProductBundle() {
  console.log("initProductBundle");
  const bundleProducts = document.querySelectorAll(".pb__td_item");

  // Find which product should actually be selected (first non-hidden one)
  const firstVisibleProduct = document.querySelector(
    ".pb__td_item:not(.hidden)"
  );

  // Remove selected class from all products first
  bundleProducts.forEach((product) => {
    product.classList.remove("selected");
  });

  // Add selected class only to the first visible product
  if (firstVisibleProduct) {
    firstVisibleProduct.classList.add("selected");
  }

  bundleProducts.forEach((product) => {
    const currentVariant = parseInt(product.getAttribute("v-id"));
    const scriptElement = product.querySelector(
      'script[type="application/json"]'
    );
    if (!scriptElement) {
      console.error("No variant script found for product");
      return;
    }

    const script = JSON.parse(scriptElement.textContent);
    let selectedOption = script.find((item) => item.id === currentVariant);
    if (!selectedOption && script.length > 0) {
      selectedOption = script[0];
      product.setAttribute("v-id", selectedOption.id);
    }

    console.log(
      "Processing product:",
      product.querySelector(".title")?.textContent
    );
    console.log("currentVariant ", currentVariant);
    console.log("selectedOption ", selectedOption);

    if (selectedOption) {
      // Set the initial variant ID in the product form
      const setFormVariant = (detail) => {
        // Only set form variant if this product is selected
        if (!product.classList.contains("selected")) {
          console.log("Product not selected, skipping form update");
          return;
        }

        const productDetail = product.closest(detail);
        if (productDetail) {
          console.log(`Found ${detail}`);
          const sibar = productDetail.closest(".pb__sibar");
          if (sibar) {
            const productForm = sibar.querySelector("product-form");
            if (productForm) {
              const variantInput =
                productForm.querySelector('input[name="id"]');
              if (variantInput) {
                console.log(`Setting variant ID to ${selectedOption.id}`);
                variantInput.value = selectedOption.id;
                productForm.setAttribute("data-variant-id", selectedOption.id);
              }
            }
          }
        }
      };

      // Check which sections exist before trying to set variants
      const hasTopSection = document.querySelector(".pb_top_detail") !== null;
      const hasBottomSection =
        document.querySelector(".pb_bottom_detail") !== null;

      if (hasTopSection) {
        setFormVariant(".pb_top_detail");
      }

      if (hasBottomSection) {
        setFormVariant(".pb_bottom_detail");
      }

      // Set initial options
      selectedOption.options.forEach((item, index) => {
        const input = product.querySelector(`input[value="${item}"]`);
        if (input) {
          input.checked = true;
        }
      });

      // Update price display
      const priceElement = product.querySelector(".pd_price");
      if (priceElement) {
        priceElement.setAttribute("data-price", selectedOption.price);
        const priceDisplay = priceElement.querySelector(".price");
        if (
          priceDisplay &&
          typeof Shopify !== "undefined" &&
          typeof Shopify.formatMoney === "function"
        ) {
          priceDisplay.textContent = Shopify.formatMoney(
            selectedOption.price,
            cartStrings?.money_format
          );
        }
      }
    }

    // Add change event listeners
    product.querySelectorAll('input[type="radio"]').forEach((radio) => {
      radio.addEventListener("change", handleBundleVariantChange);
    });
  });

  // Calculate initial price
  totalPrice();
  updateProductOptionsText();
}

// Create a flag to track initialization
let isInitialized = false;

async function initializeEverything() {
  // Prevent double initialization
  if (isInitialized) {
    console.log("Already initialized, skipping");
    return;
  }

  try {
    await waitForShopify();
    // Add check for required elements before initialization
    const hasRequiredElements =
      document.querySelector(".pb__td_item") &&
      document.querySelector(".total_price .tp_ptice");

    if (!hasRequiredElements) {
      console.log("Required elements not found, skipping initialization");
      return;
    }

    console.log("Initializing product bundle...");
    initProductBundle();
    updateProductOptionsText();
    isInitialized = true;
  } catch (error) {
    console.error("Error during initialization:", error);
  }
}

// Start initialization - only use one event listener
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeEverything);
} else {
  initializeEverything();
}
