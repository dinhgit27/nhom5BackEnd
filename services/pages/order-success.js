const renderOrderSuccessPage = () => {
    document.getElementById('main-content').innerHTML = `
        <div class="success-container">
            <div class="success-box">
                <div class="success-icon">
                    <i class="fas fa-check"></i>
                </div>
                <h2 class="success-title">Đặt Hàng Thành Công!</h2>
                <p class="success-message">
                    Mã đơn hàng: <span class="order-id">#${app.lastOrderId}</span>
                </p>
                <button class="continue-btn" onclick="continueOrdering()">Tiếp Tục Mua Hàng</button>
            </div>
        </div>
    `;
};

const continueOrdering = () => {
    app.cart = [];
    app.currentPage = 'order';
    renderPage();
};
