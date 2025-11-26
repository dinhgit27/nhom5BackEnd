// ==================== RENDERING UI ====================

const renderProductManagementPage = () => {
    // 1. Kiểm tra quyền Admin
    if (!app.currentUser || app.currentUser.role !== 'Admin') {
        document.getElementById('main-content').innerHTML = `
            <div class="access-denied">
                <div class="access-denied-box">
                    <i class="fas fa-lock"></i>
                    <h2>Truy cập bị từ chối</h2>
                    <p>Bạn không có quyền truy cập trang này. Chỉ Admin mới có quyền quản lý sản phẩm.</p>
                </div>
            </div>
        `;
        return;
    }

    // 2. Render khung trang quản lý
    document.getElementById('main-content').innerHTML = `
        <div class="products-header">
            <h2>Quản Lý Sản Phẩm</h2>
            <button class="add-product-btn" id="add-product-btn">
                <i class="fas fa-plus"></i> Thêm Sản Phẩm
            </button>
        </div>

        <div class="products-table">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên Sản Phẩm</th>
                        <th>Giá</th>
                        <th>Mô Tả</th>
                        <th>Tồn Kho</th>
                        <th>Thao Tác</th>
                    </tr>
                </thead>
                <tbody id="products-tbody"></tbody>
            </table>
        </div>

        <div id="product-modal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="modal-title">Thêm Sản Phẩm</h2>
                    <button class="close-btn" id="close-modal">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <form class="modal-form" id="product-form">
                    <div class="form-group">
                        <label>Tên sản phẩm *</label>
                        <input type="text" id="product-name" required>
                    </div>

                    <div class="form-group">
                        <label>Giá (VNĐ) *</label>
                        <input type="number" id="product-price" required>
                    </div>

                    <div class="form-group">
                        <label>Mô tả</label>
                        <textarea id="product-description"></textarea>
                    </div>

                    <div class="form-group">
                        <label>Tồn kho *</label>
                        <input type="number" id="product-stock" required>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="cancel-btn" id="cancel-btn">Hủy</button>
                        <button type="submit" class="save-btn">Lưu</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    // 3. Render dữ liệu bảng và Gắn sự kiện
    renderProductsTable();
    attachProductManagementEvents(); 
};

const renderProductsTable = () => {
    const tbody = document.getElementById('products-tbody');
    if (!tbody) return;

    if (!app.products || app.products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Chưa có sản phẩm nào.</td></tr>';
        return;
    }

    tbody.innerHTML = app.products.map(product => `
        <tr>
            <td>${product.id || product.productId}</td> <td>${product.name || product.productName}</td>
            <td class="product-price">${(product.price || 0).toLocaleString('vi-VN')}đ</td>
            <td>${product.description || ''}</td>
            <td>
                <span class="stock-badge ${product.stock > 50 ? 'stock-high' : product.stock > 20 ? 'stock-medium' : 'stock-low'}">
                    ${product.stock}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editProduct(${product.id || product.productId})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteProduct(${product.id || product.productId})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
};

// ==================== EVENTS & LOGIC ====================

const attachProductManagementEvents = () => {
    const addBtn = document.getElementById('add-product-btn');
    const closeBtn = document.getElementById('close-modal');
    const cancelBtn = document.getElementById('cancel-btn');
    const form = document.getElementById('product-form');
    
    // Gắn sự kiện Click cho nút Thêm
    if (addBtn) addBtn.addEventListener('click', () => openProductModal());
    
    // Gắn sự kiện đóng Modal
    if (closeBtn) closeBtn.addEventListener('click', () => closeProductModal());
    if (cancelBtn) cancelBtn.addEventListener('click', () => closeProductModal());
    
    // Gắn sự kiện Submit Form
    if (form) form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveProduct();
    });
};

const openProductModal = (productId = null) => {
    const modal = document.getElementById('product-modal');
    const title = document.getElementById('modal-title');
    
    if (productId) {
        // Chế độ Sửa
        // Tìm sản phẩm (chấp nhận cả Id hoa và thường do sự khác biệt giữa JSON BE và JS FE)
        const product = app.products.find(p => (p.id === productId || p.productId === productId));
        if (!product) return;

        app.editingProduct = product;
        title.textContent = 'Sửa Sản Phẩm';
        document.getElementById('product-name').value = product.name || product.productName;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-description').value = product.description || '';
        document.getElementById('product-stock').value = product.stock;
    } else {
        // Chế độ Thêm mới
        app.editingProduct = null;
        title.textContent = 'Thêm Sản Phẩm';
        document.getElementById('product-form').reset();
    }

    modal.classList.add('show');
};

const closeProductModal = () => {
    const modal = document.getElementById('product-modal');
    if (modal) modal.classList.remove('show');
    app.editingProduct = null;
};

// ==================== API ACTIONS ====================

const saveProduct = async () => {
    const name = document.getElementById('product-name').value.trim();
    const price = parseFloat(document.getElementById('product-price').value);
    const description = document.getElementById('product-description').value.trim();
    const stock = parseInt(document.getElementById('product-stock').value);

    if (!name || isNaN(price) || isNaN(stock)) {
        alert('Vui lòng nhập đầy đủ và đúng định dạng!');
        return;
    }

    const productDto = {
        name: name,
        price: price,
        description: description,
        stock: stock
    };

    let response;
    
    // Kiểm tra xem đang Sửa hay Thêm mới
    // Lưu ý: app.editingProduct có thể có 'id' hoặc 'productId' tùy vào dữ liệu API trả về
    if (app.editingProduct) {
        const idToUpdate = app.editingProduct.id || app.editingProduct.productId;
        // GỌI API PUT
        response = await fetchWithAuth(`/products/${idToUpdate}`, {
            method: 'PUT',
            body: JSON.stringify(productDto)
        });
    } else {
        // GỌI API POST
        response = await fetchWithAuth('/products', {
            method: 'POST',
            body: JSON.stringify(productDto)
        });
    }

    if (response && response.ok) {
        closeProductModal();
        // Reload lại dữ liệu bảng
        await fetchAdminProductsAndRender(); 
    } else {
        const errorText = response ? await response.text() : "Lỗi kết nối";
        alert('Lỗi lưu sản phẩm: ' + errorText);
    }
};

// Hàm này cần được gọi từ window object vì nó được gắn vào onclick HTML string
window.editProduct = (id) => {
    openProductModal(id);
}

// Hàm này cần được gọi từ window object
window.deleteProduct = async (id) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
        const response = await fetchWithAuth(`/products/${id}`, {
            method: 'DELETE'
        });

        if (response && response.ok) {
            await fetchAdminProductsAndRender();
        } else {
            alert('Không thể xóa sản phẩm. Có thể sản phẩm đã có đơn hàng.');
        }
    }
}