// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })();


// function validateForm(event){
//   const comment = document.getElementById("comment").value.trim();
//   if(comment===" "){
//     errorMessage.style.display ="block";
//     return false;
//   }else{
//     errorMessage.style.display = "none";
//   }
//   return true;
// }  

document.getElementById("reviewForm").addEventListener("submit", function (event) {
  // Select the comment field and error message
  const commentField = document.getElementById("comment");
  const errorMessage = document.getElementById("error-message");


  // Trim whitespace from the comment field value
  const comment = commentField.value.trim();

  // Validation check: prevent submission if the comment is empty
  if (comment === "") {
      event.preventDefault(); // Stop form submission
      errorMessage.style.display = "block"; // Show error message
      errorMessage.textContent = "Please write something meaningful!"; // Update error message
      commentField.classList.add("error");
      commentField.focus(); // Focus the comment field
  } else {
      errorMessage.style.display = "none"; 
  }
});
