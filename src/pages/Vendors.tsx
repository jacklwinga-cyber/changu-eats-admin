import React, { useState, useEffect } from 'react';
import { Store, Plus, Search, MapPin, Edit, Eye, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Vendors() {
  const [filter, setFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editModal, setEditModal] = useState<{ isOpen: boolean; vendor: any | null }>({ isOpen: false, vendor: null });
  const [detailsModal, setDetailsModal] = useState<{ isOpen: boolean; vendor: any | null }>({ isOpen: false, vendor: null });

  const [vendors, setVendors] = useState([
    { id: '1', name: 'Casa Mia', type: 'Restaurant', category: 'Italian', location: 'Blantyre CBD', status: 'Active', commission: '15%' },
    { id: '2', name: 'Chigumula Farms', type: 'Local Producer', category: 'Vegetables', location: 'Chigumula', status: 'Active', commission: '5%' },
    { id: '3', name: 'Sana Supermarket', type: 'Shop', category: 'Groceries', location: 'Lilongwe', status: 'Active', commission: '10%' },
    { id: '4', name: 'Ndirande Chicken Co.', type: 'Farmer', category: 'Poultry', location: 'Ndirande', status: 'Pending Review', commission: '0%' },
  ]);

  useEffect(() => {
    async function fetchVendors() {
      try {
        const { data, error } = await supabase.from('restaurants').select('*');
        if (error) console.warn('Could not load vendors; showing sample data.', error.message);
        if (data && data.length > 0) {
          const mapped = data.map(d => ({
            id: d.id,
            name: d.name,
            type: d.vendor_type === 'restaurant' ? 'Restaurant' : d.vendor_type === 'local_producer' ? 'Local Producer' : 'Shop',
            category: d.category || 'General',
            location: d.address || 'Malawi',
            status: d.is_active ? 'Active' : 'Inactive',
            commission: d.delivery_fee ? `${d.delivery_fee}%` : '10%',
          }));
          setVendors(mapped);
        }
      } catch (err) {
         console.log("Supabase not connected. Using mock data.");
      }
    }
    fetchVendors();
  }, []);

  const tabs = ['All', 'Restaurant', 'Local Producer', 'Shop', 'Farmer'];
  const filteredVendors = filter === 'All' ? vendors : vendors.filter(v => v.type === filter);

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editModal.vendor) {
      setVendors(vendors.map(v => v.id === editModal.vendor.id ? editModal.vendor : v));
    }
    setEditModal({ isOpen: false, vendor: null });
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Vendor Management</h1>
          <p className="page-subtitle">Manage restaurants, shops, and local producers.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={18} /> Add New Vendor
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {tabs.map(tab => (
            <button 
              key={tab} 
              className={`btn ${filter === tab ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter(tab)}
              style={{ padding: '8px 16px', borderRadius: '99px' }}
            >
              {tab}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-color)', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', width: '300px' }}>
          <Search size={18} color="var(--text-secondary)" style={{ marginRight: '8px' }} />
          <input type="text" placeholder="Search vendors..." style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', width: '100%' }} />
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Business Name</th>
                <th>Type</th>
                <th>Category</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.map(vendor => (
                <tr key={vendor.id}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '8px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Store size={18} />
                    </div>
                    {vendor.name}
                  </td>
                  <td>{vendor.type}</td>
                  <td>{vendor.category}</td>
                  <td style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)' }}>
                    <MapPin size={14} /> {vendor.location}
                  </td>
                  <td>
                    <span className={`badge ${vendor.status === 'Active' ? 'badge-success' : 'badge-pending'}`}>
                      {vendor.status}
                    </span>
                  </td>
                  <td>
                     <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-outline" style={{ padding: '6px 10px' }} onClick={() => setDetailsModal({ isOpen: true, vendor })}>
                          <Eye size={16} />
                        </button>
                        <button className="btn btn-outline" style={{ padding: '6px 10px' }} onClick={() => setEditModal({ isOpen: true, vendor })}>
                          <Edit size={16} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredVendors.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                    No vendors found in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      {detailsModal.isOpen && detailsModal.vendor && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '600px', padding: '32px', position: 'relative' }}>
            <button className="btn btn-outline" style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', padding: '4px' }} onClick={() => setDetailsModal({ isOpen: false, vendor: null })}>
              <X size={24} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ width: 64, height: 64, borderRadius: '12px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Store size={32} />
                </div>
                <div>
                  <h2 className="page-title" style={{ fontSize: '28px', marginBottom: '4px' }}>{detailsModal.vendor.name}</h2>
                  <p className="page-subtitle" style={{ marginTop: 0 }}>{detailsModal.vendor.type} • {detailsModal.vendor.category}</p>
                </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>Agreed Commission</h4>
                    <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary)' }}>{detailsModal.vendor.commission}</p>
                </div>
                <div style={{ background: 'var(--bg-color)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <h4 style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>Status</h4>
                    <p style={{ fontSize: '18px', fontWeight: 'bold', color: detailsModal.vendor.status === 'Active' ? 'var(--success)' : 'var(--danger)' }}>{detailsModal.vendor.status}</p>
                </div>
            </div>
            
            <div>
               <h4 style={{ color: 'var(--text-secondary)', fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>Location</h4>
               <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={16} /> {detailsModal.vendor.location}</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Vendor Modal */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '32px', position: 'relative' }}>
            <button className="btn btn-outline" style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', padding: '4px' }} onClick={() => setIsAddModalOpen(false)}>
              <X size={24} />
            </button>
            <h2 className="page-title" style={{ fontSize: '24px', marginBottom: '8px' }}>Onboard Vendor</h2>
            <p className="page-subtitle" style={{ marginBottom: '24px' }}>Register a new business partner to the platform.</p>
            
            <form onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>Business Name</label>
                <input type="text" className="input" placeholder="e.g. Makata Farms" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>Vendor Type</label>
                  <select className="input" required>
                    <option>Restaurant</option>
                    <option>Local Producer</option>
                    <option>Shop</option>
                    <option>Farmer</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>Category</label>
                  <input type="text" className="input" placeholder="e.g. Fast Food" required />
                </div>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>Location (City/Neighborhood)</label>
                <input type="text" className="input" placeholder="e.g. Lilongwe Area 10" required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                Register Vendor
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Vendor Modal */}
      {editModal.isOpen && editModal.vendor && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '32px', position: 'relative' }}>
            <button className="btn btn-outline" style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', padding: '4px' }} onClick={() => setEditModal({ isOpen: false, vendor: null })}>
              <X size={24} />
            </button>
            <h2 className="page-title" style={{ fontSize: '24px', marginBottom: '8px' }}>Edit Vendor Profile</h2>
            
            <form onSubmit={saveEdit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>Business Name</label>
                <input type="text" className="input" value={editModal.vendor.name} onChange={e => setEditModal({...editModal, vendor: {...editModal.vendor, name: e.target.value}})} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>Vendor Type</label>
                  <select className="input" value={editModal.vendor.type} onChange={e => setEditModal({...editModal, vendor: {...editModal.vendor, type: e.target.value}})} required>
                    <option>Restaurant</option>
                    <option>Local Producer</option>
                    <option>Shop</option>
                    <option>Farmer</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>Category</label>
                  <input type="text" className="input" value={editModal.vendor.category} onChange={e => setEditModal({...editModal, vendor: {...editModal.vendor, category: e.target.value}})} required />
                </div>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>Agreed Commission</label>
                <input type="text" className="input" value={editModal.vendor.commission} onChange={e => setEditModal({...editModal, vendor: {...editModal.vendor, commission: e.target.value}})} required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
