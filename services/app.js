// --- app.js
// ==================== Application State ====================
const app = {
    currentPage: 'login',
    currentUser: null,
    token: null,
    products: [],
    customers: [],
    orders: [],
    cart: [],
    lastOrderId: null,
    editingProduct: null,
    // THÊM BASE URL CHO API CỦA BẠN (Kiểm tra file launchSettings.json)
    apiBase: 'https://localhost:7030/api'//'http://api.nhom5.com/api' // Đảm bảo đúng cổng!
};

// ==================== Utility Functions (DECODE JWT) ====================
const decodeJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        // Giải mã Base64 thành chuỗi JSON
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Failed to decode JWT:", e);
        return null;
    }
};

// ==================== Page Rendering (Giữ nguyên) ====================
const showPage = (page) => {
    app.currentPage = page;
    renderPage();
};

const renderPage = () => {
    const appElement = document.getElementById('app');
    
    if (!app.token) {
        appElement.innerHTML = renderLoginPage();
        attachLoginEvents();
    } else {
        appElement.innerHTML = renderLayout();
        attachNavbarEvents();
        
        // --- ROUTING ---
        if (app.currentPage === 'products') {
            fetchAdminProductsAndRender();
        } else if (app.currentPage === 'order') {
            fetchProductsForOrderAndRender();
        } else if (app.currentPage === 'order-success') {
            renderOrderSuccessPage();
        } else if (app.currentPage === 'order-details') {
            renderOrderDetailsPage();
        } 
        // --- THÊM 2 DÒNG NÀY ---
        else if (app.currentPage === 'my-history') {
            renderOrderHistoryPage(); // Hàm này sẽ viết ở orders.js
        }
        else if (app.currentPage === 'admin-orders') {
            renderAdminOrdersPage();  // Hàm này sẽ viết ở orders.js
        }
    }
};

// ==================== API Fetching Functions ====================

// HÀM FETCH CHO DỮ LIỆU CÔNG KHAI
async function fetchInitialData() {
    try {
        const [prodRes, custRes, ordRes] = await Promise.all([
            fetch(app.apiBase + '/public/products'),
            fetch(app.apiBase + '/public/customers'),
            fetch(app.apiBase + '/public/orders')
        ]);

        if (prodRes.ok) app.products = await prodRes.json();
        if (custRes.ok) app.customers = await custRes.json();
        if (ordRes.ok) app.orders = await ordRes.json();
    } catch (e) {
        console.warn('Failed to fetch initial data from API', e);
    }
}

// HÀM FETCH SẢN PHẨM RIÊNG CHO TRANG ĐẶT HÀNG (để phân biệt với admin fetch)
async function fetchProductsForOrderAndRender() {
    await fetchInitialData(); // Tạm thời dùng lại public API
    renderOrderCreationPage();
}

// HÀM FETCH SẢN PHẨM CÓ AUTH CHO TRANG ADMIN
async function fetchAdminProductsAndRender() {
    try {
        const response = await fetchWithAuth('/products');
        if (response.ok) {
            // Cập nhật app.products bằng dữ liệu Admin (có thể khác public)
            app.products = await response.json(); 
            renderProductManagementPage();
        } else {
            // Nếu không phải Admin, render trang Access Denied
            renderProductManagementPage(); 
        }
    } catch(e) {
        console.error("Lỗi khi fetch products Admin:", e);
        renderProductManagementPage(); 
    }
}

// HÀM TIỆN ÍCH CÓ GỬI JWT TOKEN
const fetchWithAuth = async (url, options = {}) => {
    const headers = {
        'Content-Type': 'application/json',
        // Gửi token nếu có
        ...(app.token && { 'Authorization': `Bearer ${app.token}` }), 
        ...(options.headers || {})
    };

    const response = await fetch(app.apiBase + url, {
        ...options,
        headers
    });
    
    // Xử lý Unauthorized/Forbid
    if (response.status === 401 || response.status === 403) {
        if(app.token) alert('Bạn không có quyền truy cập chức năng này.');
        app.currentUser = null;
        app.token = null;
        app.currentPage = 'login';
        renderPage();
    }

    return response;
};

// ==================== Initialize App ====================
window.addEventListener('DOMContentLoaded', async () => {
    await fetchInitialData(); // Load data ban đầu
    renderPage();
});