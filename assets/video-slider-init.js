// Create constants for common configurations
const commonArrows = {
    prevArrow: '<div class="slick-slider__prev"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-caret" viewBox="0 0 10 6"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor"></svg></div>',
    nextArrow: '<div class="slick-slider__next"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-caret" viewBox="0 0 10 6"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor"></svg></div>'
  };
  
  const productBundleArrows = {
    prevArrow: '<div class="slick-slider__prev"><svg xmlns="http://www.w3.org/2000/svg" width="24.105" height="42.731" viewBox="0 0 24.105 42.731"><g id="g2193" transform="translate(180.386 456.21)"><path id="path1803-1-2" d="M-179.326-367.222l21.986,20.306" transform="translate(0 -67.623)" fill="none" stroke="#c3c3c3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path id="path1805-1-8" d="M-179.326-434.845l21.986-20.306" transform="translate(0)" fill="none" stroke="#c3c3c3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></g></svg></div>',
    nextArrow: '<div class="slick-slider__next"><svg xmlns="http://www.w3.org/2000/svg" width="24.105" height="42.731" viewBox="0 0 24.105 42.731"><g id="g2193" transform="translate(1.06 1.06)"><path id="path1803-1-2" d="M-157.341-367.222l-21.986,20.306" transform="translate(179.326 387.528)" fill="none" stroke="#c3c3c3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path id="path1805-1-8" d="M-157.341-434.845l-21.986-20.306" transform="translate(179.326 455.151)" fill="none" stroke="#c3c3c3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></g></svg></div>'
  };
  
  const thumbnailArrows = {
    prevArrow: '<button class="slide-arrow prev-arrow"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>',
    nextArrow: '<button class="slide-arrow next-arrow"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></button>'
  };
  
  const commonSettings = {
    infinite: true,
    autoplay: false,
    dots: false,
    arrows: true,
    ...commonArrows,
    // Safari-specific optimizations
    touchThreshold: 10,
    waitForAnimate: false,
    useTransform: true,
    respondTo: 'slider'
  };
  
  // Enhanced initialize function with Safari fixes
  function initializeSliders() {
    // Force layout recalculation for Safari
    document.body.offsetHeight;
  
    const sliderConfigs = [
      {
        selector: '.video-slider',
        options: {
          ...commonSettings,
          slidesToShow: 3,
          slidesToScroll: 1,
          lazyLoad: 'progressive',
          responsive: [{
            breakpoint: 600,
            settings: { 
              slidesToShow: 2,
              adaptiveHeight: true 
            }
          }, {
            breakpoint: 370,
            settings: { 
              arrows: false,
              slidesToShow: 1,
              adaptiveHeight: true
            }
          }]
        }
      },
      {
        selector: '.custom-slider-for',
        options: {
          ...commonSettings,
          slidesToShow: 1,
          slidesToScroll: 1,
          fade: true,
          asNavFor: '.custom-slider-nav',
          adaptiveHeight: true
        }
      },
      {
        selector: '.custom-slider-nav',
        options: {
          ...commonSettings,
          slidesToShow: 4,
          slidesToScroll: 1,
          asNavFor: '.custom-slider-for',
          verticalSwiping: true,
          vertical: true,
          focusOnSelect: true
        }
      },
      {
        selector: '.pb_top_products .product__slider',
        options: {
          ...commonSettings,
          ...productBundleArrows,
          slidesToShow: 3,
          slidesToScroll: 1,
          responsive: [{
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
              centerMode: true
            }
          }]
        }
      },
      {
        selector: '.pb_bottom_products .product__slider',
        options: {
          ...commonSettings,
          ...productBundleArrows,
          slidesToShow: 3,
          slidesToScroll: 1,
          responsive: [{
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
              centerMode: true
            }
          }]
        }
      },
      {
        selector: '.customer-review-main',
        options: {
          ...commonSettings,
          slidesToShow: 1,
          slidesToScroll: 1
        }
      },
      {
        selector: '.thumbnail-slider .slider--mobile',
        options: {
          ...thumbnailArrows,
          vertical: true,
          verticalSwiping: true,
          slidesToShow: 6,
          slidesToScroll: 1,
          autoplay: false,
          autoplaySpeed: 2000,
          infinite: false,
          dots: false
        }
      }
    ];
  
    // Enhanced initialization with error handling
    sliderConfigs.forEach(({selector, options}) => {
      const $slider = $(selector);
      if (!$slider.length) return;
  
      try {
        // Hide slider during initialization to prevent FOUC
        $slider.css('visibility', 'hidden');
        
        // Initialize with error handling
        $slider.slick(options);
  
        // Special handling for video sliders
        if (selector === '.video-slider') {
          $slider.on('beforeChange', function(event, slick, currentSlide, nextSlide) {
            const videos = slick.$slides.find('video').get();
            videos.forEach(video => {
              video.pause();
              video.currentTime = 0;
            });
          });
  
          $slider.on('afterChange', function(event, slick, currentSlide) {
            const currentVideo = $(slick.$slides[currentSlide]).find('video')[0];
            if (currentVideo) {
              currentVideo.play().catch(e => console.log('Video autoplay prevented:', e));
            }
          });
        }
  
        // Force slider refresh and show
        setTimeout(() => {
          $slider.slick('setPosition');
          $slider.css('visibility', 'visible');
        }, 100);
  
      } catch (error) {
        console.error(`Error initializing slider ${selector}:`, error);
        $slider.css('visibility', 'visible');
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
          reject(new Error('Slick loading timeout'));
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
        const style = document.createElement('style');
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
      if (document.readyState === 'complete') {
        initializeSliders();
      } else {
        document.addEventListener('DOMContentLoaded', initializeSliders);
      }
  
      // Reinitialize on Shopify section updates
      document.addEventListener('shopify:section:load', function() {
        initializeSliders();
      });
  
    } catch (error) {
      console.error('Slider initialization failed:', error);
    }
  }
  
  // Start initialization
  init();
  
  // Optimized event binding function
  function bindSlickEvents() {
    const $topSlider = $('.pb_top_products .product__slider');
    const $bottomSlider = $('.pb_bottom_products .product__slider');
  
    if ($topSlider.length) {
      $topSlider.on('afterChange', function(event, slick, currentSlide) {
        const element = slick.$slides.get(currentSlide).querySelector('.pb__product');
        const dataId = element?.getAttribute('data-id');
        if (!dataId) return;
  
        $(`.pb_top_detail [data-id="${dataId}"]`)
          .removeClass("hidden")
          .addClass("selected")
          .siblings()
          .addClass("hidden")
          .removeClass("selected");
  
        totalPrice();
      });
    }
  
    if ($bottomSlider.length) {
      $bottomSlider.on('afterChange', function(event, slick, currentSlide) {
        const element = slick.$slides.get(currentSlide).querySelector('.pb__product');
        const dataId = element?.getAttribute('data-id');
        if (!dataId) return;
  
        $(`.pb_bottom_detail [data-id="${dataId}"]`)
          .removeClass("hidden")
          .addClass("selected")
          .siblings()
          .addClass("hidden")
          .removeClass("selected");
  
        totalPrice();
        updateProductOptionsText();
      });
    }
  }
  
  // Product bundle functionality
  function initProductBundle() {
    const bundelProducts = document.querySelectorAll('.pb__td_item');
    
    bundelProducts.forEach(product => {
      const currentVariant = parseInt(product.getAttribute('v-id'));
      const script = JSON.parse(product.querySelector('script[type="application/json"]').textContent);
      const selectedOption = script.find(item => item.id === currentVariant);
      
      if (selectedOption) {
        selectedOption.options.forEach(item => {
          const input = product.querySelector(`input[value="${item}"]`);
          if (input) input.checked = true;
        });
      }
  
      product.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', handleBundleVariantChange);
      });
    });
  }
  
  function handleBundleVariantChange(event) {
    const productForm = event.target.closest('.pb__td_item');
    const selectedOptions = Array.from(productForm.querySelectorAll('input[type="radio"]:checked')).map(input => input.value);
    const script = JSON.parse(productForm.querySelector('script[type="application/json"]').textContent);
    
    const currentVariant = script.find(item => item.options.every((option, index) => option === selectedOptions[index]));
  
    if (currentVariant) {
      const productFormUpdateBtm = productForm.closest('.pb_bottom_detail');
      if (productFormUpdateBtm) {
        console.log(productFormUpdateBtm);
        productFormUpdateBtm.closest('.pb__sibar').querySelector('product-form input[name="id"]').value = currentVariant.id;
      }
      const productFormUpdateTop = productForm.closest('.pb_top_detail');
      if (productFormUpdateTop) {
        console.log(productFormUpdateTop);
        productFormUpdateTop.closest('.pb__sibar').querySelector('product-form input[name="id"]').value = currentVariant.id;
      }
      productForm.setAttribute('v-id', currentVariant.id);
      const priceElement = productForm.querySelector('.pd_price');
      priceElement.setAttribute('data-price', currentVariant.price);
      priceElement.querySelector('.price').textContent = Shopify.formatMoney(currentVariant.price, cartStrings?.money_format);
      totalPrice();
    }
  }
  
  function totalPrice() {
    const totalItems = document.querySelectorAll('.pb__td_item.selected .pd_price');
    const totalPrice = Array.from(totalItems).reduce((sum, item) => sum + parseInt(item.getAttribute('data-price')), 0);
    document.querySelector('.total_price .tp_ptice').textContent = Shopify.formatMoney(totalPrice, cartStrings?.money_format);
  }
  
  // Text update function for product options
  function updateProductOptionsText() {
      console.log("Updating text");
      $('.top-text').text('Options');
      $('.slick-current .top-text').text('Your Selection');
  }
  
  // Initialize all functions
  document.addEventListener('DOMContentLoaded', () => {
    initProductBundle();
    updateProductOptionsText();
  });