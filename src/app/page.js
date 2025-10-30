'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function ProductCodeManager() {
  const [productCode, setProductCode] = useState('');
  const [products, setProducts] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // ฟังก์ชันสร้างบาร์โค้ดแบบง่าย
  const generateBarcode = (code) => {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 60;
    const ctx = canvas.getContext('2d');
    
    // พื้นหลังขาว
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // สร้างเส้นบาร์โค้ด
    ctx.fillStyle = 'black';
    const bars = code.split('').map(char => char.charCodeAt(0) % 4 + 1);
    let x = 10;
    bars.forEach(width => {
      ctx.fillRect(x, 5, width * 2, 50);
      x += width * 2 + 2;
    });
    
    return canvas.toDataURL();
  };

  const handleAdd = () => {
    if (!productCode.trim()) {
      alert('กรุณากรอกรหัสสินค้า');
      return;
    }

    // ตรวจสอบรูปแบบ (ตัวเลขและตัวอักษรภาษาอังกฤษเท่านั้น)
    const pattern = /^[A-Za-z0-9-]+$/;
    if (!pattern.test(productCode)) {
      alert('รหัสสินค้าต้องเป็นตัวเลขและตัวอักษรภาษาอังกฤษเท่านั้น');
      return;
    }

    const newProduct = {
      id: products.length + 1,
      code: productCode,
      barcode: generateBarcode(productCode)
    };

    setProducts([...products, newProduct]);
    setProductCode('');
  };

  const handleDeleteClick = (id) => {
    const product = products.find(p => p.id === id);
    setDeleteId({ id, code: product.code });
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setProducts(products.filter(p => p.id !== deleteId.id));
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          สร้าง Program ที่มี UI พร้อมการทำงานตามความต้องการดังนี้ (อ้างอิง ตามข้อมูล ด้านล่าง)
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="bg-green-600 text-white text-center py-2 rounded-t-lg -mx-6 -mt-6 mb-6">
            IT 06-1
          </div>

          {/* Input Section */}
          <div className="flex gap-2 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                รหัสสินค้า
              </label>
              <input
                type="text"
                value={productCode}
                onChange={(e) => setProductCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                placeholder="XXXX-XXXX-XXXX-XXXX"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleAdd}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                ADD
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-400 text-white">
                  <th className="border border-gray-300 px-4 py-2 w-20">id</th>
                  <th className="border border-gray-300 px-4 py-2">รหัสสินค้า (16 หลัก)</th>
                  <th className="border border-gray-300 px-4 py-2">บาร์โค้ดสินค้า</th>
                  <th className="border border-gray-300 px-4 py-2 w-24">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="border border-gray-300 px-4 py-8 text-center text-gray-500">
                      ไม่มีข้อมูล
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {product.id}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {product.code}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <img 
                          src={product.barcode} 
                          alt="Barcode" 
                          className="mx-auto"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <button
                          onClick={() => handleDeleteClick(product.id)}
                          className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                          ลบ
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold text-gray-800 mb-2">1. กดปุ่ม Add จะเพิ่มข้อมูลรหัสสินค้า ลงในตารางด้านล่าง</h3>
            <p className="text-gray-700 mb-1">เงื่อนไข</p>
            <p className="text-gray-700">1. รหัสสินค้าจะเป็นได้ทั้งตัวเลข และตัวอักษรภาษาอังกฤษ</p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <p className="text-lg text-gray-800">
                ต้องการลบข้อมูล รหัสสินค้า <span className="font-bold">{deleteId?.code}</span> หรือไม่?
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={cancelDelete}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                ตกลง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}