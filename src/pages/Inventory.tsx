import { useState } from 'react';
import { UploadCloud, FileSpreadsheet, CheckCircle } from 'lucide-react';

export default function Inventory() {
  const [isUploaded, setIsUploaded] = useState(false);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Bulk Inventory Upload</h1>
        <p className="page-subtitle">Upload CSV files to batch update produce prices and local inventory.</p>
      </div>

      {!isUploaded ? (
        <div className="glass-panel" style={{ padding: '64px 24px', textAlign: 'center', border: '2px dashed var(--primary-light)', cursor: 'pointer' }} onClick={() => setIsUploaded(true)}>
           <div style={{ width: 80, height: 80, background: 'var(--bg-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto', color: 'var(--primary)' }}>
             <UploadCloud size={40} />
           </div>
           <h3 style={{ fontSize: 20, marginBottom: 8 }}>Drag & Drop your CSV file here</h3>
           <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Supports standard Malawian farm inventory sheets.</p>
           <button className="btn btn-primary">Browse Files</button>
        </div>
      ) : (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(16, 185, 129, 0.05)', borderColor: 'var(--success)' }}>
             <CheckCircle size={32} color="var(--success)" />
             <div>
                <h3 style={{ fontSize: 18, color: 'var(--success)' }}>chigumula_farms_august.csv successfully parsed!</h3>
                <p style={{ color: 'var(--text-secondary)' }}>45 items found. Review below before committing.</p>
             </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Category</th>
                    <th>Stock Qty</th>
                    <th>Unit Price (MWK)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 600 }}><FileSpreadsheet size={16} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle', color: 'var(--text-secondary)'}} />Tomatoes (Local)</td>
                    <td>Vegetables</td>
                    <td>500 kg</td>
                    <td>1,200 / kg</td>
                    <td><span className="badge badge-success">Ready</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}><FileSpreadsheet size={16} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle', color: 'var(--text-secondary)'}} />Irish Potatoes</td>
                    <td>Root Tubers</td>
                    <td>1200 kg</td>
                    <td>900 / kg</td>
                    <td><span className="badge badge-success">Ready</span></td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}><FileSpreadsheet size={16} style={{ display: 'inline', marginRight: 8, verticalAlign: 'middle', color: 'var(--text-secondary)'}} />Maize Flour (Ufa)</td>
                    <td>Grains</td>
                    <td>200 bags</td>
                    <td>15,000 / bag</td>
                    <td><span className="badge badge-pending">Price Change</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
               <button className="btn btn-outline" onClick={() => setIsUploaded(false)}>Cancel</button>
               <button className="btn btn-primary" onClick={() => alert('Inventory Synced!')}>Commit to Database</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
