// Common utility functions
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
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
    const descriptions = {
      silk: 'Luxurious and smooth silk fabrics.',
      ankara: 'Vibrant and colorful Ankara prints.',
      chiffon: 'Light and sheer chiffon fabrics.',
      cotton: 'Soft and breathable cotton materials.'
    };

    document.getElementById('material-name').textContent = materialName;
    document.getElementById('material-description').textContent = descriptions[material.toLowerCase()] || '';
    document.getElementById('checkout-link').href = `checkout.html?material=${material}&size=${document.getElementById('size').value}&currency=${document.getElementById('currency').value}`;
  }

  function populateSizeOptions() {
    const sizeSelect = document.getElementById('size');
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
    const material = getQueryParam('material') || '-';
    const size = getQueryParam('size') || '-';
    const currency = getQueryParam('currency') || 'NGN';
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

    const basePrice = basePrices[material.toLowerCase()] || 3000;
    const priceInNgn = basePrice * parseInt(size);
    const priceConverted = priceInNgn * currencyRates[currency];
    const symbol = currencySymbols[currency];

    document.getElementById('selected-material').textContent = material.charAt(0).toUpperCase() + material.slice(1);
    document.getElementById('selected-size').textContent = size;
    document.getElementById('selected-price').textContent = symbol + priceConverted.toFixed(2);

    const country = document.getElementById('country').value;
    let fee = 0;
    if (country === 'Nigeria') {
      fee = deliveryFeeNgn * currencyRates[currency];
    } else if (country === 'Other') {
      fee = shippingFeeNgn * currencyRates[currency];
    }
    document.getElementById('fee').textContent = symbol + fee.toFixed(2);

    const total = priceConverted + fee;
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
