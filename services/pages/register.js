const renderRegisterPage = () => {
    return `
        <div class="login-container">
            <div class="login-box">
                <div class="login-header">
                    <div class="login-icon">
                        <i class="fas fa-user-plus"></i>
                    </div>
                    <h1>Đăng Ký</h1>
                    <p>Tạo tài khoản mới</p>
                </div>

                <div id="error-message-register" class="error-message hidden"></div>

                <div class="form-group">
                    <label>Tên đăng nhập</label>
                    <input type="text" id="reg-username" placeholder="Nhập tên đăng nhập">
                </div>

                <div class="form-group">
                    <label>Số điện thoại</label>
                    <input type="tel" id="reg-phone" placeholder="Nhập số điện thoại">
                </div>

                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="reg-email" placeholder="Nhập email">
                </div>

                <div class="form-group">
                    <label>Mật khẩu</label>
                    <input type="password" id="reg-password" placeholder="Nhập mật khẩu">
                </div>

                <div style="display:flex; gap:8px; justify-content:center; margin-top:8px;">
                    <button class="login-btn" id="register-btn">Đăng Ký</button>
                    <button class="link-btn" id="back-login-btn">Quay lại</button>
                </div>
            </div>
        </div>
    `;
};

const attachRegisterEvents = () => {
    const regBtn = document.getElementById('register-btn');
    const backBtn = document.getElementById('back-login-btn');
    const usernameInput = document.getElementById('reg-username');
    const phoneInput = document.getElementById('reg-phone');
    const emailInput = document.getElementById('reg-email');
    const passwordInput = document.getElementById('reg-password');
    const errorMsg = document.getElementById('error-message-register');

    const showErrorRegister = (message) => {
        if (!errorMsg) return alert(message);
        errorMsg.textContent = message;
        errorMsg.classList.remove('hidden');
        setTimeout(() => errorMsg.classList.add('hidden'), 5000);
    };

    if (backBtn) backBtn.addEventListener('click', () => showPage('login'));

    if (regBtn) {
        regBtn.addEventListener('click', async () => {
            const username = usernameInput.value.trim();
            const phone = phoneInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            if (!username || !phone || !email || !password) {
                showErrorRegister('Vui lòng nhập đầy đủ thông tin!');
                return;
            }

            try {
                const response = await fetch(app.apiBase + '/Auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, phone, email, password })
                });

                console.log('Register API response:', response.status, response.statusText);
                const responseText = await response.text();
                console.log('Response body:', responseText);

                if (response.ok) {
                    alert('Đăng ký thành công! Vui lòng đăng nhập.');
                    showPage('login');
                } else {
                    let errorMsg = responseText || `Lỗi ${response.status}: ${response.statusText}`;
                    try {
                        const json = JSON.parse(responseText);
                        errorMsg = json.message || json.error || JSON.stringify(json);
                    } catch (e) {
                        // Keep the plain text error
                    }
                    showErrorRegister(errorMsg);
                }
            } catch (e) {
                console.error('Lỗi đăng ký:', e);
                showErrorRegister('Lỗi kết nối đến server API: ' + e.message);
            }
        });
    }
};

// Khi trang register được render, gọi attachRegisterEvents từ app.renderPage()
