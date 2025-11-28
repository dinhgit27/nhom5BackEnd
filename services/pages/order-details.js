const renderOrderDetailsPage = () => {

    const order = app.orders.find(o => o.id === app.lastOrderId);

    if (!order) {
        document.getElementById('main-content').innerHTML = '<p>Không tìm thấy đơn hàng!</p>';
        return;
    }

    const total = order.orderDetails.reduce((sum, item) =>
        sum + item.quantity * item.unitPrice, 0
    );

    document.getElementById('main-content').innerHTML = `
        <div class="order-details-container">
            <h2>Chi Tiết Đơn Hàng #${order.id}</h2>

            <div class="order-info-grid">
                <div class="info-item">
                    <div class="info-label">Ngày Đặt</div>
                    <div class="info-value">${new Date(order.createdAt).toLocaleString('vi-VN')}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Trạng Thái</div>
                    <div class="info-value status">${order.status}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Tổng Tiền</div>
                    <div class="info-value">${total.toLocaleString('vi-VN')}đ</div>
                </div>
            </div>

            <div class="order-items">
                <h3>Sản Phẩm</h3>
                ${order.orderDetails.map(item => `
                    <div class="item-row">
                        <div>${item.productName || 'Sản phẩm'}</div>
                        <div>${item.quantity}</div>
                        <div>${item.unitPrice.toLocaleString('vi-VN')}đ</div>
                        <div>${(item.quantity * item.unitPrice).toLocaleString('vi-VN')}đ</div>
                    </div>
                `).join('')}
            </div>

            <div class="order-summary">
                Tổng cộng: ${total.toLocaleString('vi-VN')}đ
            </div>
        </div>
    `;
};