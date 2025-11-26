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
    grid.innerHTML = app.products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <i class="fas fa-box"></i>
            </div>
            <div class="product-body">
                <div class="product-name">${product.ProductName}</div>
                <div class="product-description">${product.Description}</div>
                <div class="product-footer">
                    <span class="product-price">${product.Price.toLocaleString('vi-VN')}đ</span>
                    <span class="stock-info">Còn: ${product.Stock}</span>
                </div>
                <button class="add-to-cart-btn ${product.Stock > 0 ? 'available' : 'unavailable'}" 
                    onclick="addToCart(${product.ProductId})" 
                    ${product.Stock === 0 ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart"></i>
                    ${product.Stock > 0 ? 'Thêm Vào Giỏ' : 'Hết Hàng'}
                </button>
            </div>
        </div>
    `).join('');
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

    const total = app.cart.reduce((sum, item) => sum + item.Price * item.quantity, 0);

    content.innerHTML = `
        <div class="cart-items">
            ${app.cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-header">
                        <div class="cart-item-name">${item.ProductName}</div>
                        <button class="remove-item-btn" onclick="removeFromCart(${item.ProductId})">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="quantity-control">
                        <button class="qty-btn" onclick="updateQuantity(${item.ProductId}, -1)">-</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.ProductId}, 1)">+</button>
                    </div>
                    <div class="cart-item-price">${(item.Price * item.quantity).toLocaleString('vi-VN')}đ</div>
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

const addToCart = (productId) => {
    const product = app.products.find(p => p.ProductId === productId);
    const existing = app.cart.find(p => p.ProductId === productId);

    if (existing) {
        existing.quantity += 1;
    } else {
        app.cart.push({ ...product, quantity: 1 });
    }

    renderCart();
};

const updateQuantity = (productId, delta) => {
    const item = app.cart.find(p => p.ProductId === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            renderCart();
        }
    }
};

const removeFromCart = (productId) => {
    app.cart = app.cart.filter(p => p.ProductId !== productId);
    renderCart();
};

const createOrder = () => {
    if (app.cart.length === 0) {
        alert('Vui lòng chọn ít nhất một sản phẩm!');
        return;
    }

    for (let item of app.cart) {
        if (item.quantity <= 0) {
            alert('Số lượng sản phẩm phải > 0');
            return;
        }
    }

    const total = app.cart.reduce((sum, item) => sum + item.Price * item.quantity, 0);
    const newOrderId = app.orders.length > 0 ? Math.max(...app.orders.map(o => o.OrderId)) + 1 : 1;

    const newOrder = {
        OrderId: newOrderId,
        CustomerId: app.currentUser.customerId || 1,
        OrderDate: new Date().toISOString().split('T')[0],
        Status: 'Đang xử lý',
        TotalAmount: total,
        OrderDetails: app.cart.map(item => ({
            ProductId: item.ProductId,
            ProductName: item.ProductName,
            Quantity: item.quantity,
            UnitPrice: item.Price
        }))
    };

    app.orders.push(newOrder);
    app.lastOrderId = newOrderId;
    app.currentPage = 'order-success';
    renderPage();
};