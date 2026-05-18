// ════════════════════════════════
    // DATA: read cart from localStorage (saved by EcoBite.html)
    // If nothing saved yet, use an empty array
    // ════════════════════════════════
    let storedCart = localStorage.getItem("ecobite-cart");   // renamed from 'saved' to avoid collision
    let cart = storedCart ? JSON.parse(storedCart) : [];

    // Which payment method is selected
    let paymethod = "upi";

    // Coupon discount (starts at 0)
    let discount = 0;

    // Valid coupons: code → discount amount in rupees
    let coupons = {
      "ECOBITE10": 10,
      "SAVE20":    20,
      "FIRSTBITE": 30,
    };

    // ════════════════════════════════
    // FUNCTION: render() — draws all cart items on screen
    // ════════════════════════════════
    function render() {
      let box = document.getElementById("cartlist");

      // If cart is empty — show empty message, hide cart
      if (cart.length === 0) {
        box.innerHTML = "";
        document.getElementById("empty").classList.add("show");
        document.getElementById("orderbtn").disabled = true;
        document.getElementById("pickup").style.display = "none";
      } else {
        document.getElementById("empty").classList.remove("show");
        document.getElementById("orderbtn").disabled = false;
        document.getElementById("pickup").style.display = "block";
      }

      // Build HTML for each cart item
      box.innerHTML = cart.map(function(item) {
        let moneySaved = (item.original - item.sale) * item.qty; // renamed from 'saved' to avoid collision
        return `
          <div class="citem">

            <!-- Emoji box -->
            <div class="cemoji">${item.emoji}</div>

            <!-- Item details -->
            <div class="cinfo">
              <div class="cname">${item.name}</div>
              <div class="chotel">🏨 ${item.hotel} &nbsp;•&nbsp; ⏰ ${item.time}</div>
              <div class="ctags">
                <span class="ctag tagreen">${item.type === "Veg" ? "🟢 Veg" : "🔴 Non-Veg"}</span>
                <span class="ctag taorange">⚡ Pickup only</span>
              </div>
            </div>

            <!-- Price -->
            <div class="cprice">
              <div class="cnew">₹${item.sale * item.qty}</div>
              <div class="cold">₹${item.original * item.qty}</div>
              <div class="csave">Save ₹${moneySaved}</div>
            </div>

            <!-- Quantity controls -->
            <div class="cqty">
              <!-- Minus button: decrease qty, remove if reaches 0 -->
              <button class="qbtn" onclick="changeQty(${item.id}, -1)">−</button>
              <div class="qnum">${item.qty}</div>
              <!-- Plus button: increase qty -->
              <button class="qbtn" onclick="changeQty(${item.id}, +1)">+</button>
            </div>

            <!-- Remove button -->
            <button class="cremove" onclick="removeItem(${item.id})">🗑</button>

          </div>
        `;
      }).join("");

      // Update cart count and totals
      updateSummary();
    }

    // ════════════════════════════════
    // FUNCTION: changeQty() — increase or decrease item quantity
    // ════════════════════════════════
    function changeQty(id, change) {
      // Find the item in the cart array
      let item = cart.find(function(c) { return c.id === id; });
      if (!item) return;

      item.qty += change; // add or subtract 1

      // If qty drops to 0, remove the item entirely
      if (item.qty <= 0) {
        removeItem(id);
        return;
      }

      // Save updated cart back to localStorage
      localStorage.setItem("ecobite-cart", JSON.stringify(cart));

      render(); // re-draw the cart
    }

    // ════════════════════════════════
    // FUNCTION: removeItem() — removes an item from cart
    // ════════════════════════════════
    function removeItem(id) {
      // Filter out the item with this id
      cart = cart.filter(function(c) { return c.id !== id; });

      // Save updated cart to localStorage
      localStorage.setItem("ecobite-cart", JSON.stringify(cart));

      render(); // re-draw
      showToast("Item removed from cart", "🗑");
    }

    // ════════════════════════════════
    // FUNCTION: updateSummary() — recalculates and updates all totals
    // ════════════════════════════════
    function updateSummary() {
  let subtotal  = 0;
  let origTotal = 0;
  let count     = 0;

  cart.forEach(function(item) {
    subtotal  += item.sale     * item.qty;
    origTotal += item.original * item.qty;
    count     += item.qty;
  });

  // FIX: Prevent negative totals when coupons exceed subtotal
  let total   = subtotal > 0 ? Math.max(0, subtotal + 5 - discount) : 0; 
  let saving  = origTotal - subtotal;

  document.getElementById("itemcount").textContent  = count;
  document.getElementById("itemlabel").textContent  = count + " item" + (count !== 1 ? "s" : "");
  document.getElementById("subtotal").textContent   = "₹" + subtotal;
  document.getElementById("total").textContent      = "₹" + total;
  document.getElementById("savingamt").textContent  = "₹" + saving;
  document.getElementById("btnamt").textContent     = "₹" + total;
}

    // ════════════════════════════════
    // FUNCTION: selectPay() — selects a payment method
    // ════════════════════════════════
    function selectPay(method) {
      paymethod = method; // save the chosen method

      // Remove "on" from all payment options
      document.querySelectorAll(".payopt").forEach(function(el) {
        el.classList.remove("on");
      });

      // Add "on" to the chosen one
      document.getElementById("pay-" + method).classList.add("on");
    }

    // ════════════════════════════════
    // FUNCTION: applyCoupon() — checks if coupon is valid
    // ════════════════════════════════
    function applyCoupon() {
      let code = document.getElementById("couponinput").value.trim().toUpperCase();
      let msg  = document.getElementById("couponmsg");

      if (coupons[code]) {
        // Valid coupon — apply discount
        discount = coupons[code];
        msg.textContent = "✅ Coupon applied! You saved extra ₹" + discount;
        msg.className   = "good";  // green text
        updateSummary();
        showToast("Coupon applied! Extra ₹" + discount + " off 🎉", "🏷️");
      } else {
        // Invalid coupon
        discount        = 0;
        msg.textContent = "❌ Invalid coupon code. Try: ECOBITE10";
        msg.className   = "bad";   // red text
        updateSummary();
      }
    }

    // ════════════════════════════════
    // FUNCTION: placeOrder() — validates form and shows success screen
    // ════════════════════════════════
    function placeOrder() {
      if (cart.length === 0) return;

      // Read form values
      let fname = document.getElementById("pfname").value.trim();
      let phone = document.getElementById("pphone").value.trim();
      let email = document.getElementById("pemail").value.trim();
      let time  = document.getElementById("ptime").value;

      let ok = true; // turns false if any validation fails

      // Check first name
      if (fname === "") {
        document.getElementById("err-pfname").classList.add("show"); ok = false;
      } else {
        document.getElementById("err-pfname").classList.remove("show");
      }

      // Check phone — must be exactly 10 digits
      if (phone.length !== 10 || isNaN(phone)) {
        document.getElementById("err-pphone").classList.add("show"); ok = false;
      } else {
        document.getElementById("err-pphone").classList.remove("show");
      }

      // Check email — must have @ and a dot
      if (!email.includes("@") || !email.includes(".")) {
        document.getElementById("err-pemail").classList.add("show"); ok = false;
      } else {
        document.getElementById("err-pemail").classList.remove("show");
      }

      // Check pickup time
      if (time === "") {
        document.getElementById("err-ptime").classList.add("show"); ok = false;
      } else {
        document.getElementById("err-ptime").classList.remove("show");
      }

      // If all good — show success screen
      if (ok) {

        // Build a random order ID like #EB2048
        let orderid = "#EB" + Math.floor(1000 + Math.random() * 9000);

        // Fill in the success screen details
        document.getElementById("oid").textContent   = orderid;
        document.getElementById("opaid").textContent = document.getElementById("total").textContent;
        document.getElementById("otime").textContent = time;
        document.getElementById("opay").textContent  =
          paymethod === "upi"  ? "UPI" :
          paymethod === "card" ? "Card" : "Cash at Pickup";

        // Clear the cart from localStorage — order is done!
        localStorage.removeItem("ecobite-cart");

        // Highlight the breadcrumb step 4 as done
        document.getElementById("step4").classList.add("on");

        // Show the success overlay
        document.getElementById("success").classList.add("show");
      }
    }

    // ════════════════════════════════
    // FUNCTION: showToast() — shows a small popup notification
    // ════════════════════════════════
    function showToast(msg, icon) {
      document.getElementById("tmsg").textContent  = msg;
      document.getElementById("ticon").textContent = icon || "✅";
      let toast = document.getElementById("toast");
      toast.classList.add("show");
      // Auto-hide after 3 seconds
      setTimeout(function() { toast.classList.remove("show"); }, 3000);
    }

    // ── FIRST LOAD: draw the cart ──
    render();
