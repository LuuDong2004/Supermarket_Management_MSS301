// pages/Dashboard/Account/AccountSettingsPage.jsx
import React, { useState } from 'react';

export default function AccountSettingsPage() {
  const [profile, setProfile] = useState({
    firstName: 'Lucas',
    lastName: 'Ethan',
    email: 'lucas@gotpos.com',
    phone: '+1 (555) 019-2834',
    birthday: '1992-04-15',
    gender: 'Male',
    storeName: 'Main POS Branch',
    role: 'Store Manager',
    address: '128 Av. de Mayo',
    city: 'Buenos Aires',
    country: 'Argentina',
    bio: 'Store Manager with 5+ years of experience in retail inventory and POS operations.'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Profile settings saved successfully!');
  };

  return (
    <div className="row g-4">
      {/* Left side: Avatar details */}
      <div className="col-lg-4">
        <div className="card h-100">
          <div className="card-header">
            <h5 className="card-title mb-0">Profile Picture</h5>
          </div>
          <div className="card-body text-center d-flex flex-column align-items-center justify-content-center">
            <div className="position-relative mb-3">
              <img src="/assets/user-71-RNjOCE17.png" alt="Avatar" className="rounded-circle border" style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
              <button type="button" className="btn btn-sm btn-primary btn-icon rounded-circle position-absolute bottom-0 end-0 size-8 border border-white">
                <i className="ri-camera-fill"></i>
              </button>
            </div>
            <h6 className="mb-1">{profile.firstName} {profile.lastName}</h6>
            <p className="text-muted fs-sm mb-4">{profile.role}</p>
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-primary btn-sm">Upload New</button>
              <button type="button" className="btn btn-outline-danger btn-sm">Delete</button>
            </div>
            <p className="text-muted fs-xs mt-3 mb-0">Allowed JPG, GIF or PNG. Max size of 800kB</p>
          </div>
        </div>
      </div>

      {/* Right side: Form settings */}
      <div className="col-lg-8">
        <div className="card h-100">
          <div className="card-header">
            <h5 className="card-title mb-0">Account Information</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">First Name</label>
                  <input type="text" className="form-control" name="firstName" value={profile.firstName} onChange={handleInputChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Last Name</label>
                  <input type="text" className="form-control" name="lastName" value={profile.lastName} onChange={handleInputChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-control" name="email" value={profile.email} onChange={handleInputChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone Number</label>
                  <input type="text" className="form-control" name="phone" value={profile.phone} onChange={handleInputChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Store Name</label>
                  <input type="text" className="form-control" name="storeName" value={profile.storeName} disabled />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Role</label>
                  <input type="text" className="form-control" name="role" value={profile.role} disabled />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Birthday</label>
                  <input type="date" className="form-control" name="birthday" value={profile.birthday} onChange={handleInputChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Gender</label>
                  <select className="form-select" name="gender" value={profile.gender} onChange={handleInputChange}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label">Address</label>
                  <input type="text" className="form-control" name="address" value={profile.address} onChange={handleInputChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">City</label>
                  <input type="text" className="form-control" name="city" value={profile.city} onChange={handleInputChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Country</label>
                  <input type="text" className="form-control" name="country" value={profile.country} onChange={handleInputChange} />
                </div>
                <div className="col-12">
                  <label className="form-label">Bio</label>
                  <textarea className="form-control" name="bio" rows="3" value={profile.bio} onChange={handleInputChange}></textarea>
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-light">Discard Changes</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
