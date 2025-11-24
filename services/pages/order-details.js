// services/pages/order-details.js
export function renderOrderDetails() {
    const orderId = window.appState.pageData;
    const order = window.appState.orders.find(o => o.OrderId === orderId);
    
    if (!order) {
        return `
            <div class="flex items-center justify-center min-h-screen p-4">
                <div class="bg-red-100 border border-red-400 text-red-700 px-8 py-6 rounded-lg text-center">
                    <h2 class="text-2xl font-bold mb-2">Không tìm thấy đơn hàng</h2>
                    <p class="mb-4">Đơn hàng #${orderId} không tồn tại trong hệ thống.</p>
                    <button
                        onclick="window.navigateTo('orders')"
                        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Quay lại
                    </button>
                </div>
            </div>
        `;
    }
    
    const getStatusColor = (status) => {
        switch(status) {
            case 'Đang xử lý': return 'bg-yellow-100 text-yellow-800';
            case 'Đã giao': return 'bg-green-100 text-green-800';
            case 'Đã hủy': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    
    return `
        <div class="p-6">
            <div class="max-w-4xl mx-auto">
                <!-- Header -->
                <div class="bg-white rounded-xl shadow-md p-6 mb-6">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h1 class="text-3xl font-bold text-gray-800 mb-2">Chi Tiết Đơn Hàng</h1>
                            <p class="text-gray-600">Mã đơn hàng: <span class="font-bold text-blue-600">#${order.OrderId}</span></p>
                        </div>
                        <button
                            onclick="window.navigateTo('orders')"
                            class="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center gap-2"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                            </svg>
                            Quay lại
                        </button>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <p class="text-sm text-gray-600 mb-1">Khách hàng</p>
                            <p class="font-semibold text-lg">${order.CustomerName}</p>
                        </div>
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <p class="text-sm text-gray-600 mb-1">Ngày đặt</p>
                            <p class="font-semibold text-lg">${new Date(order.OrderDate).toLocaleDateString('vi-VN')}</p>
                        </div>
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <p class="text-sm text-gray-600 mb-1">Trạng thái</p>
                            <span class="inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.Status)}">
                                ${order.Status}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Order Items -->
                <div class="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                    <div class="px-6 py-4 bg-gray-50 border-b">
                        <h2 class="text-xl font-bold text-gray-800">Sản Phẩm Đã Đặt</h2>
                    </div>
                    
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-100">
                                <tr>
                                    <th class="px-6 py-3 text-left text-sm font-semibold text-gray-700">Sản phẩm</th>
                                    <th class="px-6 py-3 text-center text-sm font-semibold text-gray-700">Số lượng</th>
                                    <th class="px-6 py-3 text-right text-sm font-semibold text-gray-700">Đơn giá</th>
                                    <th class="px-6 py-3 text-right text-sm font-semibold text-gray-700">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                ${order.OrderDetails.map(item => `
                                    <tr class="hover:bg-gray-50">
                                        <td class="px-6 py-4">
                                            <div class="flex items-center gap-3">
                                                <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                                                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p class="font-semibold">${item.ProductName}</p>
                                                    <p class="text-sm text-gray-500">ID: ${item.ProductId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 text-center">
                                            <span class="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
                                                ${item.Quantity}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 text-right font-semibold">
                                            ${item.UnitPrice.toLocaleString('vi-VN')}đ
                                        </td>
                                        <td class="px-6 py-4 text-right font-bold text-blue-600">
                                            ${item.Subtotal.toLocaleString('vi-VN')}đ
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Order Summary -->
                <div class="bg-white rounded-xl shadow-md p-6">
                    <h2 class="text-xl font-bold text-gray-800 mb-4">Tổng Kết Đơn Hàng</h2>
                    
                    <div class="space-y-3">
                        <div class="flex justify-between py-2 border-b">
                            <span class="text-gray-600">Tổng số sản phẩm:</span>
                            <span class="font-semibold">
                                ${order.OrderDetails.reduce((sum, item) => sum + item.Quantity, 0)}
                            </span>
                        </div>
                        
                        <div class="flex justify-between py-2 border-b">
                            <span class="text-gray-600">Tạm tính:</span>
                            <span class="font-semibold">
                                ${order.TotalAmount.toLocaleString('vi-VN')}đ
                            </span>
                        </div>
                        
                        <div class="flex justify-between py-3 bg-blue-50 px-4 rounded-lg">
                            <span class="text-lg font-bold text-gray-800">Tổng cộng:</span>
                            <span class="text-2xl font-bold text-blue-600">
                                ${order.TotalAmount.toLocaleString('vi-VN')}đ
                            </span>
                        </div>
                    </div>
                    
                    <div class="mt-6 flex gap-3">
                        <button
                            onclick="window.print()"
                            class="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 font-semibold flex items-center justify-center gap-2"
                        >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                            </svg>
                            In đơn hàng
                        </button>
                        
                        <button
                            onclick="window.navigateTo('orders')"
                            class="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-semibold"
                        >
                            Tiếp tục mua hàng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}