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
  // ....nk developer.......

  $(document).ready(function () {
    setTimeout(function () {
      collVariant();
      function collVariant() {
        var products = $(".custom-product-form");
        products.each(function () {
          var field = $(this);
          var current_variant = parseInt($(this).find('[name="id"]').val());
          var script = $(this).find('script[type="application/json"]');
          script = JSON.parse(script.text());
          var selected_option = script.find((item) => {
            if (item.id == current_variant) {
              return item.title;
            }
          });
          selected_option.options.forEach(function (item) {
            field.find('input[value="' + item + '"]').prop("checked", true);
          });
        });
        products.find('input[type="radio"]').change(function (e) {
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
  
  // Update the document ready handler
  $(document).ready(function () {
    // Initialize everything here
    initializeVariantSelections();
    initializeCartRecommendations();

    // Add global event delegation for variant changes
    $(document).on('change', '.custom-product-form input[type="radio"]', function(e) {
      const form = e.target.closest('.custom-product-form');
      handleVariantChange(form);
    });
  });
  
});

function initializeVariantSelections() {
  console.log('Initializing variant selections');
  document.querySelectorAll('.custom-product-form').forEach(form => {
    try {
      // Get variant data
      const variantScript = form.querySelector('script[type="application/json"]');
      if (!variantScript) {
        console.log('No variant script found for form:', form);
        return;
      }

      const variants = JSON.parse(variantScript.textContent);
      console.log('Variants data:', variants);

      // Find first available variant
      const firstAvailableVariant = variants.find(variant => variant.available);
      if (!firstAvailableVariant) {
        console.log('No available variants found');
        return;
      }

      console.log('Selected variant:', firstAvailableVariant);

      // Select first available variant's options
      firstAvailableVariant.options.forEach((optionValue, index) => {
        const input = form.querySelector(`input[value="${optionValue}"]`);
        if (input) {
          input.checked = true;
          console.log(`Selected option ${index}:`, optionValue);
        } else {
          console.log(`Could not find input for option ${index}:`, optionValue);
        }
      });

      // Update hidden variant ID input
      const variantIdInput = form.querySelector('input[name="id"]');
      if (variantIdInput) {
        variantIdInput.value = firstAvailableVariant.id;
        console.log('Updated variant ID to:', firstAvailableVariant.id);
      }

      // Update button state
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = !firstAvailableVariant.available;
        const buttonText = submitButton.querySelector('span');
        if (buttonText) {
          buttonText.textContent = firstAvailableVariant.available ? 'Add to Bag' : 'Sold out';
        }
      }
    } catch (error) {
      console.error('Error in initializeVariantSelections for form:', error);
    }
  });
}

function initializeCartRecommendations() {
  console.log('Initializing cart recommendations');
  const recommendationForms = document.querySelectorAll('.cart_recomm .custom-product-form');
  
  recommendationForms.forEach(form => {
    try {
      // Get variant data
      const variantScript = form.querySelector('script[type="application/json"]');
      if (!variantScript) {
        console.log('No variant script found for form:', form);
        return;
      }

      const variants = JSON.parse(variantScript.textContent);
      console.log('Variants data:', variants);

      // Find first available variant
      const firstAvailableVariant = variants.find(variant => variant.available);
      if (!firstAvailableVariant) {
        console.log('No available variants found');
        return;
      }

      console.log('Selected variant:', firstAvailableVariant);

      // Select first available variant's options
      firstAvailableVariant.options.forEach((optionValue, index) => {
        const input = form.querySelector(`input[type="radio"][value="${optionValue}"]`);
        if (input) {
          input.checked = true;
          console.log(`Selected option ${index}:`, optionValue);
        } else {
          console.log(`Could not find input for option ${index}:`, optionValue);
        }
      });

      // Update hidden variant ID input
      const variantIdInput = form.querySelector('input[name="id"]');
      if (variantIdInput) {
        variantIdInput.value = firstAvailableVariant.id;
        console.log('Updated variant ID to:', firstAvailableVariant.id);
      }

      // Update button state
      const submitButton = form.querySelector('.quick-add__submit');
      if (submitButton) {
        submitButton.disabled = !firstAvailableVariant.available;
        const buttonText = submitButton.querySelector('span');
        const soldOutMessage = submitButton.querySelector('.sold-out-message');
        
        if (firstAvailableVariant.available) {
          buttonText.classList.remove('hidden');
          soldOutMessage.classList.add('hidden');
        } else {
          buttonText.classList.add('hidden');
          soldOutMessage.classList.remove('hidden');
        }
      }
    } catch (error) {
      console.error('Error initializing variants for form:', error);
    }
  });
}

function handleVariantChange(form) {
  try {
    const variantScript = form.querySelector('script[type="application/json"]');
    const variants = JSON.parse(variantScript.textContent);
    
    // Get all selected options
    const selectedOptions = [];
    form.querySelectorAll('input[type="radio"]:checked').forEach(input => {
      selectedOptions.push(input.value);
    });

    console.log('Selected options:', selectedOptions);

    // Find matching variant
    const matchingVariant = variants.find(variant => 
      variant.options.every((option, index) => option === selectedOptions[index])
    );

    console.log('Matching variant:', matchingVariant);

    if (matchingVariant) {
      // Update hidden variant ID input without triggering form submission
      const variantIdInput = form.querySelector('input[name="id"]');
      if (variantIdInput) {
        variantIdInput.value = matchingVariant.id;
        console.log('Updated variant ID to:', matchingVariant.id);
      }

      // Update button state without triggering loading state
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = !matchingVariant.available;
        
        // Update button text without affecting loading spinner
        const buttonTextSpan = submitButton.querySelector('span:not(.loading__spinner)');
        const soldOutMessage = submitButton.querySelector('.sold-out-message');
        
        if (matchingVariant.available) {
          if (buttonTextSpan) buttonTextSpan.classList.remove('hidden');
          if (soldOutMessage) soldOutMessage.classList.add('hidden');
        } else {
          if (buttonTextSpan) buttonTextSpan.classList.add('hidden');
          if (soldOutMessage) soldOutMessage.classList.remove('hidden');
        }
      }
    }
  } catch (error) {
    console.error('Error in handleVariantChange:', error);
  }
}

function handleVariantChange(form) {
  try {
    const variantScript = form.querySelector('script[type="application/json"]');
    if (!variantScript) return;

    const variants = JSON.parse(variantScript.textContent);
    const selectedOptions = Array.from(form.querySelectorAll('input[type="radio"]:checked')).map(input => input.value);
    
    // Find matching variant
    const matchingVariant = variants.find(variant => 
      variant.options.every((option, index) => option === selectedOptions[index])
    );

    if (matchingVariant) {
      // Update hidden variant ID input
      const variantIdInput = form.querySelector('input[name="id"]');
      if (variantIdInput) {
        variantIdInput.value = matchingVariant.id;
      }

      // Update button state based on availability
      const submitButton = form.querySelector('.quick-add__submit');
      if (submitButton) {
        const buttonText = submitButton.querySelector('span');
        const soldOutMessage = submitButton.querySelector('.sold-out-message');
        
        if (matchingVariant.available) {
          buttonText.classList.remove('hidden');
          soldOutMessage.classList.add('hidden');
          submitButton.removeAttribute('aria-disabled');
        } else {
          buttonText.classList.add('hidden');
          soldOutMessage.classList.remove('hidden');
          submitButton.setAttribute('aria-disabled', 'true');
        }
      }
    }
  } catch (error) {
    console.error('Error in handleVariantChange:', error);
  }
}

// Modify the cart_recomm function to use a more robust initialization approach
function cart_recomm() {
  const cartDrawer = document.querySelector('cart-drawer');
  if (!cartDrawer || !cartDrawer.productId) return;

  // Create an observer instance to watch for when recommendations are added
  const observer = new MutationObserver((mutations, obs) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length) {
        const recommendationsContainer = document.querySelector('.cart_recomm');
        if (recommendationsContainer) {
          const productForms = recommendationsContainer.querySelectorAll('.custom-product-form');
          if (productForms.length) {
            console.log('Found recommendation forms, initializing...');
            
            productForms.forEach(form => {
              try {
                // Get variant data
                const variantScript = form.querySelector('script[type="application/json"]');
                if (!variantScript) {
                  console.log('No variant script found');
                  return;
                }

                const variants = JSON.parse(variantScript.textContent);
                const firstAvailableVariant = variants.find(v => v.available);
                
                if (firstAvailableVariant) {
                  console.log('Found first available variant:', firstAvailableVariant);
                  
                  // Set the variant ID
                  const variantInput = form.querySelector('input[name="id"]');
                  if (variantInput) {
                    variantInput.value = firstAvailableVariant.id;
                  }

                  // Select the radio buttons
                  firstAvailableVariant.options.forEach((optionValue, index) => {
                    const radio = form.querySelector(`input[type="radio"][value="${optionValue}"]`);
                    if (radio) {
                      radio.checked = true;
                      console.log(`Selected option ${index}:`, optionValue);
                    }
                  });

                  // Update button state
                  const submitButton = form.querySelector('.quick-add__submit');
                  if (submitButton) {
                    const buttonText = submitButton.querySelector('span');
                    const soldOutMessage = submitButton.querySelector('.sold-out-message');
                    
                    if (firstAvailableVariant.available) {
                      buttonText.classList.remove('hidden');
                      soldOutMessage.classList.add('hidden');
                      submitButton.removeAttribute('aria-disabled');
                    } else {
                      buttonText.classList.add('hidden');
                      soldOutMessage.classList.remove('hidden');
                      submitButton.setAttribute('aria-disabled', 'true');
                    }
                  }
                }
              } catch (error) {
                console.error('Error initializing form:', error);
              }
            });

            // Disconnect once we've handled the recommendations
            obs.disconnect();
          }
        }
      }
    }
  });

  // Start observing the document with the configured parameters
  observer.observe(document.body, { 
    childList: true, 
    subtree: true 
  });

  // Fetch recommendations
  fetch('/recommendations/products.json?product_id=' + cartDrawer.productId + '&limit=2')
    .then(response => response.json())
    .then(data => {
      console.log('Recommendations fetched successfully');
    })
    .catch(error => {
      console.error('Error fetching recommendations:', error);
    });
}

// Add event listeners for cart updates
document.addEventListener('cart:updated', () => {
  setTimeout(cart_recomm, 100);
});

document.addEventListener('cart:refresh', () => {
  setTimeout(cart_recomm, 100);
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  cart_recomm();
});