document.addEventListener('DOMContentLoaded', function() {
  const prescriptionForm = document.getElementById('prescription-details');
  const addToCartForm = document.querySelector('form[action="/cart/add"]');

  if (prescriptionForm && addToCartForm) {
    prescriptionForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      // Validate prescription form
      if (!prescriptionForm.checkValidity()) {
        prescriptionForm.reportValidity();
        return;
      }

      const formData = new FormData(prescriptionForm);
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

      // Add prescription data to the cart form
      const prescriptionInput = document.createElement('input');
      prescriptionInput.type = 'hidden';
      prescriptionInput.name = 'properties[Prescription]';
      prescriptionInput.value = JSON.stringify(prescriptionData);
      addToCartForm.appendChild(prescriptionInput);

      // Submit the cart form
      addToCartForm.submit();
    });
  }
});
