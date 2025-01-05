import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronLeft, ChevronRight, Filter, Download, Plus, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductManagementUI = () => {
  const navigate = useNavigate();
  const [products] = useState([
    { 
      id: 1, 
      name: 'Braised Pork', 
      price: '0.00', 
      items: 2, 
      status: 'visible',
      image: '/api/placeholder/48/48'
    },
    { 
      id: 2, 
      name: 'Spicy Rice Bowl', 
      price: '10.90', 
      items: 3, 
      status: 'visible',
      image: '/api/placeholder/48/48'
    }
  ]);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const sidebarRef = useRef(null);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarVisible(false);
      }
    };

    if (isSidebarVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarVisible]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Toggle Button for Small Screens */}
      <button
        className="md:hidden absolute top-4 left-4 z-20"
        onClick={() => setSidebarVisible(!isSidebarVisible)}
      >
        <Menu size={24} />
      </button>

      {/* Left Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 transform ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-white border-r border-gray-200 p-4 z-10`}
      >
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            <div className="flex-1">
              <h3 className="font-medium">Restaurant Name</h3>
              <p className="text-sm text-gray-500">store.app/id</p>
            </div>
          </div>
        </div>
        
        <nav className="space-y-1">
          {['Dashboard', 'Orders', 'Products', 'Customers', 'Design', 'Settings'].map((item) => (
            <button
              key={item}
              className={`w-full flex items-center px-3 py-2 text-sm rounded-lg ${
                item === 'Products' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 ml-0 md:ml-64">
        <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between">
          <h1 className="text-2xl font-semibold mb-4 md:mb-0 ml-12 md:ml-0">Products</h1>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">
              Import
            </button>
            <button className="px-4 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200">
              Bulk edit
            </button>
            <button
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              onClick={() => navigate('/add-product')}
            >
              <Plus size={16} />
              Add product
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="relative flex-1 max-w-full md:max-w-md mb-4 md:mb-0">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by product, variant names or SKU"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Filter size={20} />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Download size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-8 p-4">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </th>
                  <th className="text-left text-sm font-medium text-gray-500 p-4">Products</th>
                  <th className="text-left text-sm font-medium text-gray-500 p-4">Items</th>
                  <th className="text-left text-sm font-medium text-gray-500 p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="p-4">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">RM {product.price}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{product.items} items</td>
                    <td className="p-4">
                      <span className="px-2 py-1 text-xs font-medium uppercase rounded-full bg-green-50 text-green-600">
                        {product.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-gray-200 flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="text-sm text-gray-500 mb-4 md:mb-0">Total {products.length}</div>
            <div className="flex items-center gap-2">
              <select className="border border-gray-200 rounded-lg px-2 py-1 text-sm">
                <option>50</option>
                <option>100</option>
                <option>200</option>
              </select>
              <div className="flex items-center gap-1">
                <button className="p-1 rounded-lg hover:bg-gray-100">
                  <ChevronLeft size={20} />
                </button>
                <button className="p-1 rounded-lg hover:bg-gray-100">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagementUI;