// pages/Dashboard/Apps/MailboxPage.jsx
import React, { useEffect, useState } from 'react';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialEmails = [
  { id: 1, sender: 'Sophia Miller', email: 'sophia.m@gotpos.com', subject: 'Urgent: Stock Audit Report - June 2026', preview: 'Please review the attached Excel spreadsheet for the stock valuation audit of Main Branch.', date: '10:24 AM', read: false, folder: 'inbox', label: 'Business' },
  { id: 2, sender: 'Stripe Payment', email: 'billing@stripe.com', subject: 'Your GotPOS Subscription Invoice', preview: 'We successfully charged $49.00 to your Visa ending in 4242 for the GotPOS Premium Plan.', date: 'Yesterday', read: true, folder: 'inbox', label: 'Important' },
  { id: 3, sender: 'Jackson Davis', email: 'jackson@gotpos.com', subject: 'Shift Change Request for Counter 2', preview: 'Hey Lucas, I need to request a shift swap for this Friday with Sophia.', date: 'May 30', read: true, folder: 'inbox', label: 'Personal' },
  { id: 4, sender: 'You (Lucas)', email: 'lucas@gotpos.com', subject: 'Purchase Order PO-9923 Sent', preview: 'Attached is the signed purchase order for Nike shoes shipment.', date: 'May 28', read: true, folder: 'sent', label: 'Business' },
  { id: 5, sender: 'Logitech Supply', email: 'supply@logitech.com', subject: 'Shipment Tracking Info - Batch 77401', preview: 'Your shipment of 200 Logitech MX Master 3S has been dispatched and is tracking via DHL.', date: 'May 25', read: true, folder: 'inbox', label: 'Business' }
];

export default function MailboxPage() {
  const [emails, setEmails] = useState(initialEmails);
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [selectedEmailId, setSelectedEmailId] = useState(null);
  const [search, setSearch] = useState('');

  // Compose Modal State
  const [showCompose, setShowCompose] = useState(false);
  const [composeForm, setComposeForm] = useState({ to: '', subject: '', body: '', label: 'Business' });

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [showCompose, selectedEmailId, activeFolder]);

  const handleEmailClick = (email) => {
    setSelectedEmailId(email.id);
    // Mark as read
    setEmails(prev => prev.map(e => e.id === email.id ? { ...e, read: true } : e));
  };

  const handleComposeChange = (e) => {
    const { name, value } = e.target;
    setComposeForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    if (!composeForm.to || !composeForm.subject || !composeForm.body) {
      alert('Please fill in all fields.');
      return;
    }

    const newMail = {
      id: Date.now(),
      sender: 'You (Lucas)',
      email: 'lucas@gotpos.com',
      subject: composeForm.subject,
      preview: composeForm.body.substring(0, 100) + '...',
      date: 'Just now',
      read: true,
      folder: 'sent',
      label: composeForm.label
    };

    setEmails([newMail, ...emails]);
    setShowCompose(false);
    setComposeForm({ to: '', subject: '', body: '', label: 'Business' });
    alert('Email sent successfully!');
  };

  const handleDeleteEmail = (id) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, folder: 'trash' } : e));
    setSelectedEmailId(null);
  };

  const unreadCount = emails.filter(e => e.folder === 'inbox' && !e.read).length;

  const filteredEmails = emails.filter(e => {
    const matchesFolder = e.folder === activeFolder;
    const matchesSearch = e.sender.toLowerCase().includes(search.toLowerCase()) || 
                          e.subject.toLowerCase().includes(search.toLowerCase()) || 
                          e.preview.toLowerCase().includes(search.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const selectedEmail = emails.find(e => e.id === selectedEmailId);

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Mailbox" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Apps' }, { label: 'Mailbox' }]} />

      <div className="card overflow-hidden" style={{ height: 'calc(100vh - 220px)' }}>
        <div className="row g-0 h-100">
          
          {/* 1. Folders Navigation Column (col-lg-2) */}
          <div className="col-lg-2 border-end h-100 bg-light bg-opacity-25 p-3 d-flex flex-column gap-3">
            <button type="button" className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-1" onClick={() => setShowCompose(true)}>
              <i className="ri-edit-2-line"></i> Compose
            </button>

            <div className="nav flex-column nav-pills mt-2">
              <button className={`nav-link text-start d-flex justify-content-between align-items-center py-2 ${activeFolder === 'inbox' ? 'active' : 'text-reset'}`} onClick={() => { setActiveFolder('inbox'); setSelectedEmailId(null); }}>
                <span><i className="ri-inbox-line me-2"></i> Inbox</span>
                {unreadCount > 0 && <span className="badge bg-danger rounded-pill fs-xs">{unreadCount}</span>}
              </button>
              <button className={`nav-link text-start py-2 ${activeFolder === 'sent' ? 'active' : 'text-reset'}`} onClick={() => { setActiveFolder('sent'); setSelectedEmailId(null); }}>
                <span><i className="ri-send-plane-2-line me-2"></i> Sent</span>
              </button>
              <button className={`nav-link text-start py-2 ${activeFolder === 'trash' ? 'active' : 'text-reset'}`} onClick={() => { setActiveFolder('trash'); setSelectedEmailId(null); }}>
                <span><i className="ri-delete-bin-line me-2"></i> Trash</span>
              </button>
            </div>

            <div className="border-top pt-3 mt-auto">
              <h6 className="fw-semibold text-muted mb-2 fs-xs text-uppercase">Labels</h6>
              <div className="vstack gap-2">
                <span className="d-flex align-items-center gap-2 fs-sm"><span className="size-2 bg-primary rounded-circle"></span> Business</span>
                <span className="d-flex align-items-center gap-2 fs-sm"><span className="size-2 bg-warning rounded-circle"></span> Important</span>
                <span className="d-flex align-items-center gap-2 fs-sm"><span className="size-2 bg-success rounded-circle"></span> Personal</span>
              </div>
            </div>
          </div>

          {/* 2. Emails List Column (col-lg-5 hoặc col-lg-10 tùy trạng thái đọc email) */}
          <div className={`${selectedEmailId ? 'col-lg-4' : 'col-lg-10'} border-end h-100 d-flex flex-column`}>
            <div className="p-3 border-bottom d-flex align-items-center">
              <div className="position-relative w-100">
                <input type="text" className="form-control ps-9" placeholder="Search emails..." value={search} onChange={e => setSearch(e.target.value)} />
                <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-3 translate-middle-y"></i>
              </div>
            </div>

            <div className="flex-grow-1 overflow-y-auto">
              <div className="list-group list-group-flush">
                {filteredEmails.length === 0 ? (
                  <div className="text-center py-5 text-muted">No emails in this folder.</div>
                ) : (
                  filteredEmails.map(mail => {
                    const isActive = mail.id === selectedEmailId;
                    return (
                      <button key={mail.id} className={`list-group-item list-group-item-action p-3 border-0 border-bottom rounded-0 d-flex flex-column gap-1 ${isActive ? 'bg-light' : ''} ${!mail.read ? 'fw-bold bg-light bg-opacity-25' : ''}`} onClick={() => handleEmailClick(mail)}>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fs-sm text-truncate text-reset" style={{ maxWidth: '180px' }}>{mail.sender}</span>
                          <span className="text-muted fs-xs font-normal fw-normal">{mail.date}</span>
                        </div>
                        <h6 className="mb-0 text-truncate fs-14">{mail.subject}</h6>
                        <p className="mb-0 text-muted fs-xs text-truncate fw-normal">{mail.preview}</p>
                        <div className="d-flex align-items-center gap-2 mt-1">
                          <span className={`badge bg-${
                            mail.label === 'Business' ? 'primary' :
                            mail.label === 'Important' ? 'warning' : 'success'
                          }-subtle text-${
                            mail.label === 'Business' ? 'primary' :
                            mail.label === 'Important' ? 'warning' : 'success'
                          }`} style={{ fontSize: '10px' }}>
                            {mail.label}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* 3. Detailed Email Content Column (col-lg-6 - Chỉ hiển thị khi có email được click) */}
          {selectedEmailId && selectedEmail && (
            <div className="col-lg-6 h-100 d-flex flex-column">
              <div className="p-3 border-bottom d-flex align-items-center justify-content-between bg-light bg-opacity-10">
                <div className="d-flex align-items-center gap-2">
                  <button type="button" className="btn btn-sm btn-icon btn-light" onClick={() => setSelectedEmailId(null)}><i className="ri-close-line"></i></button>
                  <h6 className="mb-0 fw-semibold text-truncate" style={{ maxWidth: '300px' }}>{selectedEmail.subject}</h6>
                </div>
                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-sm btn-icon btn-light-danger" onClick={() => handleDeleteEmail(selectedEmail.id)} disabled={selectedEmail.folder === 'trash'}><i className="ri-delete-bin-line"></i></button>
                  <button type="button" className="btn btn-sm btn-icon btn-light" onClick={() => alert('Reply')}><i className="ri-reply-line"></i></button>
                </div>
              </div>

              <div className="flex-grow-1 p-4 overflow-y-auto">
                <div className="d-flex align-items-center gap-3 border-bottom pb-3 mb-3">
                  <div className="avatar size-10 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold">
                    {selectedEmail.sender.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h6 className="mb-0 fw-semibold">{selectedEmail.sender}</h6>
                    <span className="text-muted fs-xs">&lt;{selectedEmail.email}&gt;</span>
                  </div>
                  <span className="ms-auto text-muted fs-xs">{selectedEmail.date}</span>
                </div>

                <div className="email-body fs-14 text-dark lh-lg" style={{ whiteSpace: 'pre-line' }}>
                  {selectedEmail.preview}
                  
                  {`\n\nBest regards,\n${selectedEmail.sender}`}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Compose Email Modal */}
      {showCompose && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">New Email</h5>
                <button type="button" className="btn-close" onClick={() => setShowCompose(false)}></button>
              </div>
              <form onSubmit={handleSendEmail}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">To <span className="text-danger">*</span></label>
                    <input type="email" className="form-control" name="to" placeholder="recipient@example.com" value={composeForm.to} onChange={handleComposeChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Subject <span className="text-danger">*</span></label>
                    <input type="text" className="form-control" name="subject" placeholder="Enter subject..." value={composeForm.subject} onChange={handleComposeChange} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Label</label>
                    <select className="form-select" name="label" value={composeForm.label} onChange={handleComposeChange}>
                      <option value="Business">Business</option>
                      <option value="Important">Important</option>
                      <option value="Personal">Personal</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Message <span className="text-danger">*</span></label>
                    <textarea className="form-control" name="body" rows="8" placeholder="Type your email here..." value={composeForm.body} onChange={handleComposeChange} required></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-light" onClick={() => setShowCompose(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary d-flex align-items-center gap-1">
                    Send <i className="ri-send-plane-fill"></i>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
