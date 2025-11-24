// services/pages/orders.js
export function renderOrders() {
    setTimeout(() => {
        attachOrderEvents();
    }, 0);
    
    const products = window.appState.products;
    const cart = window.appState.cart;
    
    return `
        <div class="p-6">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2">
                    <div class="bg-white rounded-xl shadow-md p-6 mb-6">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4">Danh Sách Sản Phẩm</h2>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${products.map(product => `
                            <div class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
                                <div class="h-40 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                    <svg class="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                    </svg>
                                </div>
                                <div class="p-4">
                                    <h3 class="font-bold text-lg mb-2">${product.ProductName}</h3>
                                    <p class="text-sm text-gray-600 mb-2">${product.Description}</p>
                                    <div class="flex justify-between items-center mb-3">
                                        <span class="text-blue-600 font-bold text-xl">
                                            ${product.Price.toLocaleString('vi-VN')}đ
                                        </span>
                                        <span class="text-sm text-gray-500">Còn: ${product.Stock}</span>
                                    </div>
                                    <button
                                        onclick="window.addToCart(${product.ProductId})"
                                        ${product.Stock === 0 ? 'disabled' : ''}
                                        class="w-full py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
                                            product.Stock > 0
                                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }"
                                    >
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                        </svg>
                                        ${product.Stock > 0 ? 'Thêm Vào Giỏ' : 'Hết Hàng'}
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="lg:col-span-1">
                    <div class="bg-white rounded-xl shadow-md p-6 sticky top-6">
                        <h2 class="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                            Giỏ Hàng
                        </h2>

                        ${cart.length === 0 ? `
                            <div class="text-center text-gray-500 py-8">
                                <svg class="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                                <p>Giỏ hàng trống</p>
                            </div>
                        ` : `
                            <div class="space-y-3 mb-6 max-h-96 overflow-y-auto">
                                ${cart.map(item => `
                                    <div class="bg-gray-50 p-3 rounded-lg">
                                        <div class="flex justify-between items-start mb-2">
                                            <h4 class="font-semibold text-sm">${item.ProductName}</h4>
                                            <button
                                                onclick="window.removeFromCart(${item.ProductId})"
                                                class="text-red-500 hover:text-red-700"
                                            >
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                                </svg>
                                            </button>
                                        </div>
                                        <div class="flex justify-between items-center">
                                            <div class="flex items-center gap-2">
                                                <button
                                                    onclick="window.updateCartQuantity(${item.ProductId}, -1)"
                                                    class="bg-gray-300 w-7 h-7 rounded hover:bg-gray-400 font-semibold"
                                                >
                                                    -
                                                </button>
                                                <span class="font-semibold w-8 text-center">${item.quantity}</span>
                                                <button
                                                    onclick="window.updateCartQuantity(${item.ProductId}, 1)"
                                                    class="bg-gray-300 w-7 h-7 rounded hover:bg-gray-400 font-semibold"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <span class="font-bold text-blue-600">
                                                ${(item.Price * item.quantity).toLocaleString('vi-VN')}đ
                                            </span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>

                            <div class="border-t pt-4 mb-4">
                                <div class="flex justify-between items-center mb-4">
                                    <span class="text-lg font-semibold">Tổng Cộng:</span>
                                    <span class="text-2xl font-bold text-blue-600">
                                        ${getCartTotal().toLocaleString('vi-VN')}đ
                                    </span>
                                </div>
                                <button
                                    onclick="window.createOrder()"
                                    class="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
                                >
                                    Đặt Hàng
                                </button>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getCartTotal() {
    return window.appState.cart.reduce((sum, item) => sum + item.Price * item.quantity, 0);
}

function attachOrderEvents() {
    // Events are handled by global functions
}

window.addToCart = function(productId) {
    const product = window.appState.products.find(p => p.ProductId === productId);
    if (!product || product.Stock === 0) return;
    
    const existing = window.appState.cart.find(item => item.ProductId === productId);
    if (existing) {
        if (existing.quantity < product.Stock) {
            existing.quantity++;
        } else {
            alert('Không đủ số lượng trong kho!');
            return;
        }
    } else {
        window.appState.cart.push({ ...product, quantity: 1 });
    }
    
    window.renderApp();
};

window.removeFromCart = function(productId) {
    window.appState.cart = window.appState.cart.filter(item => item.ProductId !== productId);
    window.renderApp();
};

window.updateCartQuantity = function(productId, delta) {
    const item = window.appState.cart.find(i => i.ProductId === productId);
    const product = window.appState.products.find(p => p.ProductId === productId);
    
    if (item) {
        const newQty = item.quantity + delta;
        if (newQty > 0 && newQty <= product.Stock) {
            item.quantity = newQty;
        } else if (newQty <= 0) {
            window.removeFromCart(productId);
            return;
        } else {
            alert('Không đủ số lượng trong kho!');
            return;
        }
    }
    
    window.renderApp();
};

window.createOrder = function() {
    const cart = window.appState.cart;
    
    if (cart.length === 0) {
        alert('Vui lòng chọn ít nhất một sản phẩm!');
        return;
    }
    
    // Validate quantities
    for (let item of cart) {
        if (item.quantity <= 0) {
            alert('Số lượng sản phẩm phải > 0');
            return;
        }
    }
    
    const newOrderId = window.appState.orders.length > 0 
        ? Math.max(...window.appState.orders.map(o => o.OrderId)) + 1 
        : 1;
    
    const newOrder = {
        OrderId: newOrderId,
        CustomerId: window.appState.currentUser.customerId || 1,
        CustomerName: window.appState.currentUser.name,
        OrderDate: new Date().toISOString().split('T')[0],
        Status: 'Đang xử lý',
        TotalAmount: getCartTotal(),
        OrderDetails: cart.map(item => ({
            ProductId: item.ProductId,
            ProductName: item.ProductName,
            Quantity: item.quantity,
            UnitPrice: item.Price,
            Subtotal: item.Price * item.quantity
        }))
    };
    
    window.appState.orders.push(newOrder);
    window.appState.lastOrderId = newOrderId;
    window.appState.cart = [];
    
    window.navigateTo('order-success');
};