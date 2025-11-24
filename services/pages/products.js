// ==================== Product Management Page ====================
const renderProductManagementPage = () => {
    if (app.currentUser?.role !== 'Admin') {
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

    renderProductsTable();
    attachProductManagementEvents();
};

const renderProductsTable = () => {
    const tbody = document.getElementById('products-tbody');
    tbody.innerHTML = app.products.map(product => `
        <tr>
            <td>${product.ProductId}</td>
            <td>${product.ProductName}</td>
            <td class="product-price">${product.Price.toLocaleString('vi-VN')}đ</td>
            <td>${product.Description}</td>
            <td>
                <span class="stock-badge ${product.Stock > 50 ? 'stock-high' : product.Stock > 20 ? 'stock-medium' : 'stock-low'}">
                    ${product.Stock}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editProduct(${product.ProductId})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteProduct(${product.ProductId})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
};

const attachProductManagementEvents = () => {
    const addBtn = document.getElementById('add-product-btn');
    const closeBtn = document.getElementById('close-modal');
    const cancelBtn = document.getElementById('cancel-btn');
    const form = document.getElementById('product-form');
    const modal = document.getElementById('product-modal');

    addBtn.addEventListener('click', () => openProductModal());
    closeBtn.addEventListener('click', () => closeProductModal());
    cancelBtn.addEventListener('click', () => closeProductModal());
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveProduct();
    });
};

const openProductModal = (productId = null) => {
    const modal = document.getElementById('product-modal');
    const title = document.getElementById('modal-title');

    if (productId) {
        const product = app.products.find(p => p.ProductId === productId);
        app.editingProduct = product;
        title.textContent = 'Sửa Sản Phẩm';
        document.getElementById('product-name').value = product.ProductName;
        document.getElementById('product-price').value = product.Price;
        document.getElementById('product-description').value = product.Description;
        document.getElementById('product-stock').value = product.Stock;
    } else {
        app.editingProduct = null;
        title.textContent = 'Thêm Sản Phẩm';
        document.getElementById('product-form').reset();
    }

    modal.classList.add('show');
};

const closeProductModal = () => {
    document.getElementById('product-modal').classList.remove('show');
    app.editingProduct = null;
};

const saveProduct = () => {
    const name = document.getElementById('product-name').value.trim();
    const price = parseFloat(document.getElementById('product-price').value);
    const description = document.getElementById('product-description').value.trim();
    const stock = parseInt(document.getElementById('product-stock').value);

    if (!name || !price || stock === '') {
        alert('Vui lòng nhập đầy đủ thông tin!');
        return;
    }

    if (price < 0) {
        alert('Giá sản phẩm phải >= 0');
        return;
    }

    if (stock < 0) {
        alert('Tồn kho phải >= 0');
        return;
    }

    if (app.editingProduct) {
        app.editingProduct.ProductName = name;
        app.editingProduct.Price = price;
        app.editingProduct.Description = description;
        app.editingProduct.Stock = stock;
    } else {
        const newProduct = {
            ProductId: Math.max(...app.products.map(p => p.ProductId)) + 1,
            ProductName: name,
            Price: price,
            Description: description,
            Stock: stock,
            CategoryId: 1
        };
        app.products.push(newProduct);
    }

    closeProductModal();
    renderProductsTable();
};

const editProduct = (productId) => {
    openProductModal(productId);
};

const deleteProduct = (productId) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
        app.products = app.products.filter(p => p.ProductId !== productId);
        renderProductsTable();
    }
};
