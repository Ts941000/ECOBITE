// ── VARIABLE: tracks which role the user picked (user or hotel) ──
    let role = "user";

    // ═══════════════════════════════
    // FUNCTION: show() — switches between Login and Signup tabs
    // ═══════════════════════════════
    function show(tab) {

      // Get both forms and both tabs
      let loginform  = document.getElementById("loginform");
      let signupform = document.getElementById("signupform");
      let logintab   = document.getElementById("logintab");
      let signuptab  = document.getElementById("signuptab");
      let title      = document.getElementById("formtitle");
      let sub        = document.getElementById("formsub");

      if (tab === "login") {
        // Show login form, hide signup form
        loginform.classList.add("show");
        signupform.classList.remove("show");

        // Make login tab bold/white, signup tab grey
        logintab.classList.add("on");
        signuptab.classList.remove("on");

        // Update title text
        title.textContent = "Welcome Back!";
        sub.textContent   = "Login to find today's food deals near you";

      } else {
        // Show signup form, hide login form
        signupform.classList.add("show");
        loginform.classList.remove("show");

        // Make signup tab bold/white, login tab grey
        signuptab.classList.add("on");
        logintab.classList.remove("on");

        // Update title text
        title.textContent = "Create Account";
        sub.textContent   = "Join EcoBite and start saving on meals today";
      }
    }

    // ═══════════════════════════════
    // FUNCTION: pick() — selects User or Hotel role in SIGNUP form
    // ═══════════════════════════════
    function pick(r) {
      role = r; // save the selected role

      let userrole  = document.getElementById("userrole");
      let hotelrole = document.getElementById("hotelrole");

      if (r === "user") {
        userrole.classList.add("on");
        hotelrole.classList.remove("on");
      } else {
        hotelrole.classList.add("on");
        userrole.classList.remove("on");
      }
    }

    // ═══════════════════════════════
    // FUNCTION: pickLogin() — selects User or Hotel role in LOGIN form
    // ═══════════════════════════════
    function pickLogin(r) {
      role = r; // same role variable — used by go() to redirect

      let luserrole  = document.getElementById("luserrole");
      let lhotelrole = document.getElementById("lhotelrole");

      if (r === "user") {
        luserrole.classList.add("on");
        lhotelrole.classList.remove("on");
      } else {
        lhotelrole.classList.add("on");
        luserrole.classList.remove("on");
      }
    }

    // ═══════════════════════════════
    // FUNCTION: toggle() — shows/hides password text
    // ═══════════════════════════════
    function toggle(id, btn) {
      let input = document.getElementById(id);

      if (input.type === "password") {
        input.type = "text";   // show password
        btn.textContent = "🙈"; // change icon
      } else {
        input.type = "password"; // hide password
        btn.textContent = "👁";  // change icon back
      }
    }

    // ═══════════════════════════════
    // FUNCTION: err() — shows or hides an error message
    // 'visible' is true to show error, false to hide it
    // NOTE: param was renamed from 'show' to 'visible'
    //       because 'show' is already a function name above
    // ═══════════════════════════════
    function err(id, visible) {
      let el = document.getElementById(id);
      if (visible) {
        el.classList.add("show");    // makes error visible
      } else {
        el.classList.remove("show"); // hides error
      }
    }

    // ═══════════════════════════════
    // FUNCTION: submit() — validates form and shows success popup
    // ═══════════════════════════════
    function validate(event, type) {
      event.preventDefault(); // stops page from refreshing on submit

      let ok = true; // we'll set this to false if any field is wrong

      if (type === "login") {

        // Get values from login form inputs
        let email = document.getElementById("lemail").value.trim();
        let pass  = document.getElementById("lpass").value;

        // Check if email is valid (must contain @ and .)
        if (!email.includes("@") || !email.includes(".")) {
          err("emailerr", true); ok = false;
        } else {
          err("emailerr", false); // clear error
        }

        // Check if password is at least 6 characters
        if (pass.length < 6) {
          err("passerr", true); ok = false;
        } else {
          err("passerr", false);
        }

        // If everything is valid, show success popup
        if (ok) {
          document.getElementById("popicon").textContent  = role === "hotel" ? "🏨" : "🎉";
          document.getElementById("poptitle").textContent = "Welcome Back!";
          document.getElementById("popmsg").textContent   = role === "hotel"
            ? "Logged in as Hotel. Opening your dashboard..."
            : "You are logged in. Let's find great deals!";
          // Fix Bug 3: change button text based on role
          document.getElementById("popbtn").textContent   = role === "hotel"
            ? "Go to Dashboard →"
            : "Browse Food Deals →";
          document.getElementById("popup").classList.add("show");
        }

      } else {

        // Get values from signup form inputs
        let fname = document.getElementById("fname").value.trim();
        let semail = document.getElementById("semail").value.trim();
        let phone = document.getElementById("phone").value.trim();
        let spass = document.getElementById("spass").value;
        let terms = document.getElementById("terms").checked; // true or false

        // Validate first name
        if (fname === "") {
          err("fnameerr", true); ok = false;
        } else {
          err("fnameerr", false);
        }

        // Validate email
        if (!semail.includes("@") || !semail.includes(".")) {
          err("semailerr", true); ok = false;
        } else {
          err("semailerr", false);
        }

        // Validate phone — must be exactly 10 digits
        if (phone.length !== 10 || isNaN(phone)) {
          err("phoneerr", true); ok = false;
        } else {
          err("phoneerr", false);
        }

        // Validate password length
        if (spass.length < 6) {
          err("spasserr", true); ok = false;
        } else {
          err("spasserr", false);
        }

        // Validate terms checkbox
        if (!terms) {
          err("termserr", true); ok = false;
        } else {
          err("termserr", false);
        }

        // If everything is valid, show success popup
        if (ok) {
          document.getElementById("popicon").textContent  = "🌿";
          document.getElementById("poptitle").textContent = "Account Created!";
          document.getElementById("popmsg").textContent   = "Welcome to EcoBite, " + fname + "! Let's rescue some food.";
          document.getElementById("popup").classList.add("show");
        }
      }
    }

    // ═══════════════════════════════
    // FUNCTION: go() — goes to the right page based on role
    // ═══════════════════════════════
    function go() {
      document.getElementById("popup").classList.remove("show");

      // Hotel users go to the dashboard, regular users go to homepage
      if (role === "hotel") {
        window.location.href = "dashboard.html";
      } else {
        window.location.href = "EcoBite.html";
      }
    }
