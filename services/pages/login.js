// services/pages/login.js
export function renderLogin() {
    setTimeout(() => {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }
    }, 0);
    
    return `
        <div class="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
                <div class="text-center mb-8">
                    <div class="inline-block p-4 bg-blue-100 rounded-full mb-4">
                        <svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                    </div>
                    <h1 class="text-3xl font-bold text-gray-800">Đăng Nhập</h1>
                    <p class="text-gray-600 mt-2">Hệ thống quản lý bán hàng</p>
                </div>

                <div id="errorMessage" class="hidden bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"></div>

                <form id="loginForm" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            id="emailInput"
                            required
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập email"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
                        <input
                            type="password"
                            id="passwordInput"
                            required
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập mật khẩu"
                        />
                    </div>

                    <button
                        type="submit"
                        class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                    >
                        Đăng Nhập
                    </button>
                </form>

                <div class="mt-6 p-4 bg-gray-50 rounded-lg text-sm">
                    <p class="font-semibold mb-2">Tài khoản demo:</p>
                    <p class="text-gray-600">Admin: admin@admin.com / admin</p>
                    <p class="text-gray-600">User: user@user.com / user</p>
                </div>
            </div>
        </div>
    `;
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    const errorDiv = document.getElementById('errorMessage');
    
    const result = window.login(email, password);
    
    if (!result.success) {
        errorDiv.textContent = result.message;
        errorDiv.classList.remove('hidden');
    }
}