// --- pages/layout.js ---

const renderLayout = () => {
    return `
        <div class="navbar">
            <div class="navbar-container">
                <div class="navbar-title">🛒 Hệ Thống Bán Hàng</div>
                
                <div class="user-info">
                    <div class="user-details">
                        <i class="fas fa-user"></i>
                        <div class="user-details-text">
                            <p>${app.currentUser?.name}</p>
                            <p>${app.currentUser?.role}</p>
                        </div>
                    </div>

                    <div class="navbar-buttons">
                        ${app.currentUser?.role === 'Admin' ? `
                            <button class="nav-btn ${app.currentPage === 'products' ? 'active' : 'inactive'}" id="nav-products">
                                <i class="fas fa-box"></i> Quản Lý SP
                            </button>
                            <button class="nav-btn ${app.currentPage === 'admin-orders' ? 'active' : 'inactive'}" id="nav-admin-orders">
                                <i class="fas fa-list-alt"></i> Quản Lý Đơn
                            </button>
                        ` : `
                            <button class="nav-btn ${app.currentPage === 'order' ? 'active' : 'inactive'}" id="nav-order">
                                <i class="fas fa-shopping-bag"></i> Đặt Hàng
                            </button>
                            <button class="nav-btn ${app.currentPage === 'my-history' ? 'active' : 'inactive'}" id="nav-history">
                                <i class="fas fa-history"></i> Lịch Sử
                            </button>
                        `}
                        
                        <button class="logout-btn" id="logout-btn">
                            <i class="fas fa-sign-out-alt"></i> Đăng Xuất
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="main-container" id="main-content"></div>
    `;
};

const attachNavbarEvents = () => {
    const navProducts = document.getElementById('nav-products');
    const navAdminOrders = document.getElementById('nav-admin-orders'); // Nút mới
    const navOrder = document.getElementById('nav-order');
    const navHistory = document.getElementById('nav-history');
    const logoutBtn = document.getElementById('logout-btn');

    // Sự kiện cho Admin
    if (navProducts) navProducts.addEventListener('click', () => showPage('products'));
    if (navAdminOrders) navAdminOrders.addEventListener('click', () => showPage('admin-orders'));

    // Sự kiện cho User
    if (navOrder) navOrder.addEventListener('click', () => showPage('order'));
    if (navHistory) navHistory.addEventListener('click', () => showPage('my-history')); // (Tuỳ chọn)

    logoutBtn.addEventListener('click', () => {
        app.currentUser = null;
        app.token = null;
        app.currentPage = 'login';
        app.cart = [];
        renderPage();
    });
};