// --- pages/orders.js ---

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
    const grid = document.getElementById('products-grid');
    
    if (!app.products || app.products.length === 0) {
        grid.innerHTML = '<p>Chưa có sản phẩm nào được bày bán.</p>';
        return;
    }

    grid.innerHTML = app.products.map(product => {
        // QUAN TRỌNG: API Public trả về chữ thường (camelCase)
        // Dùng toán tử || để dự phòng trường hợp API trả về kiểu khác
        const id = product.productId || product.id || product.ProductId;
        const name = product.productName || product.name || product.ProductName;
        const price = product.price || product.Price || 0;
        const desc = product.description || product.Description || '';
        const stock = product.stock || product.Stock || 0;

        return `
        <div class="product-card">
            <div class="product-image">
                <i class="fas fa-box"></i>
            </div>
            <div class="product-body">
                <div class="product-name">${name}</div>
                <div class="product-description">${desc}</div>
                <div class="product-footer">
                    <span class="product-price">${price.toLocaleString('vi-VN')}đ</span>
                    <span class="stock-info">Còn: ${stock}</span>
                </div>
                <button class="add-to-cart-btn ${stock > 0 ? 'available' : 'unavailable'}" 
                    onclick="addToCart(${id})" 
                    ${stock === 0 ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart"></i>
                    ${stock > 0 ? 'Thêm Vào Giỏ' : 'Hết Hàng'}
                </button>
            </div>
        </div>
    `}).join('');
};

const renderCart = () => {
    const content = document.getElementById('cart-content');

    if (app.cart.length === 0) {
        content.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <p>Giỏ hàng trống</p>
            </div>
        `;
        return;
    }

    const total = app.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    content.innerHTML = `
        <div class="cart-items">
            ${app.cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-header">
                        <div class="cart-item-name">${item.name}</div>
                        <button class="remove-item-btn" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-times"></i>
                        </button>
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
            <div class="total-row">
                <span class="total-label">Tổng Cộng:</span>
                <span class="total-amount">${total.toLocaleString('vi-VN')}đ</span>
            </div>
            <button class="checkout-btn" onclick="createOrder()">Đặt Hàng</button>
        </div>
    `;
};

// Hàm window.addToCart để HTML gọi được
window.addToCart = (productId) => {
    // Tìm sản phẩm trong danh sách app.products
    // Lưu ý so sánh linh hoạt ID
    const product = app.products.find(p => (p.productId || p.id || p.ProductId) === productId);
    
    if (!product) {
        console.error("Không tìm thấy sản phẩm ID:", productId);
        return;
    }

    // Chuẩn hóa dữ liệu sản phẩm để lưu vào giỏ
    const id = product.productId || product.id || product.ProductId;
    const existing = app.cart.find(p => p.id === id);

    if (existing) {
        // Kiểm tra tồn kho trước khi tăng
        const currentStock = product.stock || product.Stock;
        if (existing.quantity < currentStock) {
            existing.quantity += 1;
        } else {
            alert('Đã đạt giới hạn tồn kho!');
        }
    } else {
        app.cart.push({
            id: id,
            name: product.productName || product.name || product.ProductName,
            price: product.price || product.Price,
            quantity: 1
        });
    }

    renderCart();
};

window.updateQuantity = (productId, delta) => {
    const item = app.cart.find(p => p.id === productId);
    const product = app.products.find(p => (p.productId || p.id || p.ProductId) === productId);

    if (item) {
        const newQty = item.quantity + delta;
        const currentStock = product ? (product.stock || product.Stock) : 9999;

        if (newQty > currentStock) {
            alert('Không đủ hàng trong kho!');
            return;
        }

        item.quantity = newQty;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            renderCart();
        }
    }
};

window.removeFromCart = (productId) => {
    app.cart = app.cart.filter(p => p.id !== productId);
    renderCart();
};

window.createOrder = async () => {
    if (app.cart.length === 0) {
        alert('Vui lòng chọn ít nhất một sản phẩm!');
        return;
    }

    // Kiểm tra login
    if (!app.currentUser || !app.currentUser.customerId) {
        alert('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
        return;
    }

    // Tạo payload đúng chuẩn DTO Back-end
    const orderDto = {
        CustomerId: app.currentUser.customerId,
        Items: app.cart.map(item => ({
            ProductId: item.id,      // ID đã được chuẩn hóa khi thêm vào giỏ
            Quantity: item.quantity,
            UnitPrice: item.price
        }))
    };

    try {
        const response = await fetchWithAuth('/orders', {
            method: 'POST',
            body: JSON.stringify(orderDto)
        });

        if (response && response.ok) {
            const newOrder = await response.json();
            
            // Xóa giỏ hàng
            app.cart = [];
            app.lastOrderId = newOrder.id; // Lưu ID để hiển thị trang success
            
            // Fetch lại dữ liệu (để cập nhật tồn kho)
            await fetchProductsForOrderAndRender();

            app.currentPage = 'order-success';
            renderPage();
        } else {
            const errorText = response ? await response.text() : 'Lỗi kết nối';
            console.error("Lỗi đặt hàng:", errorText);
            alert(`Đặt hàng thất bại: ${errorText}`);
        }
    } catch (e) {
        console.error("Lỗi exception:", e);
        alert('Có lỗi xảy ra khi tạo đơn hàng.');
    }
    const renderAdminOrdersPage = async () => {
    // 1. Gọi API lấy danh sách đơn hàng
    try {
        const response = await fetchWithAuth('/orders'); // GET /api/orders
        if (!response.ok) {
            document.getElementById('main-content').innerHTML = '<h2>Không thể tải danh sách đơn hàng</h2>';
            return;
        }
        
        const orders = await response.json();

        // 2. Render giao diện bảng
        document.getElementById('main-content').innerHTML = `
            <div class="products-header">
                <h2>📦 Quản Lý Tất Cả Đơn Hàng</h2>
            </div>
            
            <div class="products-table">
                <table>
                    <thead>
                        <tr>
                            <th>Mã Đơn</th>
                            <th>Mã Khách (ID)</th>
                            <th>Ngày Đặt</th>
                            <th>Tổng Tiền</th>
                            <th>Trạng Thái</th>
                            <th>Chi Tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orders.length === 0 ? '<tr><td colspan="6">Chưa có đơn hàng nào</td></tr>' : ''}
                        ${orders.map(o => `
                            <tr>
                                <td>#${o.id || o.orderId || o.Id}</td>
                                <td><span class="stock-badge stock-medium">KH ID: ${o.customerId}</span></td>
                                <td>${new Date(o.orderDate || o.createdAt).toLocaleString('vi-VN')}</td>
                                <td class="product-price">${(o.totalAmount || o.total).toLocaleString('vi-VN')}đ</td>
                                <td><span style="color: green; font-weight: bold;">${o.status}</span></td>
                                <td>
                                    <button class="edit-btn" onclick="viewOrderDetail(${o.id || o.orderId || o.Id})">
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
        document.getElementById('main-content').innerHTML = `<h2>Lỗi kết nối: ${e.message}</h2>`;
    }
};

// Hàm xem chi tiết (dùng chung cho cả Admin và User)
// Bạn cần đảm bảo window.viewOrderDetail được gán
window.viewOrderDetail = (orderId) => {
    app.lastOrderId = orderId;
    
    // Vì trang Order Details cũ của bạn đang lấy dữ liệu từ app.orders (biến global)
    // Nên chúng ta cần fetch lại đơn hàng đó hoặc đảm bảo app.orders có dữ liệu
    // Ở đây ta chuyển trang, logic renderOrderDetailsPage cũ sẽ chạy
    // (Lưu ý: Bạn có thể cần sửa renderOrderDetailsPage để nó fetch API thay vì tìm trong app.orders nếu muốn hoàn hảo)
    
    // Cách nhanh nhất để nó chạy với code cũ:
    fetchWithAuth('/orders').then(res => res.json()).then(data => {
        app.orders = data; // Cập nhật biến global để trang chi tiết tìm thấy đơn
        app.currentPage = 'order-details';
        renderPage();
    });
};
};