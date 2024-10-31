document.addEventListener("DOMContentLoaded", function () {
  // open header on hover starts
  if ($(window).width() > 990) {
    $(".header__inline-menu ul li header-menu").hover(
      function () {
        $(this).children(".mega-menu").attr("open", "true");
      },
      function () {
        $(this).children(".mega-menu").removeAttr("open");
      }
    );
  }

  // open header on hover ends

  // product image gallery script starts here

  $(".custom-slider-for").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
    prevArrow:
      '<div class="slick-slider__prev"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></div>',
    nextArrow:
      '<div class="slick-slider__next"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></div>',
    asNavFor: ".custom-slider-nav",
  });
  $(".custom-slider-nav").slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    asNavFor: ".custom-slider-for",
    dots: false,
    // centerMode: true,
    // centerPadding: '10px',
    verticalSwiping: true,
    vertical: true,
    focusOnSelect: true,
    arrows: true,
    prevArrow:
      '<div class="slick-slider__prev"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></div>',
    nextArrow:
      '<div class="slick-slider__next"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></div>',
  });

  // product image gallery script ends here

  // ....nk developer.......

  $(document).ready(function () {
    setTimeout(function () {
      collVariant();
      function collVariant() {
        var products = $(".custom-product-form");
        products.each(function () {
          var field = $(this);
          var current_variatn = parseInt($(this).find('[name="id"]').val());
          var script = $(this).find('script[type="application/json"]');
          script = JSON.parse(script.text());
          var selected_option = script.find((item) => {
            if (item.id == current_variatn) {
              return item.title;
            }
          });
          selected_option.options.forEach(function (item) {
            field.find('input[value="' + item + '"]').prop("checked", true);
          });
        });
        products.find('input[type="radio"]').change(function () {
          var product_form = $(this).closest(".custom-product-form");
          var selected_option = product_form.find(
            'input[type="radio"]:checked'
          );
          selected_option = selected_option.map((index, item) => {
            return item.getAttribute("value");
          });
          var script = product_form.find('script[type="application/json"]');
          script = JSON.parse(script.text());
          var current_variant = "";
          try {
            script.forEach(function (item) {
              var matched = false;
              try {
                item.options.forEach(function (options, index) {
                  if (options == selected_option[index]) {
                    matched = true;
                  } else {
                    matched = false;
                    throw new Error("Break inner the loop.");
                  }
                });
              } catch (error) {
                // console.log(error);
              }

              if (matched == true) {
                current_variant = item;
                console.log(item);
                throw new Error("Break the loop.");
              }
            });
          } catch (error) {
            // console.log(error);
          }
          if (current_variant == "") {
            product_form.find(".quick-add__submit>span").addClass("hidden");
            product_form
              .find(".quick-add__submit .sold-out-message")
              .removeClass("hidden");
          } else {
            product_form.find(".quick-add__submit>span").removeClass("hidden");
            product_form
              .find(".quick-add__submit .sold-out-message")
              .addClass("hidden");
            product_form.find('[name="id"]').val(current_variant.id);
            console.log(current_variant);
          }
        });
      }
    }, 1000);
    // ,,,,,,,,,,,,,,
  });

  // 13 date nk.........
  // var $slickElement = $(".pb_top_products .product__slider");
  // $slickElement.slick({
  //   infinite: true,
  //   slidesToShow: 2,
  //   slidesToScroll: 1,
  //   autoplay: false,
  //   dots: false,
  //   prevArrow:
  //     '<div class="slick-slider__prev"><svg xmlns="http://www.w3.org/2000/svg" width="24.105" height="42.731" viewBox="0 0 24.105 42.731"><g id="g2193" transform="translate(180.386 456.21)"><path id="path1803-1-2" d="M-179.326-367.222l21.986,20.306" transform="translate(0 -67.623)" fill="none" stroke="#c3c3c3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path id="path1805-1-8" d="M-179.326-434.845l21.986-20.306" transform="translate(0)" fill="none" stroke="#c3c3c3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></g></svg></div>',
  //   nextArrow:
  //     '<div class="slick-slider__next"><svg xmlns="http://www.w3.org/2000/svg" width="24.105" height="42.731" viewBox="0 0 24.105 42.731"><g id="g2193" transform="translate(1.06 1.06)"><path id="path1803-1-2" d="M-157.341-367.222l-21.986,20.306" transform="translate(179.326 387.528)" fill="none" stroke="#c3c3c3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path id="path1805-1-8" d="M-157.341-434.845l-21.986-20.306" transform="translate(179.326 455.151)" fill="none" stroke="#c3c3c3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></g></svg></div>',
  //   responsive: [
  //     {
  //       breakpoint: 768,
  //       settings: {
  //         slidesToShow: 1,
  //       },
  //     },
  //   ],
  // });
  // var $slickElementBottom = $(".pb_bottom_products .product__slider");
  // $slickElementBottom.slick({
  //   infinite: true,
  //   slidesToShow: 3,
  //   slidesToScroll: 1,
  //   autoplay: false,
  //   dots: false,
  //   prevArrow:
  //     '<div class="slick-slider__prev"><svg xmlns="http://www.w3.org/2000/svg" width="24.105" height="42.731" viewBox="0 0 24.105 42.731"><g id="g2193" transform="translate(180.386 456.21)"><path id="path1803-1-2" d="M-179.326-367.222l21.986,20.306" transform="translate(0 -67.623)" fill="none" stroke="#c3c3c3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path id="path1805-1-8" d="M-179.326-434.845l21.986-20.306" transform="translate(0)" fill="none" stroke="#c3c3c3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></g></svg></div>',
  //   nextArrow:
  //     '<div class="slick-slider__next"><svg xmlns="http://www.w3.org/2000/svg" width="24.105" height="42.731" viewBox="0 0 24.105 42.731"><g id="g2193" transform="translate(1.06 1.06)"><path id="path1803-1-2" d="M-157.341-367.222l-21.986,20.306" transform="translate(179.326 387.528)" fill="none" stroke="#c3c3c3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path><path id="path1805-1-8" d="M-157.341-434.845l-21.986-20.306" transform="translate(179.326 455.151)" fill="none" stroke="#c3c3c3" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path></g></svg></div>',
  //   responsive: [
  //     {
  //       breakpoint: 768,
  //       settings: {
  //         slidesToShow: 1,
  //         centerMode: true,
  //       },
  //     },
  //   ],
  // });
  // $slickElement.on(
  //   "afterChange",
  //   function (event, slick, currentSlide, nextSlide) {
  //     var current_slider = slick.$slides.get(currentSlide);
  //     var element = current_slider.querySelector(".pb__product");
  //     $('.pb_top_detail [data-id="' + element.getAttribute("data-id") + '"]')
  //       .removeClass("hidden")
  //       .addClass("selected")
  //       .siblings()
  //       .addClass("hidden")
  //       .removeClass("selected");
  //     totalPrice();
  //   }
  // );
  // $slickElementBottom.on(
  //   "afterChange",
  //   function (event, slick, currentSlide, nextSlide) {
  //     var current_slider = slick.$slides.get(currentSlide);
  //     var element = current_slider.querySelector(".pb__product");
  //     $('.pb_bottom_detail [data-id="' + element.getAttribute("data-id") + '"]')
  //       .removeClass("hidden")
  //       .addClass("selected")
  //       .siblings()
  //       .addClass("hidden")
  //       .removeClass("selected");
  //     totalPrice();
  //   }
  // );
  // var bundel_products = $(".pb__td_item");

  // bundel_products.each(function () {
  //   var field = $(this);
  //   var current_variatn = parseInt($(this).attr("v-id"));
  //   var script = $(this).find('script[type="application/json"]');
  //   script = JSON.parse(script.text());
  //   var selected_option = script.find((item) => {
  //     if (item.id == current_variatn) {
  //       return item.title;
  //     }
  //   });

  //   selected_option.options.forEach(function (item) {
  //     field.find('input[value="' + item + '"]').prop("checked", true);
  //   });
  // });

  // function totalPrice() {
  //   var total_price = 0;
  //   var total_item = $(".pb__td_item.selected .pd_price");
  //   total_item.each(function () {
  //     total_price = total_price + parseInt($(this).attr("data-price"));
  //   });
  //   $(".total_price .tp_ptice").text(
  //     Shopify.formatMoney(total_price, cartStrings?.money_format)
  //   );
  // }

  // bundel_products.find('input[type="radio"]').change(function () {
  //   var product_form = $(this).closest(".pb__td_item");
  //   var selected_option = product_form.find('input[type="radio"]:checked');
  //   selected_option = selected_option.map((index, item) => {
  //     return item.getAttribute("value");
  //   });
  //   var script = product_form.find('script[type="application/json"]');
  //   script = JSON.parse(script.text());
  //   var current_variant = "";
  //   try {
  //     script.forEach(function (item) {
  //       var matched = false;
  //       try {
  //         item.options.forEach(function (options, index) {
  //           if (options == selected_option[index]) {
  //             matched = true;
  //           } else {
  //             matched = false;
  //             throw new Error("Break inner the loop.");
  //           }
  //         });
  //       } catch (error) {
  //         // console.log(error);
  //       }

  //       if (matched == true) {
  //         current_variant = item;
  //         console.log(item);
  //         throw new Error("Break the loop.");
  //       }
  //     });
  //   } catch (error) {
  //     // console.log(error);
  //   }
  //   if (current_variant == "") {
  //     console.log("variant is empty");
  //     // product_form.find('.quick-add__submit>span').addClass("hidden");
  //     // product_form.find('.quick-add__submit .sold-out-message').removeClass("hidden");
  //   } else {
  //     // product_form.find('.quick-add__submit>span').removeClass("hidden");
  //     // product_form.find('.quick-add__submit .sold-out-message').addClass("hidden");
  //     // product_form.find('[name="id"]').val(current_variant.id);
  //     var product_form_update = product_form.closest(".pb_bottom_detail");

  //     if (product_form_update.length == 1) {
  //       console.log(product_form_update);
  //       product_form_update
  //         .closest(".pb__sibar")
  //         .find('product-form input[name="id"]')
  //         .val(current_variant.id);
  //     }
  //     product_form.attr("v-id", current_variant.id);
  //     product_form.find(".pd_price").attr("data-price", current_variant.price);
  //     product_form
  //       .find(".pd_price .price")
  //       .text(
  //         Shopify.formatMoney(current_variant.price, cartStrings?.money_format)
  //       );
  //     totalPrice();
  //   }
  //   // console.log(current_variant);
  // });
  // // 13 date nk.........
  // // ....End nk developer.......

  // // customer review script starts here

  // $(".customer-review-main").slick({
  //   infinite: true,
  //   slidesToShow: 1,
  //   arrows: true,
  //   slidesToScroll: 1,
  //   prevArrow:
  //     '<div class="slick-slider__prev"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-caret" viewBox="0 0 10 6"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor"></svg></div>',
  //   nextArrow:
  //     '<div class="slick-slider__next"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-caret" viewBox="0 0 10 6"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor"></svg></div>',
  // });

  // customer review script ends here

  // this function only work for cart recomm product
  $(document).ready(function () {
    cart_recomm();
    function cart_recomm() {
      var products = $(".cart_recomm .custom-product-form");
      products.each(function () {
        var field = $(this);
        var current_variatn = parseInt($(this).find('[name="id"]').val());
        var script = $(this).find('script[type="application/json"]');
        script = JSON.parse(script.text());
        var selected_option = script.find((item) => {
          if (item.id == current_variatn) {
            return item.title;
          }
        });
        selected_option.options.forEach(function (item) {
          field.find('input[value="' + item + '"]').prop("checked", true);
        });
      });
    }
  });

  // $(document).ready(function () {
  //   console.log("Document is ready");

  //   function updateText() {
  //     console.log("Updating text");
  //     $(".top-text").text("Options");
  //     $(".slick-current .top-text").text("Your Selection");
  //   }

  //   updateText();

  //   $(".pb_bottom_products .product__slider").on(
  //     "afterChange",
  //     function (event, slick, currentSlide) {
  //       console.log("After change event fired");
  //       updateText();
  //     }
  //   );

  //   $(".thumbnail-slider .slider--mobile").slick({
  //     //   speed: 500,
  //     //   dots: true,
  //     //   arrows:false,
  //     //    slidesToScroll: 1,
  //     //   centerMode: false,
  //     //   slidesToShow: 6,
  //     //   infinite:false,
  //     //   pauseOnHover:false,
  //     //   PauseOnFocus: false,
  //     //   autoplay: false,

  //     vertical: true,
  //     verticalSwiping: true,
  //     arrows: true,
  //     slidesToShow: 6,
  //     slidesToScroll: 1,
  //     autoplay: false,
  //     autoplaySpeed: 2000,
  //     infinite: false,
  //     dots: false,
  //     prevArrow:
  //       '<button class="slide-arrow prev-arrow"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>',
  //     nextArrow:
  //       '<button class="slide-arrow next-arrow"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></button>',
  //   });
  // });
});
