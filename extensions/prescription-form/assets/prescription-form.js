const prescriptionForm = {
  onSubmit: function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    const prescriptionData = {
      leftEye: {
        sphere: formData.get('left-sphere'),
        cylinder: formData.get('left-cylinder'),
        axis: formData.get('left-axis')
      },
      rightEye: {
        sphere: formData.get('right-sphere'),
        cylinder: formData.get('right-cylinder'),
        axis: formData.get('right-axis')
      }
    };

    // Add to cart with prescription data
    const addToCartForm = document.querySelector('form[action="/cart/add"]');
    if (!addToCartForm) {
      console.error('Add to cart form not found');
      return;
    }

    const prescriptionInput = document.createElement('input');
    prescriptionInput.type = 'hidden';
    prescriptionInput.name = 'properties[Prescription]';
    prescriptionInput.value = JSON.stringify(prescriptionData);
    addToCartForm.appendChild(prescriptionInput);
    
    // Submit the add to cart form
    addToCartForm.submit();
  }
};

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('prescription-details');
  if (form) {
    form.addEventListener('submit', prescriptionForm.onSubmit);
  }
});
