// ── DATA: food listings for this hotel ──
    let listings = [
      { id:1, emoji:"🍛", name:"Butter Chicken Thali", original:450, sale:99,  qty:12, time:"8:00–9:30 PM",   status:"active"  },
      { id:2, emoji:"🥗", name:"Garden Salad Platter", original:280, sale:69,  qty:6,  time:"7:00–8:30 PM",   status:"active"  },
      { id:3, emoji:"🍚", name:"Veg Biryani Box",       original:320, sale:79,  qty:0,  time:"9:00–10:00 PM",  status:"soldout" },
      { id:4, emoji:"🥘", name:"Dal Makhani Set",       original:350, sale:89,  qty:9,  time:"8:30–10:00 PM",  status:"active"  },
      { id:5, emoji:"🍜", name:"Hakka Noodles",         original:240, sale:59,  qty:14, time:"10:00–11:00 PM", status:"active"  },
      { id:6, emoji:"🫕", name:"Paneer Tikka Box",      original:390, sale:109, qty:4,  time:"9:30–10:30 PM",  status:"active"  },
    ];

    // ── DATA: recent orders ──
    let orders = [
      { id:"#EB1042", name:"Butter Chicken Thali", user:"Rahul S.",  qty:2, price:198,  status:"done"     },
      { id:"#EB1041", name:"Dal Makhani Set",       user:"Priya M.", qty:1, price:89,   status:"pending"  },
      { id:"#EB1040", name:"Hakka Noodles",         user:"Arun K.",  qty:3, price:177,  status:"done"     },
      { id:"#EB1039", name:"Paneer Tikka Box",      user:"Sneha T.", qty:1, price:109,  status:"canceled" },
      { id:"#EB1038", name:"Veg Biryani Box",       user:"Kiran P.", qty:2, price:158,  status:"done"     },
    ];

    // ── DATA: recent activity for overview ──
    let activity = [
      { icon:"📦", text:"Order #EB1042 received",            time:"2 min ago"  },
      { icon:"✅", text:"Butter Chicken Thali sold out",     time:"14 min ago" },
      { icon:"➕", text:"Hakka Noodles listing added",       time:"1 hr ago"   },
      { icon:"⭐", text:"New 5-star review received",        time:"2 hrs ago"  },
      { icon:"💰", text:"₹1,240 credited to your account",  time:"3 hrs ago"  },
    ];

    // ── Which emoji is currently selected in the add form ──
    let pickedEmoji = "🍛";

    // ════════════════════════════
    // FUNCTION: openPanel() — shows the right panel when menu is clicked
    // ════════════════════════════
    function openPanel(name) {

      // Hide ALL panels first
      let panels = document.querySelectorAll(".panel");
      panels.forEach(function(p) { p.classList.remove("show"); });

      // Remove "on" from ALL section buttons
      let secs = document.querySelectorAll(".sec");
      secs.forEach(function(s) { s.classList.remove("on"); });

      // Remove "on" from ALL sidebar menu items
      let items = document.querySelectorAll(".menuitem");
      items.forEach(function(i) { i.classList.remove("on"); });

      // Show the chosen panel
      document.getElementById("panel-" + name).classList.add("show");

      // Highlight the right section button
      document.getElementById("sec-" + name).classList.add("on");

      // Highlight the matching sidebar item
      let activeMenuItem = document.querySelector('.menuitem[data-panel="' + name + '"]');
      if (activeMenuItem) activeMenuItem.classList.add("on");

      // Update the page title
      let titles = {
        overview: "Overview",
        listings: "My Listings",
        add:      "Add New Listing",
        orders:   "Orders"
      };
      document.getElementById("pagetitle").textContent = titles[name];
    }

    // ════════════════════════════
    // FUNCTION: renderRows() — builds the listings table rows from data
    // ════════════════════════════
    function renderRows() {
      let box = document.getElementById("rows");

      box.innerHTML = listings.map(function(f) {
        let disc = Math.round(((f.original - f.sale) / f.original) * 100);

        // Build HTML for one row
        return `
          <div class="trow">
            <div class="temoji">${f.emoji}</div>
            <div>
              <div class="tname">${f.name}</div>
              <div class="thotel">${disc}% OFF</div>
            </div>
            <div>
              <div class="tprice">₹${f.sale}</div>
              <div class="told">₹${f.original}</div>
            </div>
            <div class="tqty" style="color:${f.qty === 0 ? '#d4531c' : '#1a2e1a'}">
              ${f.qty === 0 ? "Gone" : f.qty}
            </div>
            <div style="font-size:13px; color:#4a5a4a">${f.time}</div>
            <div>
              <span class="tstatus ${f.status}">
                ${f.status === "active" ? "✅ Active" : "❌ Sold Out"}
              </span>
            </div>
            <div class="actions">
              <button class="editbtn" onclick="editRow(${f.id})">Edit</button>
              <button class="delbtn"  onclick="delRow(${f.id})">🗑</button>
            </div>
          </div>
        `;
      }).join("");
    }

    // ════════════════════════════
    // FUNCTION: renderOrders() — builds the orders list from data
    // ════════════════════════════
    function renderOrders() {
      let box = document.getElementById("orderlist");

      box.innerHTML = orders.map(function(o) {
        return `
          <div class="ordercard">
            <div>
              <div class="onum">${o.id}</div>
              <div class="oname">${o.name}</div>
              <div class="ometa">👤 ${o.user} &nbsp;•&nbsp; Qty: ${o.qty}</div>
            </div>
            <div class="oprice">₹${o.price}</div>
            <span class="obadge ${o.status}">
              ${o.status === "done" ? "✅ Done" : o.status === "pending" ? "⏳ Pending" : "❌ Canceled"}
            </span>
          </div>
        `;
      }).join("");
    }

    // ════════════════════════════
    // FUNCTION: renderActivity() — builds overview activity feed
    // ════════════════════════════
    function renderActivity() {
      let box = document.getElementById("activity");
      box.innerHTML = activity.map(function(a) {
        return `
          <div style="display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid #f0f7f0;">
            <span style="font-size:20px">${a.icon}</span>
            <div style="flex:1; font-size:14px; font-weight:500">${a.text}</div>
            <span style="font-size:12px; color:#aaa">${a.time}</span>
          </div>
        `;
      }).join("");

      // Top selling items
      let top = document.getElementById("topsell");
      top.innerHTML = listings.slice(0, 4).map(function(f, i) {
        return `
          <div style="display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid #f0f7f0;">
            <span style="font-family:'Syne',sans-serif; font-size:13px; font-weight:800; color:#ccc; width:20px">${i+1}</span>
            <span style="font-size:22px">${f.emoji}</span>
            <div style="flex:1; font-size:14px; font-weight:600">${f.name}</div>
            <span style="font-family:'Syne',sans-serif; font-weight:800; font-size:15px">₹${f.sale}</span>
          </div>
        `;
      }).join("");
    }

    // ════════════════════════════
    // FUNCTION: pickEmoji() — selects an emoji in the add form
    // ════════════════════════════
    function pickEmoji(el) {
      // Remove "on" from all emoji buttons
      document.querySelectorAll(".epick").forEach(function(e) {
        e.classList.remove("on");
      });
      // Highlight the clicked one
      el.classList.add("on");
      pickedEmoji = el.textContent; // save selected emoji
    }

    // ════════════════════════════
    // FUNCTION: showToast() — shows a small notification at bottom-right
    // ════════════════════════════
    function showToast(msg, icon) {
      let toast = document.getElementById("toast");
      document.getElementById("toastmsg").textContent  = msg;
      document.getElementById("toasticon").textContent = icon || "✅";

      toast.classList.add("show");   // slide up

      // Auto-hide after 3 seconds
      setTimeout(function() {
        toast.classList.remove("show"); // slide back down
      }, 3000);
    }

    // ════════════════════════════
    // ── editId tracks which item is being edited (null = adding new) ──
    let editId = null;

    // FUNCTION: saveListing() — validates and saves (add new OR update existing)
    // ════════════════════════════
    function saveListing() {
      let name     = document.getElementById("fname").value.trim();
      let original = parseFloat(document.getElementById("foriginal").value);
      let sale     = parseFloat(document.getElementById("fsale").value);
      let qty      = parseInt(document.getElementById("fqty").value, 10);
      let type     = document.getElementById("ftype").value;
      let timestr  = document.getElementById("ftime").value.trim() || "Pickup tonight";
      let ok       = true;

      document.getElementById("ferr-name").classList.toggle("show", name === "");
      document.getElementById("ferr-original").classList.toggle("show", !Number.isFinite(original) || original <= 0);
      document.getElementById("ferr-sale").classList.toggle("show", !Number.isFinite(sale) || sale <= 0 || sale >= original);
      document.getElementById("ferr-qty").classList.toggle("show", !Number.isInteger(qty) || qty < 1);
      document.getElementById("ferr-type").classList.toggle("show", type === "");

      ok = name !== "" &&
        Number.isFinite(original) && original > 0 &&
        Number.isFinite(sale) && sale > 0 && sale < original &&
        Number.isInteger(qty) && qty >= 1 &&
        type !== "";

      if (ok) {
        if (editId !== null) {
          let item = listings.find(function(f) { return f.id === editId; });
          if (item) {
            item.emoji    = pickedEmoji;
            item.name     = name;
            item.original = original;
            item.sale     = sale;
            item.qty      = qty;
            item.type     = type;
            item.time     = timestr;
            item.status   = qty > 0 ? "active" : "soldout";
          }
          showToast("'" + name + "' updated! ✏️", "✅");
          editId = null;
          document.getElementById("savebtn").textContent = "✅ Save Listing";

        } else {
          listings.push({
            id: Date.now(), emoji: pickedEmoji, name: name,
            original: original, sale: sale, qty: qty, type: type,
            time: timestr, status: "active"
          });
          showToast("'" + name + "' listed successfully! 🍛", "✅");
        }

        document.getElementById("totallistings").textContent = listings.length;
        renderRows();
        renderActivity();
        openPanel("listings");

        // Clear form
        document.getElementById("fname").value = "";
        document.getElementById("foriginal").value = "";
        document.getElementById("fsale").value = "";
        document.getElementById("fqty").value = "";
        document.getElementById("ftype").value = "";
        document.getElementById("ftime").value = "";
        document.getElementById("fdesc").value = "";
      }
    }
    // ════════════════════════════
    // FUNCTION: delRow() — deletes a listing by its id
    // ════════════════════════════
    function delRow(id) {
      let ok = confirm("Delete this listing? This cannot be undone.");
      if (ok) {
        listings = listings.filter(function(f) { return f.id !== id; });
        document.getElementById("totallistings").textContent = listings.length;
        renderRows();
        showToast("Listing deleted", "🗑");
      }
    }

    // ════════════════════════════
    // FUNCTION: editRow() — pre-fills form with item data for editing
    // ════════════════════════════
    function editRow(id) {
  let item = listings.find(function(f) { return f.id === id; });
  if (!item) return;

  editId = id;
  document.getElementById("fname").value     = item.name;
  document.getElementById("foriginal").value = item.original;
  document.getElementById("fsale").value     = item.sale;
  document.getElementById("fqty").value      = item.qty;
  document.getElementById("ftype").value     = item.type || "";
  document.getElementById("ftime").value     = item.time; // Added time sync

  document.getElementById("savebtn").textContent = "✏️ Update Listing";
  openPanel("add");
  showToast("Edit the fields and click Update", "✏️");
}

    // ── MOBILE SIDEBAR TOGGLE ──
    function toggleSidebar() {
      let sidebar = document.getElementById("sidebar");
      let overlay = document.getElementById("sidebarOverlay");
      let btn = document.getElementById("mHamburger");
      sidebar.classList.toggle("open");
      overlay.classList.toggle("open");
      btn.textContent = sidebar.classList.contains("open") ? "✕" : "☰";
    }

    // ── FIRST LOAD: render everything ──
    renderRows();
    renderOrders();
    renderActivity();
