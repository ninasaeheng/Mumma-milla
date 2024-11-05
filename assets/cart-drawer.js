class CartDrawer extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
    this.setHeaderCartIconAccessibility();
  }

  setHeaderCartIconAccessibility() {
    const cartLink = document.querySelector('#cart-icon-bubble');
    cartLink.setAttribute('role', 'button');
    cartLink.setAttribute('aria-haspopup', 'dialog');
    cartLink.addEventListener('click', (event) => {
      event.preventDefault();
      this.open(cartLink);
    });
    cartLink.addEventListener('keydown', (event) => {
      if (event.code.toUpperCase() === 'SPACE') {
        event.preventDefault();
        this.open(cartLink);
      }
    });
  }

  open(triggeredBy) {
    if (triggeredBy) this.setActiveElement(triggeredBy);
    const cartDrawerNote = this.querySelector('[id^="Details-"] summary');
    if (cartDrawerNote && !cartDrawerNote.hasAttribute('role')) this.setSummaryAccessibility(cartDrawerNote);
    
    // here the animation doesn't seem to always get triggered. A timeout seem to help
    setTimeout(() => {
      this.classList.add('animate', 'active');
      
      // Initialize variants when drawer opens
      try {
        console.log('Initializing variants on drawer open');
        collVariant();
      } catch (error) {
        console.error('Error initializing drawer variants:', error);
      }
    });

    this.addEventListener(
      'transitionend',
      () => {
        const containerToTrapFocusOn = this.classList.contains('is-empty')
          ? this.querySelector('.drawer__inner-empty')
          : document.getElementById('CartDrawer');
        const focusElement = this.querySelector('.drawer__inner') || this.querySelector('.drawer__close');
        trapFocus(containerToTrapFocusOn, focusElement);
      },
      { once: true }
    );

    document.body.classList.add('overflow-hidden');

    document.dispatchEvent(new CustomEvent('cart:opened'));
  }

  close() {
    this.classList.remove('active');
    removeTrapFocus(this.activeElement);
    document.body.classList.remove('overflow-hidden');
  }

  setSummaryAccessibility(cartDrawerNote) {
    cartDrawerNote.setAttribute('role', 'button');
    cartDrawerNote.setAttribute('aria-expanded', 'false');

    if (cartDrawerNote.nextElementSibling.getAttribute('id')) {
      cartDrawerNote.setAttribute('aria-controls', cartDrawerNote.nextElementSibling.id);
    }

    cartDrawerNote.addEventListener('click', (event) => {
      event.currentTarget.setAttribute('aria-expanded', !event.currentTarget.closest('details').hasAttribute('open'));
    });

    cartDrawerNote.parentElement.addEventListener('keyup', onKeyUpEscape);
  }

  renderContents(parsedState) {
    this.querySelector('.drawer__inner').classList.contains('is-empty') &&
      this.querySelector('.drawer__inner').classList.remove('is-empty');
    this.productId = parsedState.id;
    
    // First, update the DOM
    this.getSectionsToRender().forEach((section) => {
      const sectionElement = section.selector
        ? document.querySelector(section.selector)
        : document.getElementById(section.id);
      sectionElement.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
    });

    // Then initialize variants and setup the drawer
    setTimeout(() => {
      try {
        // Initialize variants first
        console.log('Initializing cart drawer variants');
        collVariant();
        
        // Then load recommendations
        console.log('Loading cart recommendations');
        cart_recomm();
        
        // Setup drawer events
        this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
        this.open();

      } catch (error) {
        console.error('Error initializing cart drawer:', error);
      }
    }, 100);

    // Dispatch cart update event
    document.dispatchEvent(new CustomEvent('cart:updated', { 
      detail: { cartData: parsedState }
    }));
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector).innerHTML;
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-drawer',
        selector: '#CartDrawer',
      },
      {
        id: 'cart-icon-bubble',
      },
    ];
  }

  getSectionDOM(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector);
  }

  setActiveElement(element) {
    this.activeElement = element;
  }
}

class CartDrawerItems extends CartItems {
  getSectionsToRender() {
    return [
      {
        id: 'CartDrawer',
        section: 'cart-drawer',
        selector: '.drawer__inner',
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section',
      },
    ];
  }
}

// Add a MutationObserver to handle dynamic content
function initializeCartDrawerVariants() {
  const cartDrawer = document.querySelector('cart-drawer');
  if (!cartDrawer) return;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        const hasProductForms = Array.from(mutation.addedNodes).some(node => 
          node.nodeType === 1 && (
            node.classList?.contains('custom-product-form') ||
            node.querySelector?.('.custom-product-form')
          )
        );

        if (hasProductForms) {
          console.log('New product forms detected in cart drawer');
          setTimeout(() => {
            collVariant();
          }, 100);
        }
      }
    });
  });

  observer.observe(cartDrawer, { 
    childList: true, 
    subtree: true,
    characterData: false,
    attributes: false 
  });
}

// Initialize everything when the document is ready
document.addEventListener('DOMContentLoaded', () => {
  initializeCartDrawerVariants();
});

customElements.define('cart-drawer', CartDrawer);
customElements.define('cart-drawer-items', CartDrawerItems);