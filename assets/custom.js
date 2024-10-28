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

// nk developer
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
        var selected_option = product_form.find('input[type="radio"]:checked');
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
