// ==================== Application State ====================
const app = {
    currentPage: 'login',
    currentUser: null,
    token: null,
    products: [
        { ProductId: 1, ProductName: 'Aqua', Price: 8000, Description: 'Nước khoáng', Stock: 100, CategoryId: 1 },
        { ProductId: 2, ProductName: 'Pepsi', Price: 10000, Description: 'Nước ngọt', Stock: 80, CategoryId: 1 },
        { ProductId: 3, ProductName: 'Coca', Price: 10000, Description: 'Nước ngọt', Stock: 90, CategoryId: 1 },
        { ProductId: 4, ProductName: 'C2 Đào', Price: 15000, Description: 'Trà xanh', Stock: 60, CategoryId: 1 },
        { ProductId: 5, ProductName: 'Redbull', Price: 15000, Description: 'Nước tăng lực', Stock: 50, CategoryId: 1 },
    ],
    customers: [
        { CustomerId: 1, CustomerName: 'Nguyễn Văn A', Email: 'a@gmail.com', Phone: '0901234567', Address: 'HCM' },
        { CustomerId: 2, CustomerName: 'Trần Thị B', Email: 'b@gmail.com', Phone: '0912345678', Address: 'Hà Nội' }
    ],
    orders: [
        { OrderId: 1, CustomerId: 1, OrderDate: '2024-11-20', Status: 'Đã giao', TotalAmount: 50000, OrderDetails: [] }
    ],
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
window.addEventListener('DOMContentLoaded', () => {
    renderPage();
});
