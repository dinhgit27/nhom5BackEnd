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
};

// ==================== Page Rendering ====================
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
        
        if (app.currentPage === 'products') {
            renderProductManagementPage();
        } else if (app.currentPage === 'order') {
            renderOrderCreationPage();
        } else if (app.currentPage === 'order-success') {
            renderOrderSuccessPage();
        } else if (app.currentPage === 'order-details') {
            renderOrderDetailsPage();
        }
    }
};

// ==================== Initialize App ====================
async function fetchInitialData() {
    const apiBase = '/api/public';
    try {
        const [prodRes, custRes, ordRes] = await Promise.all([
            fetch(apiBase + '/products'),
            fetch(apiBase + '/customers'),
            fetch(apiBase + '/orders')
        ]);

        if (prodRes.ok) app.products = await prodRes.json();
        if (custRes.ok) app.customers = await custRes.json();
        if (ordRes.ok) app.orders = await ordRes.json();
    } catch (e) {
        console.warn('Failed to fetch initial data from API', e);
        // keep local empty/default state
    }
}

window.addEventListener('DOMContentLoaded', async () => {
    await fetchInitialData();
    renderPage();
});