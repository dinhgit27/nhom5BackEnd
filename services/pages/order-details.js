const renderOrderDetailsPage = () => {
    const order = app.orders.find(o => o.OrderId === app.lastOrderId);
    if (!order) return;

    const total = order.OrderDetails.reduce((sum, item) => sum + item.Quantity * item.UnitPrice, 0);

    document.getElementById('main-content').innerHTML = `
        <div class="order-details-container">
            <div class="order-details-header">
                <h2>Chi Tiết Đơn Hàng #${order.OrderId}</h2>
            </div>

            <div class="order-info-grid">
                <div class="info-item">
                    <div class="info-label">Mã Đơn Hàng</div>
                    <div class="info-value">#${order.OrderId}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Ngày Đặt Hàng</div>
                    <div class="info-value">${order.OrderDate}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Trạng Thái</div>
                    <div class="info-value status">${order.Status}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Tổng Tiền</div>
                    <div class="info-value">${total.toLocaleString('vi-VN')}đ</div>
                </div>
            </div>

            <div class="order-items">
                <h3>Sản Phẩm Đặt Hàng</h3>
                <div class="item-row header">
                    <div>Tên Sản Phẩm</div>
                    <div>Số Lượng</div>
                    <div>Đơn Giá</div>
                    <div>Thành Tiền</div>
                </div>
                ${order.OrderDetails.map(item => `
                    <div class="item-row">
                        <div class="item-name">${item.ProductName}</div>
                        <div class="item-quantity">${item.Quantity}</div>
                        <div class="item-unit-price">${item.UnitPrice.toLocaleString('vi-VN')}đ</div>
                        <div class="item-total">${(item.Quantity * item.UnitPrice).toLocaleString('vi-VN')}đ</div>
                    </div>
                `).join('')}
            </div>

            <div class="order-summary">
                <div class="summary-row">
                    <span class="summary-label">Tổng Cộng:</span>
                    <span class="summary-value total">${total.toLocaleString('vi-VN')}đ</span>
                </div>
            </div>

            <button class="back-btn" onclick="goBackToOrder()">Quay Lại Đặt Hàng</button>
        </div>
    `;
};

const goBackToOrder = () => {
    app.currentPage = 'order';
    app.cart = [];
    renderPage();
};
