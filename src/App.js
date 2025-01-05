import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ProductForm from './ProductForm';
import ProductManagementUI from './ProductManagementUI';

function App() {
  return (
    <Routes>
      <Route path="/add-product" element={<ProductForm />} />
      <Route path="/" element={<ProductManagementUI />} />
    </Routes>
  );
}

export default App;