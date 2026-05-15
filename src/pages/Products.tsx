import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, X, Image as ImageIcon, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [restaurantId, setRestaurantId] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      // Fetch Restaurants for the dropdown
      const { data: restData } = await supabase.from('restaurants').select('id, name');
      if (restData) setRestaurants(restData);

      // Fetch Products with their associated restaurant name
      const { data: prodData } = await supabase
        .from('menu_items')
        .select(`
          *,
          restaurants ( name )
        `)
        .order('created_at', { ascending: false });
        
      if (prodData) setProducts(prodData);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return editingProduct?.image_url || null;

    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, imageFile);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      alert('Error uploading image. Did you run the SQL script?');
      return null;
    }

    const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    const imageUrl = await uploadImage();

    const productData = {
      name,
      description,
      price: parseFloat(price),
      restaurant_id: restaurantId || null,
      is_available: isAvailable,
      image_url: imageUrl,
    };

    if (editingProduct) {
      // Update
      await supabase.from('menu_items').update(productData).eq('id', editingProduct.id);
    } else {
      // Insert
      await supabase.from('menu_items').insert([productData]);
    }

    setIsUploading(false);
    closeModal();
    fetchData(); // Refresh list
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await supabase.from('menu_items').delete().eq('id', id);
      fetchData();
    }
  };

  const toggleAvailability = async (product: any) => {
    const newStatus = !product.is_available;
    // Optimistic UI update
    setProducts(products.map(p => p.id === product.id ? { ...p, is_available: newStatus } : p));
    await supabase.from('menu_items').update({ is_available: newStatus }).eq('id', product.id);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setPrice('');
    setRestaurantId(restaurants.length > 0 ? restaurants[0].id : '');
    setIsAvailable(true);
    setImageFile(null);
    setImagePreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description || '');
    setPrice(product.price.toString());
    setRestaurantId(product.restaurant_id || '');
    setIsAvailable(product.is_available);
    setImageFile(null);
    setImagePreview(product.image_url);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Product Inventory</h1>
          <p className="page-subtitle">Manage menu items, prices, and stock availability across all vendors.</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        {isLoading ? (
          <p>Loading products...</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product Details</th>
                  <th>Vendor</th>
                  <th>Price</th>
                  <th>Stock Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>No products found. Add one!</td></tr>
                ) : products.map(product => (
                  <tr key={product.id}>
                    <td>
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ImageIcon size={20} color="var(--text-secondary)" />
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{product.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {product.description}
                      </div>
                    </td>
                    <td>{product.restaurants?.name || 'Unassigned'}</td>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>MWK {product.price}</td>
                    <td>
                      <button 
                        onClick={() => toggleAvailability(product)}
                        className={`badge ${product.is_available ? 'badge-success' : 'badge-pending'}`}
                        style={{ border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        {product.is_available ? <><CheckCircle size={12}/> In Stock</> : <><XCircle size={12}/> Out of Stock</>}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-outline" style={{ padding: '6px 10px' }} onClick={() => openEditModal(product)}>
                          <Edit size={16} />
                        </button>
                        <button className="btn btn-outline" style={{ padding: '6px 10px', color: '#ef4444', borderColor: '#ef4444' }} onClick={() => handleDelete(product.id)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '32px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button className="btn btn-outline" style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', padding: '4px' }} onClick={closeModal}>
              <X size={24} />
            </button>
            <h2 className="page-title" style={{ fontSize: '24px', marginBottom: '24px' }}>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              {/* Image Upload Area */}
              <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <label style={{ display: 'inline-block', cursor: 'pointer', position: 'relative' }}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" style={{ width: '120px', height: '120px', borderRadius: '16px', objectFit: 'cover', border: '2px dashed var(--primary)' }} />
                  ) : (
                    <div style={{ width: '120px', height: '120px', borderRadius: '16px', border: '2px dashed var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                      <ImageIcon size={32} style={{ marginBottom: '8px' }} />
                      <span style={{ fontSize: '12px' }}>Upload Image</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageSelect} />
                </label>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>Product Name</label>
                <input type="text" className="input" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>Description</label>
                <textarea className="input" style={{ minHeight: '80px', resize: 'vertical' }} value={description} onChange={e => setDescription(e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>Price (MWK)</label>
                  <input type="number" className="input" value={price} onChange={e => setPrice(e.target.value)} required min="0" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>Vendor / Restaurant</label>
                  <select className="input" value={restaurantId} onChange={e => setRestaurantId(e.target.value)}>
                    <option value="">No Vendor Selected</option>
                    {restaurants.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input 
                  type="checkbox" 
                  id="stockToggle" 
                  checked={isAvailable} 
                  onChange={e => setIsAvailable(e.target.checked)} 
                  style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }}
                />
                <label htmlFor="stockToggle" style={{ fontWeight: 600 }}>Product is currently In Stock</label>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={isUploading}>
                {isUploading ? 'Uploading & Saving...' : 'Save Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
