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

    loginBtn.addEventListener('click', () => {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            showError(errorMsg, 'Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        if (email === 'admin@admin.com' && password === 'admin') {
            app.currentUser = { email, role: 'Admin', name: 'Admin User' };
            app.token = 'mock-jwt-token-admin';
            app.currentPage = 'products';
            renderPage();
        } else if (email === 'user@user.com' && password === 'user') {
            app.currentUser = { email, role: 'User', name: 'Normal User', customerId: 1 };
            app.token = 'mock-jwt-token-user';
            app.currentPage = 'order';
            renderPage();
        } else {
            showError(errorMsg, 'Email hoặc mật khẩu không đúng!');
        }
    });

    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loginBtn.click();
    });
};

const showError = (element, message) => {
    element.textContent = message;
    element.classList.remove('hidden');
    setTimeout(() => {
        element.classList.add('hidden');
    }, 5000);
};
