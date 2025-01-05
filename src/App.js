import React from 'react';
// import { AuthProvider } from './AuthContext' ;
import { Route, Routes } from 'react-router-dom';
import ProductForm from './ProductForm';
import ProductManagementUI from './ProductManagementUI';
// import SnapshotFirebase from './SnapshotFirebaseAdvanced';

function App() {
  return (
    <Routes>
      <Route path="/add-product" element={<ProductForm />} />
      <Route path="/" element={<ProductManagementUI />} />
    </Routes>
  );
}

export default App;