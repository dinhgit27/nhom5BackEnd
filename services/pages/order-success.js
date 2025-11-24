// services/pages/order-success.js
export function renderOrderSuccess() {
    const orderId = window.appState.lastOrderId;
    
    return `
        <div class="flex items-center justify-center min-h-screen p-4">
            <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 text-center">
                <div class="inline-block p-4 bg-green-100 rounded-full mb-4">
                    <svg class="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                </div>
                
                <h2 class="text-3xl font-bold text-gray-800 mb-2">Đặt Hàng Thành Công!</h2>
                <p class="text-gray-600 mb-6">
                    Mã đơn hàng: <span class="font-bold text-blue-600">#${orderId}</span>
                </p>
                
                <div class="space-y-3">
                    <button
                        onclick="window.navigateTo('order-details', ${orderId})"
                        class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
                    >
                        Xem Chi Tiết Đơn Hàng
                    </button>
                    
                    <button
                        onclick="window.navigateTo('orders')"
                        class="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 font-semibold"
                    >
                        Tiếp Tục Mua Hàng
                    </button>
                </div>
            </div>
        </div>
    `;
}