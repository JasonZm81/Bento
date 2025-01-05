import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, Plus, ImageIcon } from 'lucide-react';
import { db, collection, addDoc } from './firebase';
import Modal from './Modal';
import { Cloudinary } from 'cloudinary-core';
import axios from 'axios';

const ProductForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    visibility: 'Visible',
    category: '',
    type: 'Physical', 
    price: '0',
    originalPrice: '0',
    description: '',
    trackQuantity: false,
    dailyCapacity: false,
    maxOrderQuantity: false,
    minOrderQuantity: false,
    sku: '',
    images: []
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState('');

  const cloudinary = new Cloudinary({ cloud_name: 'your_cloud_name', secure: true });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(file); // Store the file instead of the URL
    }
  };

  const uploadImageToCloudinary = async (image) => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "sgk19zsh"); // Replace with your actual upload preset

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/drusxooph/image/upload`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error.message || "Failed to upload image");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (err) {
      console.error("Error uploading image:", err);
      setError(`Error uploading image: ${err.message}`);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = null;
    if (selectedImage) {
      imageUrl = await uploadImageToCloudinary(selectedImage);
      if (!imageUrl) {
        alert("Failed to upload image. Please try again.");
        return;
      }
    }

    const message = `
      Save button is pressed.
      Name: ${formData.name}
      Category: ${formData.category}
      Price: RM${formData.price}
      Original Price: RM${formData.originalPrice}
      Description: ${formData.description}
      Images: ${imageUrl ? imageUrl : formData.images.join(', ')}
    `;
    
    setModalMessage(message);
    setIsModalOpen(true);

    try {
      const docRef = await addDoc(collection(db, "clients"), {
        name: formData.name,
        category: formData.category,
        sku: formData.sku,
        createdAt: new Date(),
        updatedAt: new Date(),
        images: imageUrl ? [imageUrl] : formData.images
      });
      console.log("Product saved with ID: ", docRef.id);
      alert("Your data is updated");

      const phoneNumber = "601112407109";
      const whatsappMessage = `
        红烧肉 x 1
        卤肉饭 x 1
      `;
      const apiUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(whatsappMessage)}`;
      window.open(apiUrl, '_blank');

      navigate('/');
    } catch (error) {
      console.error("Error saving product: ", error);
      alert("Failed to save product. Please try again.");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold">Product</h1>
            <button className="p-1">
              <Info size={18} className="text-gray-400" />
            </button>
          </div>
          <select className="px-3 py-1.5 border border-gray-200 rounded-lg bg-gray-100">
            <option>WhatsApp</option>
          </select>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg p-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Visibility</label>
              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Visible</option>
                <option>Hidden</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search or create category"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Physical</option>
                <option>Digital</option>
              </select>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h2 className="text-lg font-medium mb-4">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">RM</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full pl-10 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Original price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">RM</span>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    className="w-full pl-10 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <div className="text-sm text-gray-500 mb-2">
              Decorate with **bold** ~~strike~~ _italic_
            </div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">Images</label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8">
              {selectedImage ? (
                <div className="flex flex-col items-center">
                  <img src={URL.createObjectURL(selectedImage)} alt="Selected" className="w-64 h-64 object-cover rounded-lg mb-4" />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Change Image
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center text-gray-500 cursor-pointer">
                  <ImageIcon size={24} className="mb-2" />
                  <p className="text-sm mb-1">Drag a file here or click to select one</p>
                  <p className="text-xs">File should not exceed 10mb. Recommended ratio is 1:1.</p>
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Variants & Options */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium mb-2">Variants</h2>
              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
                <Plus size={16} />
                Add variant
              </button>
            </div>
            
            <div>
              <h2 className="text-lg font-medium mb-2">Options</h2>
              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
                <Plus size={16} />
                Add option
              </button>
            </div>
          </div>

          {/* Inventory */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Inventory</h2>
              <Info size={18} className="text-gray-400" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Track quantity</label>
                  <p className="text-sm text-gray-500">Track inventory levels</p>
                </div>
                <input
                  type="checkbox"
                  name="trackQuantity"
                  checked={formData.trackQuantity}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Daily capacity</label>
                  <p className="text-sm text-gray-500">The maximum number of items you can sell per day</p>
                </div>
                <input
                  type="checkbox"
                  name="dailyCapacity"
                  checked={formData.dailyCapacity}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 text-green-600 mb-2">
                  <div className="w-4 h-4">⚡</div>
                  <h3 className="font-medium">Upgrade to set daily limit</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Upgrade to a paid plan to limit the number of items to sell per day.
                </p>
                <div className="flex items-center gap-3">
                  <button className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm">
                    Upgrade to Premium
                  </button>
                  <button className="text-sm text-blue-600">Learn more</button>
                </div>
              </div>
            </div>
          </div>

          {/* SKU */}
          <div>
            <label className="block text-sm font-medium mb-1">SKU</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              Save
            </button>
          </div>
        </form>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        message={modalMessage}
      >
        <div>
          <h1>Sending Order to Shop?</h1>
          <p>If not redirected, click <a href={`https://api.whatsapp.com/send?phone=601112407109&text=${encodeURIComponent('红烧肉 x 1\n卤肉饭 x 1')}`}>here</a> to confirm your order.</p>
        </div>
      </Modal>
    </div>
  );
};

export default ProductForm;