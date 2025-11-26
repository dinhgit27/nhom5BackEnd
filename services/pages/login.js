const renderLoginPage = () => {
    return `
        <div class="login-container">
            <div class="login-box">
                <div class="login-header">
                    <div class="login-icon">
                        <i class="fas fa-lock"></i>
                    </div>
                    <h1>Đăng Nhập</h1>
                    <p>Hệ thống quản lý bán hàng</p>
                </div>

                <div id="error-message" class="error-message hidden"></div>

                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="login-email" placeholder="Nhập email">
                </div>

                <div class="form-group">
                    <label>Mật khẩu</label>
                    <input type="password" id="login-password" placeholder="Nhập mật khẩu">
                </div>

                <button class="login-btn" id="login-btn">Đăng Nhập</button>

                <div class="demo-info">
                    <p class="title">Tài khoản demo:</p>
                    <p>Admin: admin@admin.com / admin</p>
                    <p>User: user@user.com / user</p>
                </div>
            </div>
        </div>
    `;
};

const attachLoginEvents = () => {
    const loginBtn = document.getElementById('login-btn');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const errorMsg = document.getElementById('error-message');

    loginBtn.addEventListener('click', async () => {
        const username = emailInput.value.trim(); 
        const password = passwordInput.value.trim();

        if (!username || !password) {
            showError(errorMsg, 'Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        try {
            const response = await fetch(app.apiBase + '/Auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                showError(errorMsg, 'Email hoặc mật khẩu không đúng!');
                return;
            }

            const data = await response.json();
            const decodedPayload = decodeJwt(data.token); 

            if (decodedPayload) {
                const role = decodedPayload["role"];          // Mới
                const name = decodedPayload["unique_name"];   // Mới
                const customerId = decodedPayload["CustomerId"]; 

                app.currentUser = { 
                  name: name, 
                  role: role, 
                  customerId: parseInt(customerId) 
                };
                app.token = data.token;
                app.currentPage = role === 'Admin' ? 'products' : 'order';
                
                await fetchInitialData(); // Cập nhật lại data (Product, Order...)
                renderPage();
            } else {
                showError(errorMsg, 'Lỗi giải mã token từ server!');
            }

        } catch (e) {
            console.error("Lỗi đăng nhập:", e);
            showError(errorMsg, 'Lỗi kết nối đến server API!');
        }
    });

    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loginBtn.click();
    });
};

const showError = (element, message) => {
    // ... (giữ nguyên)
    element.textContent = message;
    element.classList.remove('hidden');
    setTimeout(() => {
        element.classList.add('hidden');
    }, 5000);
};