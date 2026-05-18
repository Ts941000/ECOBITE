// ── DATA: All food items ──
let foods = [
  { id:1, name:"Butter Chicken Thali",  hotel:"Taj Palace Hotel",  place:"Connaught Place, Delhi",    city:"Delhi",     original:450, sale:99,  stars:4.8, time:"8:00–9:30 PM",   qty:12, type:"NonVeg", emoji:"🍛", tag:"Hot Deal",   color:"#FF6B35" },
  { id:2, name:"Paneer Biryani + Raita",hotel:"The Oberoi Grand",  place:"Nariman Point, Mumbai",     city:"Mumbai",    original:380, sale:79,  stars:4.9, time:"9:00–10:00 PM",  qty:8,  type:"Veg",    emoji:"🍚", tag:"Almost Gone",color:"#2D9B5A" },
  { id:3, name:"Chicken Kebab Platter", hotel:"ITC Maurya",        place:"Diplomatic Enclave, Delhi", city:"Delhi",     original:620, sale:149, stars:4.7, time:"10:00–11:00 PM", qty:5,  type:"NonVeg", emoji:"🍢", tag:"Must Try",   color:"#D4531C" },
  { id:4, name:"South Indian Spread",   hotel:"Leela Palace",      place:"Airport Road, Bengaluru",   city:"Bengaluru", original:290, sale:59,  stars:4.6, time:"7:30–9:00 PM",   qty:20, type:"Veg",    emoji:"🥘", tag:"Popular",    color:"#F4A200" },
  { id:5, name:"Mughlai Feast Box",     hotel:"Hyatt Regency",     place:"Banjara Hills, Hyderabad",  city:"Hyderabad", original:520, sale:119, stars:4.8, time:"9:30–10:30 PM",  qty:7,  type:"NonVeg", emoji:"🫕", tag:"Chef's Pick",color:"#7B4F9E" },
  { id:6, name:"Veg Thali Deluxe",      hotel:"Marriott Jaipur",   place:"C-Scheme, Jaipur",          city:"Jaipur",    original:330, sale:69,  stars:4.5, time:"8:30–10:00 PM",  qty:15, type:"Veg",    emoji:"🥗", tag:"Eco Save",   color:"#2D9B5A" },
];

let cities = ["All", "Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Jaipur"];
let types  = ["All", "Veg", "NonVeg"];

let pickedCity = "All";
let pickedType = "All";
let added  = {};
let cartdata = [];

// ── FUNCTION: updateCount & Sync ──
function updateCount() {
  let latest = localStorage.getItem("ecobite-cart");
  cartdata = latest ? JSON.parse(latest) : [];
  
  // Rebuild the 'added' object cleanly
  added = {};
  let total = 0;
  cartdata.forEach(function(i) { 
    added[i.id] = true; 
    total += i.qty; 
  });
  
  document.getElementById("count").textContent = total;
  showCards(); // Re-render to update button states if modified elsewhere
}

// Sync across tabs in real-time
window.addEventListener('storage', function(e) {
  if(e.key === "ecobite-cart") updateCount();
});

// Run once on load
updateCount();

// ── BUILD FILTERS ──
cities.forEach(function(c) {
  let btn = document.createElement("button");
  btn.className = "citybtn" + (c === pickedCity ? " on" : "");
  btn.textContent = c;
  btn.id = "city" + c;
  btn.onclick = function() { pickedCity = c; refresh(); showCards(); };
  document.getElementById("citygroup").appendChild(btn);
});

types.forEach(function(t) {
  let btn = document.createElement("button");
  let base = t === "Veg" ? "catbtn veg" : t === "NonVeg" ? "catbtn nonveg" : "catbtn all";
  btn.className = base + (t === pickedType ? " on" : "");
  btn.id = "cat" + t;
  btn.innerHTML = t === "Veg" ? "🟢 Veg" : t === "NonVeg" ? "🔴 Non-Veg" : "✦ All";
  btn.onclick = function() { pickedType = t; refresh(); showCards(); };
  document.getElementById("catgroup").appendChild(btn);
});

function refresh() {
  cities.forEach(function(c) { document.getElementById("city" + c).className = "citybtn" + (c === pickedCity ? " on" : ""); });
  types.forEach(function(t) {
    let base = t === "Veg" ? "catbtn veg" : t === "NonVeg" ? "catbtn nonveg" : "catbtn all";
    document.getElementById("cat" + t).className = base + (t === pickedType ? " on" : "");
  });
}

function showCards() {
  let q = document.getElementById("search").value.toLowerCase();
  let grid = document.getElementById("grid");

  let list = foods.filter(function(f) {
    let matchCity   = pickedCity === "All" || f.city === pickedCity;
    let matchType   = pickedType === "All" || f.type === pickedType;
    let matchSearch = f.name.toLowerCase().includes(q) || f.hotel.toLowerCase().includes(q);
    return matchCity && matchType && matchSearch;
  });

  if (list.length === 0) {
    grid.innerHTML = '<div id="empty"><div style="font-size:48px">🍽️</div><p style="margin-top:12px">No meals found. Try another filter.</p></div>';
    return;
  }

  grid.innerHTML = list.map(function(f) {
    let disc     = Math.round(((f.original - f.sale) / f.original) * 100);
    let tagcolor = f.type === "Veg" ? "#2d9b5a" : "#d4531c";
    let qtycolor = f.qty < 10 ? "#d4531c" : "#2d9b5a";
    let qtyicon  = f.qty < 10 ? "🔥" : "✅";
    let done     = added[f.id];

    return `
      <div class="item">
        <div class="top" style="background:linear-gradient(135deg,${f.color}22,${f.color}44)">
          <span class="emoji">${f.emoji}</span>
          <span class="tag1" style="background:${f.color}">${f.tag}</span>
          <span class="tag2" style="border-color:${tagcolor};color:${tagcolor}">${f.type === "Veg" ? "🟢 Veg" : "🔴 Non-Veg"}</span>
        </div>
        <div class="body">
          <div class="hotel">${f.hotel}</div>
          <div class="name">${f.name}</div>
          <div class="loc">📍 ${f.place}</div>
          <div class="meta"><span>⭐ ${f.stars}</span><span>⏰ ${f.time}</span></div>
          <div class="qty" style="color:${qtycolor}">${qtyicon} ${f.qty} left</div>
          <div class="foot">
            <div class="pricing">
              <span class="mrp">₹${f.original}</span><span class="sell">₹${f.sale}</span><span class="off">${disc}% OFF</span>
            </div>
            <button class="addbtn" style="background:${done ? "#2d9b5a" : f.color}" onclick="add(${f.id}, this)">
              ${done ? "✓ Added" : "Add +"}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function add(id, btn) {
  if (!added[id]) {
    added[id] = true;
    let food = foods.find(function(f) { return f.id === id; });
    cartdata.push({
      id: food.id, emoji: food.emoji, name: food.name, hotel: food.hotel,
      original: food.original, sale: food.sale, qty: 1, time: food.time,
      type: food.type === "Veg" ? "Veg" : "Non-Veg"
    });
    localStorage.setItem("ecobite-cart", JSON.stringify(cartdata));
    updateCount();
  }
}

function toggleMenu() {
  let m = document.getElementById("mobileMenu");
  m.classList.toggle("open");
  document.getElementById("hamburger").textContent = m.classList.contains("open") ? "✕" : "☰";
}
function goto() { document.getElementById("listings").scrollIntoView({ behavior: "smooth" }); }
document.getElementById("search").addEventListener("input", showCards);
