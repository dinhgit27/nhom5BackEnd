// services/pages/products.js
let showModal = false;
let editingProduct = null;
let formData = { ProductName: '', Price: '', Description: '', Stock: '' };

export function renderProducts() {
    const user = window.appState.currentUser;
    
    // Check authorization
    if (user?.role !== 'Admin') {
        return `
            <div class="flex items-center justify-center min-h-screen">
                <div class="bg-red-100 border border-red-400 text-red-700 px-8 py-6 rounded-lg text-center">
                    <svg class="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    <h2 class="text-2xl font-bold mb-2">Truy cập bị từ chối</h2>
                    <p>Bạn không có quyền truy cập trang này. Chỉ Admin mới có quyền quản lý sản phẩm.</p>
                </div>
            </div>
        `;
    }
    
    setTimeout(() => {
        attachProductEvents();
    }, 0);
    
    const products = window.appState.products;
    
    return `
        <div class="p-6">
            <div class="bg-white rounded-xl shadow-md p-6 mb-6">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">Quản Lý Sản Phẩm</h2>
                    <button
                        onclick="window.openProductModal()"
                        class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        Thêm Sản Phẩm
                    </button>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-md overflow-hidden">
                <table class="w-full">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tên Sản Phẩm</th>
                            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Giá</th>
                            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Mô Tả</th>
                            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tồn Kho</th>
                            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Thao Tác</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        ${products.map(product => `
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 text-sm">${product.ProductId}</td>
                                <td class="px-6 py-4 font-medium">${product.ProductName}</td>
                                <td class="px-6 py-4 text-blue-600 font-semibold">
                                    ${product.Price.toLocaleString('vi-VN')}đ
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600">${product.Description}</td>
                                <td class="px-6 py-4">
                                    <span class="px-3 py-1 rounded-full text-sm font-semibold ${
                                        product.Stock > 50 ? 'bg-green-100 text-green-800' : 
                                        product.Stock > 20 ? 'bg-yellow-100 text-yellow-800' : 
                                        'bg-red-100 text-red-800'
                                    }">
                                        ${product.Stock}
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex gap-2">
                                        <button
                                            onclick="window.openProductModal(${product.ProductId})"
                                            class="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600"
                                        >
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                            </svg>
                                        </button>
                                        <button
                                            onclick="window.deleteProduct(${product.ProductId})"
                                            class="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                                        >
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            ${showModal ? renderProductModal() : ''}
        </div>
    `;
}

function renderProductModal() {
    return `
        <div id="productModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold">
                        ${editingProduct ? 'Sửa Sản Phẩm' : 'Thêm Sản Phẩm'}
                    </h2>
                    <button onclick="window.closeProductModal()" class="text-gray-500 hover:text-gray-700">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                
                <form id="productForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-1">Tên sản phẩm *</label>
                        <input
                            type="text"
                            id="productName"
                            value="${formData.ProductName}"
                            required
                            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập tên sản phẩm"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-1">Giá (VNĐ) *</label>
                        <input
                            type="number"
                            id="productPrice"
                            value="${formData.Price}"
                            required
                            min="0"
                            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập giá"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-1">Mô tả</label>
                        <textarea
                            id="productDescription"
                            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            rows="3"
                            placeholder="Nhập mô tả"
                        >${formData.Description}</textarea>
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-1">Tồn kho *</label>
                        <input
                            type="number"
                            id="productStock"
                            value="${formData.Stock}"
                            required
                            min="0"
                            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập số lượng tồn kho"
                        />
                    </div>

                    <div class="flex gap-3 pt-4">
                        <button
                            type="button"
                            onclick="window.closeProductModal()"
                            class="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-100"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            ${editingProduct ? 'Cập Nhật' : 'Thêm Mới'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function attachProductEvents() {
    const form = document.getElementById('productForm');
    if (form) {
        form.addEventListener('submit', handleProductSubmit);
    }
}

function handleProductSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    const description = document.getElementById('productDescription').value;
    const stock = parseInt(document.getElementById('productStock').value);
    
    if (price < 0) {
        alert('Giá sản phẩm phải >= 0');
        return;
    }
    
    if (stock < 0) {
        alert('Tồn kho phải >= 0');
        return;
    }
    
    if (editingProduct) {
        const index = window.appState.products.findIndex(p => p.ProductId === editingProduct.ProductId);
        window.appState.products[index] = {
            ...window.appState.products[index],
            ProductName: name,
            Price: price,
            Description: description,
            Stock: stock
        };
    } else {
        const newProduct = {
            ProductId: Math.max(...window.appState.products.map(p => p.ProductId)) + 1,
            ProductName: name,
            Price: price,
            Description: description,
            Stock: stock,
            CategoryId: 1
        };
        window.appState.products.push(newProduct);
    }
    
    closeProductModal();
    window.renderApp();
}

window.openProductModal = function(productId) {
    if (productId) {
        editingProduct = window.appState.products.find(p => p.ProductId === productId);
        formData = { ...editingProduct };
    } else {
        editingProduct = null;
        formData = { ProductName: '', Price: '', Description: '', Stock: '' };
    }
    showModal = true;
    window.renderApp();
};

window.closeProductModal = function() {
    showModal = false;
    editingProduct = null;
    formData = { ProductName: '', Price: '', Description: '', Stock: '' };
    window.renderApp();
};

window.deleteProduct = function(productId) {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
        window.appState.products = window.appState.products.filter(p => p.ProductId !== productId);
        window.renderApp();
    }
};