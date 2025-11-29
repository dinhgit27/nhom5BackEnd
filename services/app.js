
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

    apiBase: 'http://api.nhom5.com/api'
};

const decodeJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Failed to decode JWT:", e);
        return null;
    }
};

const showPage = (page) => {
    app.currentPage = page;
    renderPage();
};

const renderPage = () => {
    const appElement = document.getElementById('app');
    
    if (!app.token) {
        if (app.currentPage === 'register') {
            appElement.innerHTML = renderRegisterPage();
            attachRegisterEvents();
        } else {
            appElement.innerHTML = renderLoginPage();
            attachLoginEvents();
        }
    } else {
        appElement.innerHTML = renderLayout();
        attachNavbarEvents();
        

        if (app.currentPage === 'products') {
            fetchAdminProductsAndRender();
        } else if (app.currentPage === 'order') {
            fetchProductsForOrderAndRender();
        } else if (app.currentPage === 'order-success') {
            renderOrderSuccessPage();
        } else if (app.currentPage === 'order-details') {
            renderOrderDetailsPage();
        } 

        else if (app.currentPage === 'my-history') {
            renderOrderHistoryPage();
        }
        else if (app.currentPage === 'admin-orders') {
            renderAdminOrdersPage();
        }
    }
};



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


async function fetchProductsForOrderAndRender() {
    await fetchInitialData(); 
    renderOrderCreationPage();
}


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


const fetchWithAuth = async (url, options = {}) => {
    const headers = {
        'Content-Type': 'application/json',

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


window.addEventListener('DOMContentLoaded', async () => {
    await fetchInitialData(); // Load data ban đầu
    renderPage();
});