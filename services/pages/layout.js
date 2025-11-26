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
                        ` : ''}
                        
                        <button class="nav-btn ${app.currentPage === 'order' ? 'active' : 'inactive'}" id="nav-order">
                            <i class="fas fa-shopping-bag"></i> Đặt Hàng
                        </button>

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
    const navOrder = document.getElementById('nav-order');
    const logoutBtn = document.getElementById('logout-btn');

    if (navProducts) {
        navProducts.addEventListener('click', () => showPage('products'));
    }

    navOrder.addEventListener('click', () => showPage('order'));

    logoutBtn.addEventListener('click', () => {
        app.currentUser = null;
        app.token = null;
        app.currentPage = 'login';
        app.cart = [];
        renderPage();
    });
};