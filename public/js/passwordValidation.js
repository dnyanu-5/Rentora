document.getElementById("signinForm").addEventListener("submit", function (e) {
    const passwordInput = document.getElementById("password");
    const password = passwordInput.value;
    const errorDiv = document.getElementById("passwordError");

    const valid =
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[@#$%^&*]/.test(password);  

    if (!valid) {
        e.preventDefault();
        passwordInput.classList.add("is-invalid");
        errorDiv.innerText =
            "Password must be at least 8 characters and include a number, a lowercase letter, an uppercase letter, and one special character (@, #, $, %,^,&,*).";
    } else {
        passwordInput.classList.remove("is-invalid");
        passwordInput.classList.add("is-valid");
    }
});


