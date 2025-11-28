// --- pages/orders.js ---

// ================= 1. TRANG ĐẶT HÀNG (User) =================
const renderOrderCreationPage = () => {
    document.getElementById('main-content').innerHTML = `
        <div class="order-container">
            <div>
                <div class="products-section">
                    <h2>Danh Sách Sản Phẩm</h2>
                </div>
                <div class="products-grid" id="products-grid"></div>
            </div>

            <div class="cart-box">
                <div class="cart-header">
                    <i class="fas fa-shopping-cart"></i> Giỏ Hàng
                </div>
                <div id="cart-content"></div>
            </div>
        </div>
    `;

    renderProductsForOrder();
    renderCart();
};

const renderProductsForOrder = () => {
    // ... (Giữ nguyên code render sản phẩm cũ của bạn) ...
    // Để ngắn gọn tôi không paste lại đoạn logic render thẻ product-card
    // Bạn hãy giữ nguyên hàm này từ code cũ nhé.
    const grid = document.getElementById('products-grid');
    if (!app.products || app.products.length === 0) {
        grid.innerHTML = '<p>Chưa có sản phẩm nào.</p>';
        return;
    }
    grid.innerHTML = app.products.map(product => {
        const id = product.productId || product.id || product.ProductId;
        const name = product.productName || product.name || product.ProductName;
        const price = product.price || product.Price || 0;
        const desc = product.description || product.Description || '';
        const stock = product.stock || product.Stock || 0;

        return `
        <div class="product-card">
            <div class="product-image"><i class="fas fa-box"></i></div>
            <div class="product-body">
                <div class="product-name">${name}</div>
                <div class="product-description">${desc}</div>
                <div class="product-footer">
                    <span class="product-price">${price.toLocaleString('vi-VN')}đ</span>
                    <span class="stock-info">Còn: ${stock}</span>
                </div>
                <button class="add-to-cart-btn ${stock > 0 ? 'available' : 'unavailable'}" 
                    onclick="addToCart(${id})" ${stock === 0 ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart"></i> ${stock > 0 ? 'Thêm' : 'Hết'}
                </button>
            </div>
        </div>`;
    }).join('');
};

const renderCart = () => {
    // ... (Giữ nguyên code render giỏ hàng cũ của bạn) ...
    // Bạn hãy copy lại hàm renderCart từ code cũ vào đây.
    const content = document.getElementById('cart-content');
    if (app.cart.length === 0) {
        content.innerHTML = `<div class="cart-empty"><p>Giỏ hàng trống</p></div>`;
        return;
    }
    const total = app.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    content.innerHTML = `
        <div class="cart-items">
            ${app.cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-header">
                        <div class="cart-item-name">${item.name}</div>
                        <button class="remove-item-btn" onclick="removeFromCart(${item.id})">x</button>
                    </div>
                    <div class="quantity-control">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <div class="cart-item-price">${(item.price * item.quantity).toLocaleString('vi-VN')}đ</div>
                </div>
            `).join('')}
        </div>
        <div class="cart-total">
            <div class="total-row"><span class="total-label">Tổng:</span><span class="total-amount">${total.toLocaleString('vi-VN')}đ</span></div>
            <button class="checkout-btn" onclick="createOrder()">Đặt Hàng</button>
        </div>
    `;
};

// ================= 2. TRANG LỊCH SỬ ĐƠN HÀNG (User) =================
// Hàm này MỚI - để User xem đơn của mình
const renderOrderHistoryPage = async () => {
    try {
        // Gọi API lấy đơn hàng của user đang đăng nhập
        const response = await fetchWithAuth('/orders/my');
        
        if (!response.ok) {
            document.getElementById('main-content').innerHTML = '<h2>Lỗi tải lịch sử đơn hàng</h2>';
            return;
        }

        const orders = await response.json();

        document.getElementById('main-content').innerHTML = `
            <div class="products-header">
                <h2>🕒 Lịch Sử Đơn Hàng Của Bạn</h2>
            </div>
            <div class="products-table">
                <table>
                    <thead>
                        <tr>
                            <th>Mã Đơn</th>
                            <th>Ngày Đặt</th>
                            <th>Tổng Tiền</th>
                            <th>Trạng Thái</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orders.length === 0 ? '<tr><td colspan="5" class="text-center">Bạn chưa có đơn hàng nào.</td></tr>' : ''}
                        ${orders.map(o => `
                            <tr>
                                <td>#${o.id}</td>
                                <td>${new Date(o.createdAt).toLocaleString('vi-VN')}</td>
                                <td class="product-price">${o.total.toLocaleString('vi-VN')}đ</td>
                                <td><span class="stock-badge ${getStatusClass(o.status)}">${o.status}</span></td>
                                <td>
                                    <button class="edit-btn" onclick="viewOrderDetail(${o.id})">
                                        <i class="fas fa-eye"></i> Chi Tiết
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (e) {
        console.error(e);
        document.getElementById('main-content').innerHTML = `<p>Lỗi kết nối server: ${e.message}</p>`;
    }
};

// ================= 3. TRANG QUẢN LÝ ĐƠN HÀNG (Admin) =================
// Hàm này MỚI - để Admin xem TOÀN BỘ đơn hàng
const renderAdminOrdersPage = async () => {
    try {
        const response = await fetchWithAuth('/orders'); // Admin lấy tất cả
        
        if (!response.ok) {
            document.getElementById('main-content').innerHTML = '<h2>Access Denied</h2>';
            return;
        }

        const orders = await response.json();

        document.getElementById('main-content').innerHTML = `
            <div class="products-header">
                <h2>📦 Quản Lý Tất Cả Đơn Hàng (Admin)</h2>
            </div>
            <div class="products-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Khách Hàng (ID)</th>
                            <th>Ngày Đặt</th>
                            <th>Tổng Tiền</th>
                            <th>Trạng Thái</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orders.length === 0 ? '<tr><td colspan="6" class="text-center">Hệ thống chưa có đơn hàng nào.</td></tr>' : ''}
                        ${orders.map(o => `
                            <tr>
                                <td>#${o.id}</td>
                                <td>User ID: <strong>${o.customerId}</strong></td>
                                <td>${new Date(o.createdAt).toLocaleString('vi-VN')}</td>
                                <td class="product-price">${o.total.toLocaleString('vi-VN')}đ</td>
                                <td><span class="stock-badge ${getStatusClass(o.status)}">${o.status}</span></td>
                                <td>
                                    <button class="edit-btn" onclick="viewOrderDetail(${o.id})">
                                        <i class="fas fa-eye"></i> Xem
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } catch (e) {
        console.error(e);
    }
};

// --- Helper Functions ---

// Hàm helper để tô màu trạng thái
const getStatusClass = (status) => {
    if (status === 'New') return 'stock-medium'; // Màu vàng
    if (status === 'Completed') return 'stock-high'; // Màu xanh lá
    if (status === 'Cancelled') return 'stock-low'; // Màu đỏ
    return '';
};

// Hàm Xem Chi Tiết (Dùng chung cho cả Admin và User)
// Quan trọng: Gắn vào window để HTML gọi được
window.viewOrderDetail = async (orderId) => {
    // 1. Lưu ID đơn hàng muốn xem
    app.lastOrderId = orderId;

    // 2. Fetch dữ liệu chi tiết đơn hàng đó từ API (để đảm bảo có dữ liệu OrderDetails)
    //    Admin dùng API /orders, User dùng /orders/my (hoặc user có thể dùng /orders/{id} nếu backend hỗ trợ check owner)
    //    Cách đơn giản nhất: Lấy lại list orders hiện tại trong app (nếu đã fetch) hoặc fetch lại.
    
    // Ở đây ta dùng cách đơn giản: Chuyển trang và để trang OrderDetail tự lo việc hiển thị
    // Tuy nhiên, logic cũ của OrderDetail là lấy từ app.orders. 
    // Nên ta cần đảm bảo app.orders có chứa đơn hàng này.
    
    // Nếu đang ở trang Admin, app.orders có thể chưa được set (vì ta fetch cục bộ trong hàm render).
    // => Ta sẽ fetch lại data cho chắc chắn.
    
    try {
        // Tự động chọn API dựa trên Role
        const url = app.currentUser.role === 'Admin' ? '/orders' : '/orders/my';
        const res = await fetchWithAuth(url);
        if(res.ok) {
            app.orders = await res.json();
            app.currentPage = 'order-details';
            renderPage();
        }
    } catch (e) {
        alert("Không thể tải chi tiết đơn hàng");
    }
};

// Các hàm xử lý giỏ hàng (Giữ nguyên như cũ)
window.addToCart = (id) => { /* Code cũ... */ 
    // Logic thêm vào giỏ hàng giống code cũ của bạn
    const product = app.products.find(p => (p.productId || p.id) === id);
    if (!product) return;
    const existing = app.cart.find(p => p.id === id);
    if (existing) {
         if (existing.quantity < (product.stock || product.Stock)) existing.quantity++;
         else alert('Hết hàng trong kho');
    } else {
    // Sửa lại dòng lấy name và price để bao quát hết các trường hợp
    app.cart.push({ 
        id: id, 
        // Thêm product.productName vào đầu tiên
        name: product.productName || product.name || product.ProductName || "Sản phẩm", 
        price: product.price || product.Price || 0, 
        quantity: 1 
    });
}
    renderCart();
}; 

window.updateQuantity = (id, delta) => { /* Code cũ... */
    const item = app.cart.find(p => p.id === id);
    if(item) {
        item.quantity += delta;
        if(item.quantity <= 0) window.removeFromCart(id);
        else renderCart();
    }
};

window.removeFromCart = (id) => { /* Code cũ... */
    app.cart = app.cart.filter(p => p.id !== id);
    renderCart();
};

window.createOrder = async () => { /* Code cũ... */
    if (app.cart.length === 0) return alert('Giỏ hàng trống');
    const orderDto = {
        CustomerId: app.currentUser.customerId,
        Items: app.cart.map(item => ({ ProductId: item.id, Quantity: item.quantity, UnitPrice: item.price }))
    };
    const res = await fetchWithAuth('/orders', { method: 'POST', body: JSON.stringify(orderDto) });
    if(res.ok) {
        const data = await res.json();
        app.cart = [];
        app.lastOrderId = data.id;
        app.currentPage = 'order-success';
        fetchProductsForOrderAndRender(); // Update lại kho
        renderPage();
    } else {
        alert('Lỗi đặt hàng');
    }
};