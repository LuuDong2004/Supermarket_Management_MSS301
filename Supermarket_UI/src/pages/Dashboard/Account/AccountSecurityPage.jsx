// pages/Dashboard/Account/AccountSecurityPage.jsx
import React, { useState } from 'react';

export default function AccountSecurityPage() {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [tfaEnabled, setTfaEnabled] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('New password and confirmation do not match!');
      return;
    }
    alert('Password updated successfully!');
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const sessions = [
    { id: 1, device: 'Chrome on Windows 11', ip: '192.168.1.45', location: 'Buenos Aires, AR', status: 'Current Session' },
    { id: 2, device: 'Safari on iPhone 15 Pro', ip: '192.168.1.102', location: 'Buenos Aires, AR', status: 'Active 2 hours ago' },
    { id: 3, device: 'Firefox on macOS Sonoma', ip: '185.220.101.4', location: 'Miami, USA', status: 'Active 3 days ago' }
  ];

  return (
    <div className="row g-4">
      {/* Change Password Card */}
      <div className="col-lg-6">
        <div className="card h-100">
          <div className="card-header">
            <h5 className="card-title mb-0">Change Password</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-3">
                <label className="form-label">Current Password</label>
                <input type="password" name="currentPassword" value={passwords.currentPassword} onChange={handlePasswordChange} className="form-control" placeholder="••••••••" required />
              </div>
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input type="password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} className="form-control" placeholder="••••••••" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Confirm New Password</label>
                <input type="password" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordChange} className="form-control" placeholder="••••••••" required />
              </div>
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="submit" className="btn btn-primary">Update Password</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication (2FA) */}
      <div className="col-lg-6">
        <div className="card h-100">
          <div className="card-header">
            <h5 className="card-title mb-0">Two-Factor Authentication</h5>
          </div>
          <div className="card-body d-flex flex-column justify-content-between">
            <div>
              <p className="text-muted">Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to log in.</p>
              <div className="d-flex align-items-center gap-3 p-3 border rounded mb-4 bg-light bg-opacity-50">
                <div className={`avatar size-10 rounded d-flex align-items-center justify-content-center bg-${tfaEnabled ? 'success' : 'warning'}-subtle text-${tfaEnabled ? 'success' : 'warning'}`}>
                  <i className={`ri-${tfaEnabled ? 'shield-keyhole-fill' : 'shield-warning-line'} fs-20`}></i>
                </div>
                <div>
                  <h6 className="mb-1">Authenticator App</h6>
                  <p className="text-muted fs-sm mb-0">Status: {tfaEnabled ? 'Enabled' : 'Disabled'}</p>
                </div>
                <div className="form-switch switch-light-primary ms-auto d-flex">
                  <input type="checkbox" className="form-check-input cursor-pointer" checked={tfaEnabled} onChange={() => setTfaEnabled(!tfaEnabled)} />
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-primary" onClick={() => alert('Configuration QR code will be generated.')} disabled={!tfaEnabled}>Configure 2FA</button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="col-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">Device Sessions</h5>
            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => alert('Logged out from all other sessions.')}>Log Out All Other Devices</button>
          </div>
          <div className="card-body pt-0">
            <div className="table-card table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr className="bg-light border-bottom">
                    <th>Device</th>
                    <th>IP Address</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th className="text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map(s => (
                    <tr key={s.id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <i className={`ri-${s.device.includes('Windows') ? 'windows-line' : s.device.includes('macOS') ? 'mac-line' : 'phone-line'} fs-18 text-muted`}></i>
                          <span className="fw-medium">{s.device}</span>
                        </div>
                      </td>
                      <td>{s.ip}</td>
                      <td>{s.location}</td>
                      <td>
                        <span className={`badge bg-${s.status === 'Current Session' ? 'success' : 'secondary'}-subtle text-${s.status === 'Current Session' ? 'success' : 'secondary'}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <button type="button" className="btn btn-sm btn-link text-danger" onClick={() => alert(`Revoked session ID: ${s.id}`)} disabled={s.status === 'Current Session'}>
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
