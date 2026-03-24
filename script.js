/* ============================================================
   ARCADIA ADMIN — script.js
   Pages: index.html | adminproducts.html
          admininventory.html | adminorders.html
   ============================================================ */

const PAGE =
  location.pathname.includes('adminproducts')  ? 'products'  :
  location.pathname.includes('admininventory') ? 'inventory' :
  location.pathname.includes('adminorders')    ? 'orders'    : 'dashboard';


/* ─────────────────────────────────────────
   SHARED PRODUCT DATA
───────────────────────────────────────── */
const sharedProducts = [
  {id:1,  name:'Catan Base Game',                      cat:'Board Games',   price:44.99,  oldPrice:54.99, stock:15, rating:4.8, reviews:234, badge:'Best Seller', emoji:'🎲'},
  {id:2,  name:'Pokémon Scarlet & Violet Booster Box',  cat:'Trading Cards', price:129.99, oldPrice:null,  stock:8,  rating:4.9, reviews:512, badge:'Best Seller', emoji:'🃏'},
  {id:3,  name:'LEGO Creator 3-in-1 Treehouse',         cat:'LEGO Sets',     price:89.99,  oldPrice:null,  stock:13, rating:4.7, reviews:189, badge:'New',         emoji:'🧱'},
  {id:4,  name:'Funko Pop! Luffy (One Piece)',           cat:'Collectibles',  price:14.99,  oldPrice:null,  stock:22, rating:4.6, reviews:88,  badge:'Best Seller', emoji:'🧸'},
  {id:5,  name:'Ravensburger 1000pc Cottage Puzzle',     cat:'Puzzles',       price:22.99,  oldPrice:null,  stock:30, rating:4.5, reviews:73,  badge:'',            emoji:'🧩'},
  {id:6,  name:'Winsor & Newton Watercolor Set',         cat:'Art Supplies',  price:34.99,  oldPrice:44.99, stock:18, rating:4.8, reviews:156, badge:'',            emoji:'🎨'},
  {id:7,  name:'Warhammer 40K Space Marines',            cat:'Figurines',     price:49.99,  oldPrice:null,  stock:9,  rating:4.7, reviews:88,  badge:'New',         emoji:'⚔️'},
  {id:8,  name:'Ticket to Ride Europe',                  cat:'Board Games',   price:49.99,  oldPrice:null,  stock:20, rating:4.9, reviews:301, badge:'Best Seller', emoji:'🚂'},
  {id:9,  name:'Magic: The Gathering Commander Deck',    cat:'Trading Cards', price:44.99,  oldPrice:null,  stock:5,  rating:4.6, reviews:143, badge:'New',         emoji:'✨'},
  {id:10, name:'LEGO Technic Bugatti Chiron',            cat:'LEGO Sets',     price:349.99, oldPrice:null,  stock:3,  rating:4.9, reviews:428, badge:'Best Seller', emoji:'🚗'},
  {id:11, name:'Funko Pop! Spider-Man (No Way Home)',    cat:'Collectibles',  price:16.99,  oldPrice:null,  stock:14, rating:4.8, reviews:217, badge:'',            emoji:'🕷️'},
  {id:12, name:'500pc Fairy Garden Puzzle',              cat:'Puzzles',       price:17.99,  oldPrice:null,  stock:25, rating:4.4, reviews:52,  badge:'',            emoji:'🌸'},
];


/* ─────────────────────────────────────────
   PRODUCTS PAGE
───────────────────────────────────────── */
if (PAGE === 'products') {
  let products   = sharedProducts.map(p => ({...p}));
  let editingId  = null;
  let currentCat = 'All';

  function stockClass(s) { return s <= 3 ? 'stock-crit' : s <= 9 ? 'stock-low' : 'stock-ok'; }
  function badgeClass(b) {
    if (b === 'Best Seller') return 'badge-bestseller';
    if (b === 'New')         return 'badge-new';
    if (b === 'Sale')        return 'badge-sale';
    return '';
  }

  function renderProducts() {
    const q    = document.getElementById('searchInput').value.toLowerCase();
    const list = products.filter(p => {
      const matchCat = currentCat === 'All' || p.cat === currentCat;
      const matchQ   = p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
    document.getElementById('productCount').textContent = list.length + ' total products';
    document.getElementById('productList').innerHTML = list.map(p => `
      <div class="prod-table-row">
        <div class="prod-cell">
          <div class="prod-thumb">${p.emoji}</div>
          <div>
            <div class="prod-name">${p.name}</div>
            ${p.badge ? `<span class="prod-badge ${badgeClass(p.badge)}">${p.badge}</span>` : ''}
          </div>
        </div>
        <div class="cat-text">${p.cat}</div>
        <div>
          <div class="price-text">$${p.price.toFixed(2)}</div>
          ${p.oldPrice ? `<span class="price-old">$${p.oldPrice.toFixed(2)}</span>` : ''}
        </div>
        <div><span class="stock-pill ${stockClass(p.stock)}">${p.stock} units</span></div>
        <div class="rating-cell">
          <i class="bi bi-star-fill"></i> ${p.rating}
          <span class="rating-count">(${p.reviews})</span>
        </div>
        <div class="actions-cell">
          <button class="action-btn btn-view" title="View"><i class="bi bi-eye"></i></button>
          <button class="action-btn btn-edit" title="Edit" onclick="openEditModal(${p.id})"><i class="bi bi-pencil"></i></button>
          <button class="action-btn btn-del"  title="Delete" onclick="deleteProduct(${p.id})"><i class="bi bi-trash"></i></button>
        </div>
      </div>
    `).join('');
  }

  window.filterCat = function (btn, cat) {
    currentCat = cat;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProducts();
  };

  window.filterProducts = function () { renderProducts(); };

  window.openAddModal = function () {
    editingId = null;
    document.getElementById('modalTitle').textContent = 'Add New Product';
    ['fName','fPrice','fStock','fRating','fReviews','fEmoji'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('fBadge').value = '';
    document.getElementById('modalOverlay').classList.add('show');
  };

  window.openEditModal = function (id) {
    const p = products.find(x => x.id === id);
    editingId = id;
    document.getElementById('modalTitle').textContent = 'Edit Product';
    document.getElementById('fName').value    = p.name;
    document.getElementById('fCat').value     = p.cat;
    document.getElementById('fBadge').value   = p.badge || '';
    document.getElementById('fPrice').value   = p.price;
    document.getElementById('fStock').value   = p.stock;
    document.getElementById('fRating').value  = p.rating;
    document.getElementById('fReviews').value = p.reviews;
    document.getElementById('fEmoji').value   = p.emoji;
    document.getElementById('modalOverlay').classList.add('show');
  };

  window.closeModal = function () {
    document.getElementById('modalOverlay').classList.remove('show');
  };

  window.saveProduct = function () {
    const name    = document.getElementById('fName').value.trim();
    const cat     = document.getElementById('fCat').value;
    const badge   = document.getElementById('fBadge').value;
    const price   = parseFloat(document.getElementById('fPrice').value) || 0;
    const stock   = parseInt(document.getElementById('fStock').value)   || 0;
    const rating  = parseFloat(document.getElementById('fRating').value) || 0;
    const reviews = parseInt(document.getElementById('fReviews').value)  || 0;
    const emoji   = document.getElementById('fEmoji').value || '📦';
    if (!name) return alert('Product name is required.');
    if (editingId) {
      Object.assign(products.find(x => x.id === editingId), {name,cat,badge,price,stock,rating,reviews,emoji});
    } else {
      products.push({id: Date.now(), name, cat, badge, price, oldPrice: null, stock, rating, reviews, emoji});
    }
    window.closeModal();
    renderProducts();
  };

  window.deleteProduct = function (id) {
    if (!confirm('Delete this product?')) return;
    products = products.filter(x => x.id !== id);
    renderProducts();
  };

  renderProducts();
}


/* ─────────────────────────────────────────
   INVENTORY PAGE
───────────────────────────────────────── */
if (PAGE === 'inventory') {
  const MAX_STOCK  = 30;
  let inventory    = sharedProducts.map(p => ({id: p.id, name: p.name, cat: p.cat, stock: p.stock, emoji: p.emoji}));
  let invFilter    = 'All Products';
  let invEditingId = null;

  function statusOf(s) {
    if (s === 0) return {label:'Out of Stock', cls:'s-outstock'};
    if (s <= 5)  return {label:'Critical',     cls:'s-critical'};
    if (s <= 10) return {label:'Low Stock',    cls:'s-lowstock'};
    return              {label:'In Stock',     cls:'s-instock'};
  }
  function fillClass(s) { return s <= 5 ? 'fill-red' : s <= 10 ? 'fill-yellow' : 'fill-green'; }

  function updateInvStats() {
    const total = inventory.reduce((a,p) => a + p.stock, 0);
    const low   = inventory.filter(p => p.stock > 0 && p.stock <= 10).length;
    const out   = inventory.filter(p => p.stock === 0).length;
    document.getElementById('invStats').innerHTML = `
      <div class="stat-card"><div class="stat-icon-wrap"><i class="bi bi-box-seam si-blue"></i></div><div class="stat-val">${inventory.length}</div><div class="stat-lbl">Total SKUs</div></div>
      <div class="stat-card"><div class="stat-icon-wrap"><i class="bi bi-graph-up si-green"></i></div><div class="stat-val">${total}</div><div class="stat-lbl">Total Stock</div></div>
      <div class="stat-card"><div class="stat-icon-wrap"><i class="bi bi-exclamation-triangle si-yellow"></i></div><div class="stat-val">${low}</div><div class="stat-lbl">Low Stock</div></div>
      <div class="stat-card"><div class="stat-icon-wrap"><i class="bi bi-x-circle si-red"></i></div><div class="stat-val">${out}</div><div class="stat-lbl">Out of Stock</div></div>
    `;
    document.getElementById('alertText').innerHTML =
      `You have ${out} out-of-stock item(s) and ${low} low-stock items that need attention. ` +
      `<a href="#" onclick="setInvFilter('Low Stock');return false;">View low stock</a> · ` +
      `<a href="#" onclick="setInvFilter('Out of Stock');return false;">View out of stock</a>`;
  }

  window.setInvFilter = function (f) {
    invFilter = f;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById('btn-' + f);
    if (btn) btn.classList.add('active');
    renderInventory();
  };

  window.renderInventory = function () {
    const q = document.getElementById('invSearch').value.toLowerCase();
    const list = inventory.filter(p => {
      const matchQ = p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q);
      const matchF =
        invFilter === 'All Products' ? true :
        invFilter === 'Low Stock'    ? (p.stock > 0 && p.stock <= 10) :
        invFilter === 'Out of Stock' ? p.stock === 0 : true;
      return matchQ && matchF;
    });
    updateInvStats();
    document.getElementById('invList').innerHTML = list.map(p => {
      const st  = statusOf(p.stock);
      const pct = Math.min(100, Math.round((p.stock / MAX_STOCK) * 100));
      return `
        <div class="inv-table-row">
          <div class="prod-cell">
            <div class="prod-thumb">${p.emoji}</div>
            <div class="prod-name">${p.name}</div>
          </div>
          <div class="cat-text">${p.cat}</div>
          <div class="units-text">${p.stock} units</div>
          <div class="progress-wrap">
            <div class="progress-bar-bg">
              <div class="progress-bar-fill ${fillClass(p.stock)}" style="width:${pct}%"></div>
            </div>
            <span class="pct-text">${pct}%</span>
          </div>
          <div><span class="status-badge ${st.cls}">${st.label}</span></div>
          <div>
            <button class="update-btn" onclick="openInvModal(${p.id})">
              <i class="bi bi-pencil"></i> Update
            </button>
          </div>
        </div>`;
    }).join('');
  };

  window.openInvModal = function (id) {
    invEditingId = id;
    const p = inventory.find(x => x.id === id);
    document.getElementById('invModalTitle').textContent = `Update Stock — ${p.name}`;
    document.getElementById('invFStock').value = p.stock;
    document.getElementById('invModalOverlay').classList.add('show');
  };

  window.closeInvModal = function () {
    document.getElementById('invModalOverlay').classList.remove('show');
  };

  window.saveStock = function () {
    const val = parseInt(document.getElementById('invFStock').value);
    if (isNaN(val) || val < 0) return alert('Enter a valid quantity.');
    inventory.find(x => x.id === invEditingId).stock = val;
    window.closeInvModal();
    renderInventory();
  };

  window.restockAll = function () {
    inventory.forEach(p => { if (p.stock <= 10) p.stock = MAX_STOCK; });
    renderInventory();
  };

  renderInventory();
}


/* ─────────────────────────────────────────
   ORDERS PAGE
───────────────────────────────────────── */
if (PAGE === 'orders') {
  const ORDER_STATUSES = ['Pending','Processing','Shipped','Delivered','Cancelled'];
  const STATUS_BADGE   = {Pending:'b-pending',Processing:'b-processing',Shipped:'b-shipped',Delivered:'b-delivered',Cancelled:'b-cancelled'};
  const STATUS_DD      = {Pending:'sd-pending',Processing:'sd-processing',Shipped:'sd-shipped',Delivered:'sd-delivered',Cancelled:'sd-cancelled'};

  let orders = [
    {id:'ORD-001', customer:'Alex Johnson',  email:'alex@example.com',   date:'2026-02-20', status:'Delivered',  total:134.97, items:[{name:'Catan Base Game',price:44.99},{name:'Ticket to Ride Europe',price:49.99},{name:'Ravensburger 1000pc Cottage Puzzle',price:39.99}]},
    {id:'ORD-002', customer:'Maria Santos',  email:'maria@example.com',  date:'2026-02-22', status:'Shipped',    total:174.98, items:[{name:'Pokémon Scarlet & Violet Booster Box',price:129.99},{name:'Funko Pop! Luffy (One Piece)',price:44.99}]},
    {id:'ORD-003', customer:'Sam Lee',       email:'sam@example.com',    date:'2026-02-23', status:'Processing', total:89.99,  items:[{name:'LEGO Creator 3-in-1 Treehouse',price:89.99}]},
    {id:'ORD-004', customer:'Jordan Kim',    email:'jordan@example.com', date:'2026-02-24', status:'Pending',    total:64.98,  items:[{name:'Winsor & Newton Watercolor Set',price:34.99},{name:'Funko Pop! Spider-Man (No Way Home)',price:29.99}]},
    {id:'ORD-005', customer:'Taylor Brown',  email:'taylor@example.com', date:'2026-02-25', status:'Pending',    total:394.98, items:[{name:'LEGO Technic Bugatti Chiron',price:349.99},{name:'Magic: The Gathering Commander Deck',price:44.99}]},
  ];

  function renderOrderStats() {
    const counts = {};
    ORDER_STATUSES.forEach(s => counts[s] = 0);
    orders.forEach(o => counts[o.status]++);
    document.getElementById('orderStatCards').innerHTML = ORDER_STATUSES.map(s => `
      <div class="stat-card" onclick="filterOrdersByStatus('${s}')">
        <div class="stat-num">${counts[s]}</div>
        <span class="stat-badge ${STATUS_BADGE[s]}">${s}</span>
      </div>
    `).join('');
  }

  window.filterOrdersByStatus = function (s) {
    document.getElementById('statusFilter').value = s;
    renderOrders();
  };

  window.changeStatus = function (orderId, newStatus) {
    orders.find(x => x.id === orderId).status = newStatus;
    renderOrderStats();
    renderOrders();
  };

  window.renderOrders = function () {
    const q  = document.getElementById('orderSearch').value.toLowerCase();
    const sf = document.getElementById('statusFilter').value;
    const filtered = orders.filter(o => {
      const matchQ  = o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.email.toLowerCase().includes(q);
      const matchSF = sf === 'All Statuses' || o.status === sf;
      return matchQ && matchSF;
    });
    document.getElementById('orderCount').textContent = orders.length + ' total orders';
    if (filtered.length === 0) {
      document.getElementById('orderList').innerHTML = `<div class="empty-state"><i class="bi bi-inbox"></i>No orders match your search.</div>`;
      return;
    }
    document.getElementById('orderList').innerHTML = filtered.map(o => `
      <div class="order-table-row">
        <div class="order-id-text">${o.id}</div>
        <div>
          <div class="cust-name">${o.customer}</div>
          <div class="cust-email">${o.email}</div>
        </div>
        <div class="date-text">${o.date}</div>
        <div class="items-text">${o.items.length} item(s)</div>
        <div class="total-text">$${o.total.toFixed(2)}</div>
        <div>
          <select class="status-dropdown ${STATUS_DD[o.status]}"
            onchange="changeStatus('${o.id}', this.value); this.className='status-dropdown sd-'+this.value.toLowerCase();">
            ${ORDER_STATUSES.map(s => `<option value="${s}" ${s===o.status?'selected':''}>${s}</option>`).join('')}
          </select>
        </div>
        <div>
          <button class="view-btn" onclick="openOrderModal('${o.id}')" title="View Details">
            <i class="bi bi-eye"></i>
          </button>
        </div>
      </div>
    `).join('');
  };

  window.openOrderModal = function (orderId) {
    const o = orders.find(x => x.id === orderId);
    document.getElementById('orderModalTitle').textContent = `Order Details — ${o.id}`;
    document.getElementById('orderModalBody').innerHTML = `
      <div class="section-label">Order Info</div>
      <div class="detail-row"><span class="detail-label">Order ID</span><span class="detail-val">${o.id}</span></div>
      <div class="detail-row"><span class="detail-label">Date</span><span class="detail-val">${o.date}</span></div>
      <div class="detail-row"><span class="detail-label">Status</span>
        <span class="detail-val"><span class="stat-badge ${STATUS_BADGE[o.status]}">${o.status}</span></span>
      </div>
      <div class="section-label">Customer</div>
      <div class="detail-row"><span class="detail-label">Name</span><span class="detail-val">${o.customer}</span></div>
      <div class="detail-row"><span class="detail-label">Email</span><span class="detail-val">${o.email}</span></div>
      <div class="section-label">Items Ordered</div>
      <div class="items-list">
        ${o.items.map(i => `
          <div class="item-row">
            <span class="item-name">${i.name}</span>
            <span class="item-price">$${i.price.toFixed(2)}</span>
          </div>`).join('')}
      </div>
      <div class="total-line"><span>Order Total</span><span>$${o.total.toFixed(2)}</span></div>
    `;
    document.getElementById('orderModalOverlay').classList.add('show');
  };

  window.closeOrderModal = function () {
    document.getElementById('orderModalOverlay').classList.remove('show');
  };

  document.getElementById('orderModalOverlay').addEventListener('click', function (e) {
    if (e.target === this) window.closeOrderModal();
  });

  renderOrderStats();
  renderOrders();
}
