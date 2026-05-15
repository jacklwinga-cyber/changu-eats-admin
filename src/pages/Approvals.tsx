import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, Edit, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Approvals() {
  const [couriers, setCouriers] = useState([
    { id: '1', name: 'James Phiri', phone: '+265 991 234 567', vehicle: 'Motorcycle', licensePlate: 'BL 1234', status: 'Pending', date: '2026-05-10' },
    { id: '2', name: 'Mary Banda', phone: '+265 882 345 678', vehicle: 'Bicycle', licensePlate: 'N/A', status: 'Pending', date: '2026-05-11' },
    { id: '3', name: 'Kondwani Mtika', phone: '+265 888 111 222', vehicle: 'Car', licensePlate: 'LL 9988', status: 'Approved', date: '2026-05-08' },
  ]);

  const [idModal, setIdModal] = useState<{ isOpen: boolean; name: string | null }>({ isOpen: false, name: null });
  const [editModal, setEditModal] = useState<{ isOpen: boolean; courier: any | null }>({ isOpen: false, courier: null });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    async function fetchCouriers() {
      try {
        const { data, error } = await supabase.from('profiles').select('*').eq('role', 'courier');
        if (data && data.length > 0) {
          // Map DB columns to our UI state
          const mapped = data.map(d => ({
            id: d.id,
            name: `${d.first_name || ''} ${d.last_name || ''}`.trim(),
            type: d.vehicle_type || 'Unknown',
            phone: d.phone_number || 'N/A',
            applied: new Date(d.created_at).toLocaleDateString(),
            status: d.is_verified ? 'Approved' : 'Pending',
          }));
          setCouriers(mapped);
        }
      } catch (err) {
        console.log("Supabase not connected. Using mock data.");
      }
    }
    fetchCouriers();
  }, []);

  const handleApprove = (id: string) => {
    setCouriers(couriers.map(c => c.id === id ? { ...c, status: 'Approved' } : c));
  };

  const saveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editModal.courier) {
      setCouriers(couriers.map(c => c.id === editModal.courier.id ? editModal.courier : c));
    }
    setEditModal({ isOpen: false, courier: null });
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Driver Approvals (KYC)</h1>
          <p className="page-subtitle">Review and verify new courier applications and vehicle documents.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <CheckCircle size={18} style={{ display: 'none' }} /> Add New Driver
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Applicant Name</th>
                <th>Phone & Vehicle</th>
                <th>License Plate</th>
                <th>Documents</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {couriers.map(courier => (
                <tr key={courier.id}>
                  <td style={{ fontWeight: 600 }}>{courier.name}<br/><span style={{fontSize: 12, color: 'var(--text-secondary)', fontWeight: 'normal'}}>Applied: {courier.date}</span></td>
                  <td>{courier.phone}<br/><span style={{fontSize: 12, color: 'var(--text-secondary)'}}>{courier.vehicle}</span></td>
                  <td>{courier.licensePlate}</td>
                  <td>
                    <button className="btn btn-outline" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => setIdModal({ isOpen: true, name: courier.name })}>
                      <Eye size={14} /> View ID
                    </button>
                  </td>
                  <td>
                    <span className={`badge ${courier.status === 'Pending' ? 'badge-pending' : 'badge-success'}`}>
                      {courier.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {courier.status === 'Pending' && (
                        <>
                          <button className="btn btn-primary" onClick={() => handleApprove(courier.id)} style={{ padding: '6px 10px' }}>
                            <CheckCircle size={16} />
                          </button>
                          <button className="btn btn-outline" style={{ padding: '6px 10px', color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      <button className="btn btn-outline" style={{ padding: '6px 10px' }} onClick={() => setEditModal({ isOpen: true, courier })}>
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ID View Modal */}
      {idModal.isOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '600px', padding: '32px', position: 'relative', textAlign: 'center' }}>
            <button className="btn btn-outline" style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', padding: '4px' }} onClick={() => setIdModal({ isOpen: false, name: null })}>
              <X size={24} />
            </button>
            <h2 className="page-title" style={{ fontSize: '24px', marginBottom: '24px' }}>National ID: {idModal.name}</h2>
            <div style={{ width: '100%', height: '300px', background: 'var(--border-color)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
               [Mock ID Image Overlay]
            </div>
          </div>
        </div>
      )}

      {/* Edit Driver Modal */}
      {editModal.isOpen && editModal.courier && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '32px', position: 'relative' }}>
            <button className="btn btn-outline" style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', padding: '4px' }} onClick={() => setEditModal({ isOpen: false, courier: null })}>
              <X size={24} />
            </button>
            <h2 className="page-title" style={{ fontSize: '24px', marginBottom: '8px' }}>Edit Driver Profile</h2>
            <p className="page-subtitle" style={{ marginBottom: '24px' }}>Modify details for {editModal.courier.name}.</p>
            
            <form onSubmit={saveEdit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>Full Name</label>
                <input type="text" className="input" value={editModal.courier.name} onChange={e => setEditModal({...editModal, courier: {...editModal.courier, name: e.target.value}})} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>Phone Number</label>
                  <input type="text" className="input" value={editModal.courier.phone} onChange={e => setEditModal({...editModal, courier: {...editModal.courier, phone: e.target.value}})} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>Vehicle Type</label>
                  <select className="input" value={editModal.courier.vehicle} onChange={e => setEditModal({...editModal, courier: {...editModal.courier, vehicle: e.target.value}})} required>
                    <option>Motorcycle</option>
                    <option>Bicycle</option>
                    <option>Car</option>
                    <option>Big Delivery Van</option>
                    <option>Pickup Truck</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>License Plate (If applicable)</label>
                <input type="text" className="input" value={editModal.courier.licensePlate} onChange={e => setEditModal({...editModal, courier: {...editModal.courier, licensePlate: e.target.value}})} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Driver Modal */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '32px', position: 'relative' }}>
            <button className="btn btn-outline" style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', padding: '4px' }} onClick={() => setIsAddModalOpen(false)}>
              <X size={24} />
            </button>
            <h2 className="page-title" style={{ fontSize: '24px', marginBottom: '8px' }}>Onboard New Driver</h2>
            <p className="page-subtitle" style={{ marginBottom: '24px' }}>Manually register a courier.</p>
            
            <form onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>Full Name</label>
                <input type="text" className="input" placeholder="e.g. John Doe" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>Phone Number</label>
                  <input type="text" className="input" placeholder="+265 888 123 456" required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>Vehicle Type</label>
                  <select className="input" required>
                    <option>Motorcycle</option>
                    <option>Bicycle</option>
                    <option>Car</option>
                    <option>Big Delivery Van</option>
                    <option>Pickup Truck</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>License Plate (If applicable)</label>
                <input type="text" className="input" placeholder="e.g. BZ 1234" />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                Register Driver
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
