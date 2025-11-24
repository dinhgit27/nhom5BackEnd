// services/pages/layout.js
export function renderLayout(content) {
    const user = window.appState.currentUser;
    const currentPage = window.appState.currentPage;
    
    return `
        <div class="min-h-screen bg-gray-100">
            <nav class="bg-white shadow-md">
                <div class="max-w-7xl mx-auto px-4">
                    <div class="flex justify-between items-center h-16">
                        <h1 class="text-xl font-bold text-blue-600">🛒 Hệ Thống Bán Hàng</h1>
                        
                        <div class="flex items-center gap-4">
                            <div class="flex items-center gap-2">
                                <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                                <div>
                                    <p class="font-semibold text-sm">${user.name}</p>
                                    <p class="text-xs text-gray-500">${user.role}</p>
                                </div>
                            </div>

                            <div class="flex gap-2">
                                ${user.role === 'Admin' ? `
                                    <button
                                        onclick="window.navigateTo('products')"
                                        class="px-4 py-2 rounded-lg font-semibold transition ${
                                            currentPage === 'products'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }"
                                    >
                                        Quản Lý SP
                                    </button>
                                ` : ''}
                                
                                <button
                                    onclick="window.navigateTo('orders')"
                                    class="px-4 py-2 rounded-lg font-semibold transition ${
                                        currentPage === 'orders'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }"
                                >
                                    Đặt Hàng
                                </button>

                                <button
                                    onclick="window.logout()"
                                    class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                                >
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                    </svg>
                                    Đăng Xuất
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            
            <main class="max-w-7xl mx-auto">
                ${content}
            </main>
        </div>
    `;
}