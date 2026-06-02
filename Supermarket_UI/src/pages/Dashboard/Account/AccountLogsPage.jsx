// pages/Dashboard/Account/AccountLogsPage.jsx
import React, { useState } from 'react';

const initialLogs = [
  { id: 1, time: '2026-06-01 10:24:15', event: 'User login successful', module: 'Authentication', ip: '192.168.1.45', status: 'Success', details: 'Chrome on Windows 11' },
  { id: 2, time: '2026-06-01 09:45:00', event: 'POS cash register closed', module: 'POS Register', ip: '192.168.1.45', status: 'Success', details: 'Register total: $14,250.00' },
  { id: 3, time: '2026-05-31 16:12:08', event: 'Stock adjusted manually (iPhone 15)', module: 'Inventory', ip: '192.168.1.45', status: 'Success', details: 'Qty changed from 2 to 12' },
  { id: 4, time: '2026-05-31 08:30:12', event: 'Failed login attempt', module: 'Authentication', ip: '185.220.101.4', status: 'Failed', details: 'Wrong password entered' },
  { id: 5, time: '2026-05-30 11:00:22', event: 'Supplier profile deleted', module: 'Suppliers', ip: '192.168.1.102', status: 'Success', details: 'Supplier ID: 15' },
  { id: 6, time: '2026-05-30 10:15:30', event: 'Role permissions updated (Cashier)', module: 'Staff / Role', ip: '192.168.1.102', status: 'Success', details: 'Modified POS checkout permission' }
];

export default function AccountLogsPage() {
  const [logs, setLogs] = useState(initialLogs);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');

  const handleClearLogs = () => {
    if (confirm('Are you sure you want to clear all activity logs? This action cannot be undone.')) {
      setLogs([]);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.event.toLowerCase().includes(search.toLowerCase()) || 
                          log.details.toLowerCase().includes(search.toLowerCase()) || 
                          log.ip.toLowerCase().includes(search.toLowerCase());
    const matchesModule = moduleFilter === 'all' || log.module === moduleFilter;
    return matchesSearch && matchesModule;
  });

  const modules = Array.from(new Set(logs.map(log => log.module)));

  return (
    <div className="card">
      <div className="card-header d-flex flex-wrap gap-3 justify-content-between align-items-center">
        <h5 className="card-title mb-0">Security & Activity Logs</h5>
        <div className="d-flex flex-wrap gap-2 align-items-center ms-auto">
          <div className="position-relative">
            <input type="text" className="form-control ps-9" placeholder="Search event, IP, device..." value={search} onChange={e => setSearch(e.target.value)} />
            <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-3 translate-middle-y"></i>
          </div>
          <select className="form-select w-36" value={moduleFilter} onChange={e => setModuleFilter(e.target.value)}>
            <option value="all">All Modules</option>
            {modules.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <button type="button" className="btn btn-outline-danger" onClick={handleClearLogs} disabled={logs.length === 0}>
            <i className="ri-delete-bin-line me-1"></i> Clear Logs
          </button>
        </div>
      </div>
      <div className="card-body pt-0">
        <div className="table-card table-responsive">
          <table className="table align-middle text-nowrap mb-0">
            <thead>
              <tr className="bg-light border-bottom">
                <th>Timestamp</th>
                <th>Event / Action</th>
                <th>Module</th>
                <th>IP Address</th>
                <th>Status</th>
                <th>Additional Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">No activity logs recorded.</td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id}>
                    <td><span className="text-muted">{log.time}</span></td>
                    <td><span className="fw-semibold text-reset">{log.event}</span></td>
                    <td><span className="badge bg-light border text-muted">{log.module}</span></td>
                    <td><code>{log.ip}</code></td>
                    <td>
                      <span className={`badge bg-${log.status === 'Success' ? 'success' : 'danger'}-subtle text-${log.status === 'Success' ? 'success' : 'danger'}`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="text-wrap" style={{ maxWidth: '250px' }}>{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
