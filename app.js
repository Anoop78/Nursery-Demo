/* ══════════════════════════════════════════
   CHAMBAL GARDEN — app.js
══════════════════════════════════════════ */

/* ─── DATA ─── */
let products = [
  {id:1,name:'Monstera Deliciosa',tag:'Indoor',emoji:'🌿',bg:'p1',price:849,oldPrice:1199,rating:4.9,reviews:124,desc:'The iconic split-leaf beauty. Air-purifying & low maintenance.',badge:'new',category:'indoor',stock:'in',care:'Low',light:'Indirect',water:'Weekly',size:'Medium'},
  {id:2,name:'Peace Lily',tag:'Flowering',emoji:'💐',bg:'p2',price:549,oldPrice:null,rating:4.8,reviews:87,desc:'Elegant white blooms that thrive in low light.',badge:null,category:'flowering',stock:'in',care:'Easy',light:'Low',water:'2x week',size:'Small'},
  {id:3,name:'Snake Plant',tag:'Succulents',emoji:'🌱',bg:'p3',price:399,oldPrice:599,rating:4.7,reviews:203,desc:'Nearly indestructible. Perfect for beginners and busy folks.',badge:'sale',category:'succulents',stock:'in',care:'Very Low',light:'Any',water:'Monthly',size:'Small'},
  {id:4,name:'Golden Pothos',tag:'Indoor',emoji:'🍃',bg:'p4',price:299,oldPrice:null,rating:4.9,reviews:312,desc:'Fast-growing trailing vine with gorgeous variegated leaves.',badge:null,category:'indoor',stock:'in',care:'Low',light:'Any',water:'Weekly',size:'Trailing'},
  {id:5,name:'Anthurium Red',tag:'Flowering',emoji:'🌺',bg:'p5',price:699,oldPrice:899,rating:4.8,reviews:65,desc:'Stunning waxy red blooms that last for months.',badge:'new',category:'flowering',stock:'low',care:'Moderate',light:'Bright',water:'2x week',size:'Medium'},
  {id:6,name:'ZZ Plant',tag:'Rare Finds',emoji:'🌾',bg:'p6',price:999,oldPrice:1499,rating:4.9,reviews:48,desc:'Glossy dark leaves with exceptional drought tolerance.',badge:'sale',category:'rare',stock:'low',care:'Very Low',light:'Low',water:'Monthly',size:'Large'},
  {id:7,name:'Boston Fern',tag:'Indoor',emoji:'🌿',bg:'p7',price:450,oldPrice:null,rating:4.6,reviews:92,desc:'Lush feathery fronds that purify air beautifully.',badge:null,category:'indoor',stock:'in',care:'Moderate',light:'Indirect',water:'3x week',size:'Medium'},
  {id:8,name:'Bird of Paradise',tag:'Rare Finds',emoji:'🌴',bg:'p8',price:1599,oldPrice:2199,rating:4.9,reviews:31,desc:'Dramatic tropical statement plant for large spaces.',badge:'new',category:'rare',stock:'low',care:'Moderate',light:'Bright',water:'Weekly',size:'XL'},
];

let allReviews = {
  1:[{user:'Priya M.',stars:5,text:'Absolutely love this Monstera! Arrived in perfect condition.',date:'Mar 15'},{user:'Dev A.',stars:4,text:'Beautiful plant, slightly smaller than expected.',date:'Mar 10'}],
  2:[{user:'Sneha J.',stars:5,text:'My peace lily is thriving! Great packaging.',date:'Mar 12'}],
  3:[{user:'Rahul K.',stars:5,text:"Bulletproof plant. Even my black thumb couldn't kill it!",date:'Mar 8'},{user:'Kavya S.',stars:4,text:'Good quality, fast delivery.',date:'Mar 5'}],
  4:[{user:'Amit V.',stars:5,text:'Growing so fast! Looks stunning in my living room.',date:'Mar 18'}],
  5:[],6:[],7:[],8:[],
};

let cart=[], wishlist=new Set(), currentUser=null, loyaltyPoints=0, discountPct=0;
let activeFilter='all', editingProductId=null, searchQuery='', _pmQty=1;

/* ─── QUIZ DATA ─── */
const quizQuestions = [
  {q:'How much natural light does your space get?',opts:[{e:'☀️',t:'Bright & sunny',sub:'Window-facing'},{e:'🌤️',t:'Partial light',sub:'Some sun'},{e:'☁️',t:'Low light',sub:'No direct sun'},{e:'💡',t:'Artificial only',sub:'Office/basement'}]},
  {q:'How often do you travel or forget to water?',opts:[{e:'🌊',t:'Water regularly',sub:'Every 2–3 days'},{e:'💧',t:'Once a week',sub:'Pretty consistent'},{e:'🏜️',t:'Sometimes forget',sub:'Every few weeks'},{e:'🦖',t:'Rarely water',sub:'Almost never'}]},
  {q:'Where will your plant live?',opts:[{e:'🛋️',t:'Living room',sub:'Statement piece'},{e:'🛁',t:'Bathroom',sub:'Humidity lover'},{e:'💼',t:'Office desk',sub:'Small & compact'},{e:'🌿',t:'Balcony/outdoors',sub:'Open air'}]},
  {q:'What vibe are you going for?',opts:[{e:'🌴',t:'Tropical jungle',sub:'Bold & leafy'},{e:'🌸',t:'Colour & blooms',sub:'Flowers & colour'},{e:'🎍',t:'Clean minimal',sub:'Simple elegance'},{e:'🌵',t:'Desert cool',sub:'Sculptural & edgy'}]},
];
const quizResults = [
  {emoji:'🌿',title:'The Tropical Collector',desc:'You thrive with lush, leafy tropical plants that fill your space with jungle energy.',recs:[1,4,7]},
  {emoji:'🌸',title:'The Bloom Chaser',desc:'You love colour and life — flowering plants that brighten every corner are your match.',recs:[2,5,1]},
  {emoji:'🌵',title:'The Effortless Minimalist',desc:'Low-maintenance, sculptural plants that look great with zero fuss are perfect for you.',recs:[3,6,4]},
  {emoji:'🌴',title:'The Statement Maker',desc:'You want plants that command attention and make people say "wow".',recs:[8,1,6]},
];
let quizStep=0, quizAnswers=[];

/* ════════════════ VIEWS ════════════════ */
function showView(v) {
  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  const el = document.getElementById(v+'View');
  if (el) { el.classList.add('active'); window.scrollTo(0,0); }
  closeMobileMenu();
  if (v==='admin') { renderAdminProducts(); renderAdminReviews(); }
  if (v==='quiz')  { startQuiz(); }
}

/* ════════════════ MOBILE MENU ════════════════ */
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const burger = document.getElementById('hamburger');
  menu.classList.toggle('open');
  burger.classList.toggle('open');
}
function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}

/* ════════════════ PRODUCTS ════════════════ */
function renderProducts() {
  const grid = document.getElementById('productsGrid');
  const query = searchQuery.toLowerCase();
  const priceEl = document.getElementById('priceRange');
  const maxP = priceEl ? parseInt(priceEl.value) : 9999;
  const sortEl = document.getElementById('sortSelect');
  const sort = sortEl ? sortEl.value : 'default';

  let list = [...products];
  if (activeFilter !== 'all') list = list.filter(p => p.category === activeFilter);
  if (query) list = list.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.tag.toLowerCase().includes(query) ||
    p.desc.toLowerCase().includes(query)
  );
  list = list.filter(p => p.price <= maxP);
  if (sort === 'price-asc')  list.sort((a,b) => a.price - b.price);
  if (sort === 'price-desc') list.sort((a,b) => b.price - a.price);
  if (sort === 'rating')     list.sort((a,b) => b.rating - a.rating);
  if (sort === 'popular')    list.sort((a,b) => b.reviews - a.reviews);

  if (!list.length) {
    grid.innerHTML = `<div class="no-results"><div class="no-results-icon">🌵</div><p>No plants found.</p><p style="font-size:.8rem;color:#ccc;margin-top:.3rem">Try adjusting your filters</p></div>`;
    return;
  }
  grid.innerHTML = list.map(p => `
    <div class="product-card">
      <div class="product-image ${p.bg}" onclick="openProductModal(${p.id})">
        <span style="z-index:1">${p.emoji}</span>
        ${p.badge ? `<span class="badge-${p.badge}">${p.badge==='new'?'New':'Sale'}</span>` : ''}
        <button class="wishlist-btn ${wishlist.has(p.id)?'wishlisted':''}" onclick="event.stopPropagation();toggleWishlist(${p.id})">${wishlist.has(p.id)?'❤️':'🤍'}</button>
      </div>
      <div class="product-info">
        <div class="product-tag">${p.tag}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-meta">
          <div class="product-price">₹${p.price}${p.oldPrice?`<span class="old-price">₹${p.oldPrice}</span>`:''}</div>
          <div class="rating">★ ${p.rating} <span style="color:#ccc">(${p.reviews})</span></div>
        </div>
        <div class="product-actions">
          <button class="add-cart-btn" onclick="addToCart(${p.id})">🛒 Add to Cart</button>
          <button class="view-btn" onclick="openProductModal(${p.id})">View</button>
        </div>
      </div>
    </div>`).join('');
}

function setPill(el, f) {
  document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  activeFilter = f;
  renderProducts();
}
function shopFilter(cat) {
  scrollToShop();
  setTimeout(() => {
    document.querySelectorAll('.filter-pill').forEach(p => {
      p.classList.remove('active');
      if (p.dataset.filter === cat) p.classList.add('active');
    });
    activeFilter = cat;
    renderProducts();
  }, 400);
}
function applyFilters() { renderProducts(); }
function liveSearch(v) {
  searchQuery = v;
  const shopEl = document.getElementById('shopSearch');
  if (shopEl) shopEl.value = v;
  renderProducts();
}
function updatePriceLabel() {
  const el = document.getElementById('priceRange');
  const lbl = document.getElementById('priceLabel');
  if (el && lbl) lbl.textContent = el.value;
}

/* ════════════════ PRODUCT MODAL ════════════════ */
function openProductModal(id) {
  const p = products.find(x => x.id === id);
  const revs = allReviews[id] || [];
  const avgR = revs.length
    ? Math.round(revs.reduce((s,r) => s+r.stars, 0) / revs.length * 10) / 10
    : p.rating;
  const content = document.getElementById('productModalContent');
  _pmQty = 1;
  content.innerHTML = `
    <div class="product-modal-inner">
      <div class="pm-image ${p.bg}" style="font-size:9rem">${p.emoji}</div>
      <div class="pm-body">
        <div class="pm-tag">${p.tag}</div>
        <div class="pm-name">${p.name}</div>
        <div class="pm-rating">
          <span class="pm-stars">${'★'.repeat(Math.round(avgR))}${'☆'.repeat(5-Math.round(avgR))}</span>
          <span style="font-size:.82rem;color:#999">${avgR} (${revs.length||p.reviews} reviews)</span>
        </div>
        <div class="pm-price-row">
          <div class="pm-price">₹${p.price}</div>
          ${p.oldPrice ? `<div class="pm-old">₹${p.oldPrice}</div>` : ''}
        </div>
        <div class="pm-desc">${p.desc}</div>
        <div class="pm-attrs">
          <div class="pm-attr"><div class="pm-attr-label">Care Level</div><div class="pm-attr-val">${p.care}</div></div>
          <div class="pm-attr"><div class="pm-attr-label">Light</div><div class="pm-attr-val">${p.light}</div></div>
          <div class="pm-attr"><div class="pm-attr-label">Water</div><div class="pm-attr-val">${p.water}</div></div>
          <div class="pm-attr"><div class="pm-attr-label">Size</div><div class="pm-attr-val">${p.size}</div></div>
        </div>
        <div class="pm-qty-row">
          <div class="qty-ctrl">
            <button class="qty-btn" onclick="pmQty(-1)">−</button>
            <span class="qty-num" id="pmQty">1</span>
            <button class="qty-btn" onclick="pmQty(1)">+</button>
          </div>
          <span style="font-size:.78rem;color:${p.stock==='in'?'var(--green-fresh)':p.stock==='low'?'#f57f17':'var(--red)'};font-weight:600">
            ${p.stock==='in'?'✅ In Stock':p.stock==='low'?'⚠️ Low Stock':'❌ Out of Stock'}
          </span>
        </div>
        <div class="pm-actions">
          <button class="pm-add-cart" onclick="addToCartQty(${p.id})">🛒 Add to Cart</button>
          <button class="pm-wishlist" onclick="toggleWishlist(${p.id})">${wishlist.has(p.id)?'❤️':'🤍'}</button>
        </div>
        <div class="pm-reviews">
          <div class="pm-reviews-title">Customer Reviews (${revs.length})</div>
          ${revs.map(r => `
            <div class="review-item">
              <div class="review-header">
                <span class="reviewer-name">${r.user}</span>
                <span class="review-stars">${'★'.repeat(r.stars)} ${r.date}</span>
              </div>
              <div class="review-text">${r.text}</div>
            </div>`).join('') || '<p style="font-size:.83rem;color:#bbb">No reviews yet. Be the first!</p>'}
          <div class="add-review-form">
            <div class="star-picker" id="starPicker" onclick="pickStars(event)">☆☆☆☆☆</div>
            <textarea id="reviewText" rows="2" placeholder="Share your experience…"></textarea>
            <button class="review-submit" onclick="submitReview(${p.id})">Submit Review</button>
          </div>
        </div>
      </div>
    </div>`;
  document.getElementById('productModal').classList.add('open');
  window._pmProductId = id;
  window._pmStars = 0;
}
function pmQty(d) {
  _pmQty = Math.max(1, _pmQty + d);
  const el = document.getElementById('pmQty');
  if (el) el.textContent = _pmQty;
}
function addToCartQty(id) {
  for (let i = 0; i < _pmQty; i++) addToCart(id, true);
  showToast(`🌿 Added ${_pmQty}× to cart!`);
  _pmQty = 1;
  closeProductModal();
}
function closeProductModal() {
  document.getElementById('productModal').classList.remove('open');
  _pmQty = 1;
}
function pickStars(e) {
  const picker = document.getElementById('starPicker');
  const rect = picker.getBoundingClientRect();
  const s = Math.ceil(((e.clientX - rect.left) / picker.offsetWidth) * 5);
  window._pmStars = s;
  picker.textContent = '★'.repeat(s) + '☆'.repeat(5 - s);
}
function submitReview(id) {
  const text = document.getElementById('reviewText').value.trim();
  const stars = window._pmStars || 5;
  if (!text) { showToast('Please write a review!'); return; }
  if (!allReviews[id]) allReviews[id] = [];
  const name = currentUser
    ? currentUser.name.split(' ')[0] + ' ' + currentUser.name.split(' ')[1][0] + '.'
    : 'Guest';
  allReviews[id].unshift({ user:name, stars, text, date:'Today' });
  if (currentUser) { loyaltyPoints += 50; updateLoyalty(); }
  showToast('⭐ Review submitted! +50 Green Points');
  openProductModal(id);
}

/* ════════════════ CART ════════════════ */
function addToCart(id, silent=false) {
  const p = products.find(x => x.id === id);
  const ex = cart.find(c => c.id === id);
  if (ex) ex.qty++;
  else cart.push({...p, qty:1});
  updateCart();
  if (!silent) showToast(`🌿 ${p.name} added to cart!`);
  const ct = document.getElementById('cartCount');
  ct.classList.remove('bump'); void ct.offsetWidth; ct.classList.add('bump');
  if (currentUser) { loyaltyPoints += Math.round(p.price * 0.1); updateLoyalty(); }
}
function removeFromCart(id) { cart = cart.filter(c => c.id !== id); updateCart(); }
function updateQtyCart(id, d) {
  const it = cart.find(c => c.id === id);
  if (it) { it.qty += d; if (it.qty <= 0) cart = cart.filter(c => c.id !== id); }
  updateCart();
}
function updateCart() {
  const sub = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const disc = discountPct > 0 ? Math.round(sub * discountPct / 100) : 0;
  const total = sub - disc;
  const cnt = cart.reduce((s,i) => s + i.qty, 0);

  document.getElementById('cartCount').textContent = cnt;
  document.getElementById('cartSubtotal').textContent = '₹' + sub.toLocaleString();
  document.getElementById('cartTotal').textContent = '₹' + total.toLocaleString();

  const dRow = document.getElementById('discountRow');
  if (disc > 0) { dRow.style.display='flex'; document.getElementById('discountAmt').textContent='-₹'+disc; }
  else dRow.style.display='none';

  const itemsEl = document.getElementById('cartItems');
  itemsEl.querySelectorAll('.cart-item').forEach(e => e.remove());
  const empty = document.getElementById('cartEmpty');

  if (!cart.length) { empty.style.display='block'; return; }
  empty.style.display = 'none';
  cart.forEach(it => {
    const d = document.createElement('div');
    d.className = 'cart-item';
    d.innerHTML = `
      <div class="cart-item-img ${it.bg}">${it.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${it.name}</div>
        <div class="cart-item-price">₹${(it.price * it.qty).toLocaleString()}</div>
        <div class="cart-qty">
          <button class="qty-btn2" onclick="updateQtyCart(${it.id},-1)">−</button>
          <span class="qty-num2">${it.qty}</span>
          <button class="qty-btn2" onclick="updateQtyCart(${it.id},1)">+</button>
        </div>
      </div>
      <button class="remove-item" onclick="removeFromCart(${it.id})">🗑</button>`;
    itemsEl.insertBefore(d, empty);
  });
}
function toggleCart() {
  document.getElementById('cartOverlay').classList.toggle('open');
  document.getElementById('cartSidebar').classList.toggle('open');
}
function applyCoupon() {
  const code = document.getElementById('couponInput').value.trim().toUpperCase();
  const codes = { CHAMBAL20:20, GREEN10:10, PLANT15:15 };
  if (codes[code]) {
    discountPct = codes[code];
    const el = document.getElementById('discountApplied');
    el.classList.add('show');
    el.textContent = `🎉 ${code}: ${discountPct}% off applied!`;
    showToast(`✅ Coupon applied! ${discountPct}% discount`);
    updateCart();
  } else {
    showToast('❌ Invalid coupon code');
  }
}
function openCheckout() {
  if (!cart.length) { showToast('Cart is empty!'); return; }
  toggleCart();
  const itemsEl = document.getElementById('checkoutItems');
  itemsEl.innerHTML = cart.map(it => `
    <div class="checkout-order-item">
      <div class="checkout-order-img ${it.bg}">${it.emoji}</div>
      <div style="flex:1">
        <div style="font-weight:600;font-size:.84rem">${it.name}</div>
        <div style="font-size:.76rem;color:#aaa">Qty: ${it.qty}</div>
      </div>
      <div style="font-weight:600;font-size:.84rem">₹${(it.price*it.qty).toLocaleString()}</div>
    </div>`).join('');
  const sub = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const disc = discountPct > 0 ? Math.round(sub * discountPct / 100) : 0;
  const del = sub >= 999 ? 0 : 99;
  document.getElementById('checkoutTotals').innerHTML = `
    <div class="subtotal-row"><span>Subtotal</span><span>₹${sub.toLocaleString()}</span></div>
    ${disc>0?`<div class="subtotal-row" style="color:var(--green-fresh)"><span>Discount</span><span>-₹${disc}</span></div>`:''}
    <div class="subtotal-row"><span>Delivery</span><span>${del===0?'<span style="color:var(--green-fresh)">Free</span>':'₹'+del}</span></div>
    <div class="subtotal-row total"><span>Total</span><span>₹${(sub-disc+del).toLocaleString()}</span></div>`;
  document.getElementById('checkoutModal').classList.add('open');
}
function placeOrder() {
  if (currentUser) { loyaltyPoints += Math.round(cart.reduce((s,i)=>s+i.price*i.qty,0)*0.05); updateLoyalty(); }
  cart = []; discountPct = 0;
  document.getElementById('checkoutModal').classList.remove('open');
  updateCart();
  showToast('🎉 Order placed! You earned bonus Green Points!');
}

/* ════════════════ AUTH ════════════════ */
function switchAuthTab(tab, el) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('loginForm').style.display  = tab==='login'  ? 'block' : 'none';
  document.getElementById('signupForm').style.display = tab==='signup' ? 'block' : 'none';
}
function doLogin() {
  const email = document.getElementById('loginEmail').value;
  if (!email) { showToast('Please enter email'); return; }
  currentUser = { name:'Arjun Sharma', email, points:200 };
  loyaltyPoints = 200; finishAuth();
}
function doSignup() {
  const first = document.getElementById('signFirst').value || 'Plant';
  const last  = document.getElementById('signLast').value  || 'Lover';
  const email = document.getElementById('signEmail').value;
  if (!email) { showToast('Please enter email'); return; }
  currentUser = { name:first+' '+last, email, points:200 };
  loyaltyPoints = 200; finishAuth();
}
function doSocialLogin(provider) {
  currentUser = { name:'Arjun Sharma', email:'arjun@gmail.com', points:150 };
  loyaltyPoints = 150;
  showToast(`✅ Logged in with ${provider}!`);
  finishAuth();
}
function finishAuth() {
  const btn = document.getElementById('authNavBtn');
  btn.textContent = '👤 ' + currentUser.name.split(' ')[0];
  btn.classList.add('user-logged');
  btn.onclick = () => showToast('Logged in as ' + currentUser.name);
  document.getElementById('loyaltyBanner').style.display = 'block';
  document.getElementById('navPoints').style.display = 'flex';
  updateLoyalty();
  showToast('🌿 Welcome! +200 Green Points earned');
  showView('home');
}
function updateLoyalty() {
  document.getElementById('loyPoints').textContent = loyaltyPoints + ' pts';
  document.getElementById('navPointsVal').textContent = loyaltyPoints;
  const pct = Math.min(loyaltyPoints / 1000 * 100, 100);
  document.getElementById('loyFill').style.width = pct + '%';
  document.getElementById('loyPct').textContent = loyaltyPoints + '/1000';
}
function redeemPoints() {
  if (loyaltyPoints < 100) { showToast('Need at least 100 points to redeem'); return; }
  const disc = Math.floor(loyaltyPoints / 100) * 5;
  discountPct = disc; loyaltyPoints = 0; updateLoyalty();
  showToast(`🎁 ${disc}% discount applied using your points!`);
  updateCart();
}
function scrollToLoyalty() {
  showView('home');
  setTimeout(() => document.getElementById('loyaltyBanner').scrollIntoView({behavior:'smooth'}), 100);
}

/* ════════════════ QUIZ ════════════════ */
function startQuiz() { quizStep = 0; quizAnswers = []; renderQuiz(); }
function renderQuiz() {
  const pct = Math.round(quizStep / quizQuestions.length * 100);
  document.getElementById('quizProgress').style.width = pct + '%';
  const c = document.getElementById('quizContent');
  if (quizStep >= quizQuestions.length) { showQuizResult(c); return; }
  const q = quizQuestions[quizStep];
  c.innerHTML = `
    <div class="quiz-step-label">Question ${quizStep+1} of ${quizQuestions.length}</div>
    <div class="quiz-question">${q.q}</div>
    <div class="quiz-options">
      ${q.opts.map((o,i) => `
        <div class="quiz-option ${quizAnswers[quizStep]===i?'selected':''}" onclick="selectQuizOption(${i})">
          <span class="quiz-option-emoji">${o.e}</span>
          <div class="quiz-option-text">${o.t}</div>
          <div class="quiz-option-sub">${o.sub}</div>
        </div>`).join('')}
    </div>
    <div class="quiz-nav">
      <button class="quiz-back" onclick="quizBack()" ${quizStep===0?'style="visibility:hidden"':''}>← Back</button>
      <button class="quiz-next" onclick="quizNext()" ${quizAnswers[quizStep]===undefined?'disabled style="opacity:.5;cursor:not-allowed"':''}>Next →</button>
    </div>`;
}
function selectQuizOption(i) { quizAnswers[quizStep] = i; renderQuiz(); }
function quizNext() { if (quizAnswers[quizStep] !== undefined) { quizStep++; renderQuiz(); } }
function quizBack() { if (quizStep > 0) { quizStep--; renderQuiz(); } }
function showQuizResult(c) {
  document.getElementById('quizProgress').style.width = '100%';
  const res = quizResults[quizAnswers[0] % quizResults.length];
  const recProds = res.recs.map(id => products.find(p => p.id===id)).filter(Boolean);
  c.innerHTML = `
    <div class="quiz-result">
      <span class="quiz-result-emoji">${res.emoji}</span>
      <h2>${res.title}</h2>
      <p>${res.desc}</p>
      <div style="font-size:.78rem;font-weight:600;color:var(--green-fresh);text-transform:uppercase;letter-spacing:1px;margin-bottom:.8rem">Your Perfect Plants</div>
      <div class="quiz-recs">
        ${recProds.map(p => `
          <div class="quiz-rec-card" onclick="showView('home');setTimeout(()=>openProductModal(${p.id}),200)">
            <div class="quiz-rec-emoji">${p.emoji}</div>
            <div class="quiz-rec-name">${p.name}</div>
            <div class="quiz-rec-price">₹${p.price}</div>
          </div>`).join('')}
      </div>
      <button class="btn-primary" style="width:100%;justify-content:center;margin-bottom:.6rem" onclick="scrollToShop()">Shop Your Picks 🌿</button>
      <button style="background:none;border:none;color:var(--green-fresh);cursor:pointer;font-size:.84rem" onclick="startQuiz()">↺ Retake Quiz</button>
    </div>`;
  if (currentUser) { loyaltyPoints += 25; updateLoyalty(); showToast('⭐ +25 pts for completing the quiz!'); }
}

/* ════════════════ WISHLIST ════════════════ */
function toggleWishlist(id) {
  if (wishlist.has(id)) { wishlist.delete(id); showToast('Removed from wishlist'); }
  else                  { wishlist.add(id);    showToast('❤️ Added to wishlist!'); }
  renderProducts();
}

/* ════════════════ BOOKING ════════════════ */
function submitBooking() { document.getElementById('bookingConfirm').classList.add('open'); }
function scrollToShop() {
  showView('home');
  setTimeout(() => document.getElementById('shopSection').scrollIntoView({behavior:'smooth'}), 100);
}
function scrollToBooking() {
  showView('home');
  setTimeout(() => document.getElementById('bookingSection').scrollIntoView({behavior:'smooth'}), 100);
}

/* ════════════════ ADMIN ════════════════ */
function switchAdminPanel(name, el) {
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.admin-nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('panel-'+name).classList.add('active');
  el.classList.add('active');
}
function renderAdminProducts() {
  const tbody = document.getElementById('adminProductTable');
  if (!tbody) return;
  tbody.innerHTML = products.map(p => `<tr>
    <td class="tbl-emoji">${p.emoji}</td>
    <td><strong>${p.name}</strong></td>
    <td>${p.tag}</td>
    <td>₹${p.price}</td>
    <td><span class="tbl-badge ${p.stock==='in'?'tbl-in-stock':p.stock==='low'?'tbl-low-stock':'tbl-out'}">${p.stock==='in'?'In Stock':p.stock==='low'?'Low Stock':'Out'}</span></td>
    <td>★ ${p.rating}</td>
    <td><div class="tbl-action">
      <button class="tbl-edit" onclick="openEditProduct(${p.id})">✏️ Edit</button>
      <button class="tbl-del"  onclick="deleteProduct(${p.id})">🗑 Del</button>
    </div></td>
  </tr>`).join('');
  const countEl = document.getElementById('adminProductCount');
  if (countEl) countEl.textContent = products.length;
}
function openEditProduct(id) {
  const p = products.find(x => x.id===id);
  editingProductId = id;
  document.getElementById('editModalTitle').textContent = 'Edit: ' + p.name;
  document.getElementById('epName').value = p.name;
  document.getElementById('epPrice').value = p.price;
  document.getElementById('epOldPrice').value = p.oldPrice || '';
  document.getElementById('epCategory').value = p.category;
  document.getElementById('epStock').value = p.stock;
  document.getElementById('epDesc').value = p.desc;
  document.getElementById('editProductModal').classList.add('open');
}
function openAddProduct() {
  editingProductId = null;
  document.getElementById('editModalTitle').textContent = 'Add New Product';
  ['epName','epPrice','epOldPrice','epDesc'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('editProductModal').classList.add('open');
}
function saveProduct() {
  const name  = document.getElementById('epName').value;
  const price = parseInt(document.getElementById('epPrice').value);
  const oldP  = parseInt(document.getElementById('epOldPrice').value) || null;
  const cat   = document.getElementById('epCategory').value;
  const stock = document.getElementById('epStock').value;
  const desc  = document.getElementById('epDesc').value;
  if (!name || !price) { showToast('Please fill required fields'); return; }
  if (editingProductId) {
    const p = products.find(x => x.id===editingProductId);
    Object.assign(p, { name, price, oldPrice:oldP, category:cat, stock, desc, tag:cat.charAt(0).toUpperCase()+cat.slice(1) });
  } else {
    const emojis = ['🌿','🌱','🌸','🌺','🌻','🍃','🌴','🌵'];
    const bgs    = ['p1','p2','p3','p4','p5','p6','p7','p8'];
    const newId  = Math.max(...products.map(p => p.id)) + 1;
    products.push({ id:newId, name, price, oldPrice:oldP, category:cat, stock, desc,
      tag:cat.charAt(0).toUpperCase()+cat.slice(1),
      emoji:emojis[newId%emojis.length], bg:bgs[newId%bgs.length],
      rating:4.5, reviews:0, badge:null,
      care:'Moderate', light:'Indirect', water:'Weekly', size:'Medium' });
    allReviews[newId] = [];
  }
  document.getElementById('editProductModal').classList.remove('open');
  renderAdminProducts(); renderProducts();
  showToast(editingProductId ? '✅ Product updated!' : '✅ Product added!');
}
function deleteProduct(id) {
  if (confirm('Delete this product?')) {
    products = products.filter(p => p.id !== id);
    cart = cart.filter(c => c.id !== id);
    renderAdminProducts(); renderProducts(); updateCart();
    showToast('🗑 Product deleted');
  }
}
function renderAdminReviews() {
  const el = document.getElementById('adminReviewsTable');
  if (!el) return;
  let rows = '';
  products.forEach(p => {
    (allReviews[p.id]||[]).forEach(r => {
      rows += `<tr>
        <td>${p.emoji} ${p.name}</td>
        <td>${r.user}</td>
        <td>${'★'.repeat(r.stars)}</td>
        <td style="max-width:200px">${r.text}</td>
        <td>${r.date}</td>
      </tr>`;
    });
  });
  el.innerHTML = `<table><thead><tr><th>Product</th><th>Customer</th><th>Stars</th><th>Review</th><th>Date</th></tr></thead><tbody>${rows}</tbody></table>`
    || '<p style="padding:1rem;color:#aaa">No reviews yet.</p>';
}

/* ════════════════ TOAST ════════════════ */
function showToast(msg) {
  const t = document.getElementById('toast');
  t.innerHTML = msg; t.classList.add('show');
  clearTimeout(window._toast);
  window._toast = setTimeout(() => t.classList.remove('show'), 3000);
}

/* ════════════════ INIT ════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
});
