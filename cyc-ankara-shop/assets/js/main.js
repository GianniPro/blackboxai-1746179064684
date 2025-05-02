// Common utility functions
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Cart functions
function getCart() {
  const cart = localStorage.getItem('cycAnkaraCart');
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem('cycAnkaraCart', JSON.stringify(cart));
}

function addToCart(item) {
  const cart = getCart();
  // Check if item with same material and size exists, then increase quantity
  const existingIndex = cart.findIndex(ci => ci.material === item.material && ci.size === item.size && ci.currency === item.currency);
  if (existingIndex !== -1) {
    cart[existingIndex].quantity += item.quantity;
  } else {
    cart.push(item);
  }
  saveCart(cart);
  alert('Item added to cart!');
}

// Product page functionality
function productPageInit() {
  const basePrices = {
    silk: 5000,
    ankara: 3000,
    chiffon: 4000,
    cotton: 2000
  };

  const currencyRates = {
    NGN: 1,
    USD: 0.0024,
    GBP: 0.0020,
    EUR: 0.0022
  };

  const currencySymbols = {
    NGN: '₦',
    USD: '$',
    GBP: '£',
    EUR: '€'
  };

  const materialImages = {
    silk: 'https://images.pexels.com/photos/461428/pexels-photo-461428.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300',
    ankara: 'https://images.pexels.com/photos/461428/pexels-photo-461428.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300',
    chiffon: 'https://images.pexels.com/photos/461428/pexels-photo-461428.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300',
    cotton: 'https://images.pexels.com/photos/461428/pexels-photo-461428.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=300'
  };

  const descriptions = {
    silk: 'Luxurious and smooth silk fabrics.',
    ankara: 'Vibrant and colorful Ankara prints.',
    chiffon: 'Light and sheer chiffon fabrics.',
    cotton: 'Soft and breathable cotton materials.'
  };

  const suggestedMaterials = ['silk', 'ankara', 'chiffon', 'cotton'];

  function updatePrice() {
    const material = getQueryParam('material') || 'ankara';
    const size = parseInt(document.getElementById('size').value) || 1;
    const currency = document.getElementById('currency').value;

    const basePrice = basePrices[material.toLowerCase()] || 3000;
    const priceInNgn = basePrice * size;
    const convertedPrice = priceInNgn * currencyRates[currency];
    const symbol = currencySymbols[currency];

    document.getElementById('price').textContent = symbol + convertedPrice.toFixed(2);
  }

  function updateMaterialInfo() {
    const material = getQueryParam('material') || 'ankara';
    const materialName = material.charAt(0).toUpperCase() + material.slice(1);

    document.getElementById('material-name').textContent = materialName;
    document.getElementById('material-description').textContent = descriptions[material.toLowerCase()] || '';
    document.getElementById('material-image').src = materialImages[material.toLowerCase()] || '';
    document.getElementById('material-image').alt = materialName + ' fabric';

    document.getElementById('checkout-link').href = `checkout.html?material=${material}&size=${document.getElementById('size').value}&currency=${document.getElementById('currency').value}`;

    // Populate suggested materials except current
    const suggestedContainer = document.getElementById('suggested-materials');
    suggestedContainer.innerHTML = '';
    suggestedMaterials.forEach(mat => {
      if (mat !== material.toLowerCase()) {
        const matName = mat.charAt(0).toUpperCase() + mat.slice(1);
        const card = document.createElement('a');
        card.href = `product.html?material=${mat}`;
        card.className = 'block bg-white rounded-lg shadow hover:shadow-lg transition p-4 text-center card';
        card.innerHTML = `
          <img src="${materialImages[mat]}" alt="${matName} fabric" class="mx-auto mb-2 rounded max-h-32 object-contain" />
          <h4 class="font-semibold">${matName}</h4>
        `;
        suggestedContainer.appendChild(card);
      }
    });
  }

  function populateSizeOptions() {
    const sizeSelect = document.getElementById('size');
    sizeSelect.innerHTML = '';
    for (let i = 1; i <= 12; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i;
      sizeSelect.appendChild(option);
    }
    sizeSelect.value = 1;
  }

  if (document.getElementById('size')) {
    populateSizeOptions();
    updateMaterialInfo();
    updatePrice();

    document.getElementById('size').addEventListener('change', () => {
      updatePrice();
      updateMaterialInfo();
    });

    document.getElementById('currency').addEventListener('change', () => {
      updatePrice();
      updateMaterialInfo();
    });

    document.getElementById('add-to-cart').addEventListener('click', () => {
      const material = getQueryParam('material') || 'ankara';
      const size = parseInt(document.getElementById('size').value) || 1;
      const currency = document.getElementById('currency').value;
      const basePrice = basePrices[material.toLowerCase()] || 3000;
      const priceInNgn = basePrice * size;
      const currencyRate = currencyRates[currency];
      const price = priceInNgn * currencyRate;

      const item = {
        material,
        size,
        currency,
        price,
        quantity: 1
      };
      addToCart(item);
    });
  }
}

// Checkout page functionality
function checkoutPageInit() {
  const currencySymbols = {
    NGN: '₦',
    USD: '$',
    GBP: '£',
    EUR: '€'
  };

  const shippingFeeNgn = 2000;
  const deliveryFeeNgn = 1000;

  function updateSummary() {
    const cart = getCart();
    const currency = cart.length > 0 ? cart[0].currency : 'NGN';
    const currencyRate = {
      NGN: 1,
      USD: 0.0024,
      GBP: 0.0020,
      EUR: 0.0022
    }[currency];
    const symbol = currencySymbols[currency];

    const country = document.getElementById('country').value;
    let fee = 0;
    if (country === 'Nigeria') {
      fee = deliveryFeeNgn * currencyRate;
    } else if (country === 'Other') {
      fee = shippingFeeNgn * currencyRate;
    }

    let subtotal = 0;
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = '';
    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      const li = document.createElement('li');
      li.className = 'mb-2 flex justify-between';
      li.textContent = `${item.material.charAt(0).toUpperCase() + item.material.slice(1)} - ${item.size} yards x ${item.quantity} = ${symbol}${itemTotal.toFixed(2)}`;
      cartList.appendChild(li);
    });

    const total = subtotal + fee;
    document.getElementById('subtotal').textContent = symbol + subtotal.toFixed(2);
    document.getElementById('fee').textContent = symbol + fee.toFixed(2);
    document.getElementById('total-price').textContent = symbol + total.toFixed(2);
  }

  if (document.getElementById('country')) {
    document.getElementById('country').addEventListener('change', updateSummary);
  }

  if (document.getElementById('checkout-form')) {
    document.getElementById('checkout-form').addEventListener('submit', function(event) {
      event.preventDefault();
      const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
      const instructionsDiv = document.getElementById('payment-instructions');
      const instructionsText = document.getElementById('instructions-text');

      if (paymentMethod === 'bank') {
        instructionsText.innerHTML = `
          Please transfer the total amount to the following bank account:<br />
          <strong>Bank:</strong> CYC Bank<br />
          <strong>Account Number:</strong> 1234567890<br />
          <strong>Account Name:</strong> CYC Ankara<br />
          After payment, please send your payment confirmation to our email: payments@cycankara.com
        `;
      } else if (paymentMethod === 'card') {
        instructionsText.innerHTML = `
          Card payment is currently not integrated. Please use bank transfer for now.
        `;
      }
      instructionsDiv.classList.remove('hidden');
      window.scrollTo({ top: instructionsDiv.offsetTop, behavior: 'smooth' });
    });
  }

  // Initialize summary on page load
  document.addEventListener('DOMContentLoaded', () => {
    updateSummary();
  });
}

// Initialize page-specific scripts
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('size')) {
    productPageInit();
  }
  if (document.getElementById('checkout-form')) {
    checkoutPageInit();
  }
});
</create_file>
