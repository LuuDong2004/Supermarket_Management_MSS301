import React, { useState, useEffect } from 'react';
import { ROUTES } from '../../../configs/routes';

export default function ProfilePage() {
  // Tabs: 'overview', 'activity', 'followers', 'documents', 'notes', 'projects'
  const [activeTab, setActiveTab] = useState('overview');
  const [offlineMode, setOfflineMode] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // Profile info state
  const [profile, setProfile] = useState({
    name: 'Lucas Ethan',
    role: 'Store Manager · Main Branch',
    location: 'Buenos Aires, Argentina',
    joinDate: '24 April, 2024',
    avatar: '/assets/user-71-RNjOCE17.png',
    email: 'lucas@gotpos.com',
    phone: '+(151) 1555 333 222',
    website: 'www.gotpos.com'
  });

  // Followers state
  const [followers, setFollowers] = useState([
    { id: 1, name: 'Christina Williams', email: 'christina@example.com', phone: '+(546) 01234 567 89', avatar: '/assets/user-13-NgroKY8u.png', isFollowing: false },
    { id: 2, name: 'Thomas Blamer', email: 'thomas@example.com', phone: '651-705-2653', avatar: '/assets/user-14-BWimhkHc.png', isFollowing: true },
    { id: 3, name: 'Patricia Graham', email: 'pg@example.com', phone: '704-316-0398', avatar: '/assets/user-15-Bm8xnKEs.png', isFollowing: false },
    { id: 4, name: 'Patricia Graham', email: 'patricia@example.com', phone: '952-542-3403', avatar: '/assets/user-19-uC8d_L1u.png', isFollowing: false },
    { id: 5, name: 'Jerome Bell', email: 'jerome@example.com', phone: '302-555-0107', avatar: '/assets/user-12-CfsiEgBV.png', isFollowing: true }
  ]);

  // Notes state
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: 'POS Operations Review',
      author: 'Store Manager',
      date: '2 May, 2024',
      content: 'Review daily POS activities including billing accuracy, cashier performance, and terminal status. Discuss peak-hour transaction handling, resolve system issues, and align staff on smooth checkout operations to ensure fast, error-free customer experiences.',
      image: null
    },
    {
      id: 2,
      title: 'Daily Sales & Inventory Summary',
      author: 'POS Supervisor',
      date: '02:54 PM',
      content: 'This POS note highlights today’s sales performance, best-selling products, and inventory status. It includes low-stock alerts, restock recommendations, and item movement insights to help maintain optimal inventory levels and avoid sales disruptions.',
      image: '/assets/img-01-CIcfpw9H.jpg'
    },
    {
      id: 3,
      title: 'POS Performance & Strategy Notes',
      author: 'Admin',
      date: '06:33 PM',
      content: 'The POS review session provided clear visibility into store revenue, transaction efficiency, and operational gaps. Key decisions were made to improve billing speed, reduce errors, and optimize inventory management using POS insights.',
      bullets: [
        'Daily Sales Report Review',
        'Top-Selling Items Analysis',
        'Low Stock & Reorder Alerts',
        'Cashier Performance Overview',
        'Discount & Promotion Impact',
        'POS Optimization Action Items'
      ],
      image: null
    }
  ]);

  // Note form state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteImage, setNoteImage] = useState(null);
  const [editingNoteId, setEditingNoteId] = useState(null);

  // Documents filters
  const [docFilterAuthor, setDocFilterAuthor] = useState(true);
  const [docFilterCustomer, setDocFilterCustomer] = useState(true);
  const [docSearchQuery, setDocSearchQuery] = useState('');

  // Folders and Files static data (can search/filter)
  const folders = [
    { id: 1, name: 'Sales Reports 2024', filesCount: 23, size: '128 MB' },
    { id: 2, name: 'Customer Records', filesCount: 49, size: '27 MB' },
    { id: 3, name: 'Inventory Analysis', filesCount: 3, size: '5.65 MB' },
    { id: 4, name: 'Receipts & Invoices', filesCount: 163, size: '0.9 GB' },
    { id: 5, name: 'POS System Logs', filesCount: 149, size: '68.83 GB' }
  ];

  const docFiles = [
    { id: 1, name: 'daily-sales-report.pdf', size: '4 KB', type: 'pdf' },
    { id: 2, name: 'cashier-shift-summary.xlsx', size: '2 KB', type: 'xlsx' },
    { id: 3, name: 'inventory-stock-levels.csv', size: '5 KB', type: 'csv' },
    { id: 4, name: 'tax-discount-rules.pdf', size: '5 KB', type: 'pdf' },
    { id: 5, name: 'pos-terminal-audit-log.txt', size: '129 KB', type: 'txt' }
  ];

  // Activities state
  const [activityFilter, setActivityFilter] = useState({
    all: true,
    sales: true,
    reports: true,
    staff: true,
    inventory: true,
    terminals: true,
    alerts: true
  });

  const [activities, setActivities] = useState([
    { id: 1, type: 'sales', time: '02:35 PM', title: 'New POS Sale', desc: 'A completed transaction at Main Branch for Order #POS-10452 totaling $1,249.75', icon: 'shopping-bag', color: 'success' },
    { id: 2, type: 'staff', time: '12:59 PM', title: 'Cashier Issue Reported', desc: '@jerome reported a billing discrepancy on terminal POS-03. The total amount did not match the printed receipt during checkout.', tags: ['#billing', '#pos-terminal'], acknowledges: 2, notes: 6, color: 'warning' },
    { id: 3, type: 'terminals', time: '10:27 AM', title: 'POS Terminal Status Updated', desc: 'Terminal POS-02 marked as Online', icon: 'monitor-dot', color: 'primary' },
    { id: 4, type: 'inventory', time: 'Yesterday 03:41 AM', title: 'Inventory Adjustment Comment', desc: 'Stock levels for multiple SKUs were manually adjusted after the nightly stock count. Recommended syncing warehouse.', comment: true, color: 'info' },
    { id: 5, type: 'reports', time: 'Yesterday 11:59 AM', title: 'Daily POS Reports Uploaded', desc: 'Added 2 reports generated by Main Branch POS', files: [{ name: 'daily-sales-report.pdf', size: '62 KB' }, { name: 'cashier-summary.txt', size: '1.8 MB' }], color: 'info' }
  ]);

  // Projects static list
  const projects = [
    { id: 1, name: 'Chat App Templates', desc: 'Chat applications typically run on centralized networks that are served by platform operator servers as opposed to peer-to-peer protocols such as XMPP. This allows two people to talk to each other in real time.', tag: '#Features', views: 148, team: ['/assets/user-2-CroG7YJ0.png', '/assets/user-3-Bz6g7hsE.png'], color: 'info', icon: 'messages-square' },
    { id: 2, name: 'GotPOS - Admin & Dashboard Templates', desc: 'An admin dashboard template is a powerful tool that streamlines the process of building a robust and user-friendly admin panel for web applications. It provides a pre-designed interface with various components.', tag: '#Admin', views: 74, team: ['/assets/user-5-BsT8d_Co.png', '/assets/user-20-BaxQ31Jt.png', '/assets/user-13-NgroKY8u.png'], color: 'pink', icon: 'box' },
    { id: 3, name: 'Employee Management System', desc: 'Employee management is the process by which employers ensure workers perform their jobs to the best of their abilities so as to achieve business goals. It typically entails building and maintaining healthy relationships.', tag: '#Management', views: 179, team: ['/assets/user-15-Bm8xnKEs.png', '/assets/user-19-uC8d_L1u.png'], color: 'success', icon: 'users' }
  ];

  // Re-init lucide icons on render/tab change
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [activeTab, isFollowed, notes, followers, offlineMode]);

  // Handle follow toggle
  const handleFollowToggle = () => {
    setFollowLoading(true);
    setTimeout(() => {
      setIsFollowed(!isFollowed);
      setFollowLoading(false);
    }, 400);
  };

  // Handle individual follower toggle
  const handleFollowerFollowToggle = (id) => {
    setFollowers(followers.map(f => f.id === id ? { ...f, isFollowing: !f.isFollowing } : f));
  };

  // Create or Update Note
  const handleNoteSubmit = (e) => {
    e.preventDefault();
    if (!noteTitle || !noteContent) return;

    if (editingNoteId !== null) {
      // Edit
      setNotes(notes.map(n => n.id === editingNoteId ? {
        ...n,
        title: noteTitle,
        content: noteContent,
        image: noteImage || n.image
      } : n));
      setEditingNoteId(null);
    } else {
      // Create new
      const newNote = {
        id: Date.now(),
        title: noteTitle,
        author: 'Store Manager',
        date: 'Just now',
        content: noteContent,
        image: noteImage || null
      };
      setNotes([newNote, ...notes]);
    }

    // Reset form
    setNoteTitle('');
    setNoteContent('');
    setNoteImage(null);
  };

  // Edit note trigger
  const handleEditNote = (note) => {
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setEditingNoteId(note.id);
    // Scroll to form
    const formElement = document.getElementById('noteFormCard');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Delete note
  const handleDeleteNote = (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(n => n.id !== id));
    }
  };

  // File Upload placeholder handler for notes
  const handleNoteImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Just mock as a local asset url or base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setNoteImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Filtered documents files
  const filteredDocFiles = docFiles.filter(file => {
    return file.name.toLowerCase().includes(docSearchQuery.toLowerCase());
  });

  return (
    <div className="container-fluid">
      {/* Profile Banner */}
      <div className="position-relative">
        <div className="main-profile-bg position-relative">
          <div className="size-48 square-1"></div>
          <div className="profile-bg bg-primary-subtle" style={{ height: '180px', borderRadius: '8px' }}></div>
          <img src="/assets/user-14-BWimhkHc.png" alt="Avatar" className="avatar-1 size-16 rounded-circle d-none d-md-block" style={{ position: 'absolute', bottom: '15px', left: '20px', border: '3px solid white' }} />
          <img src="/assets/user-54-BgoCiuFl.png" alt="Avatar" className="avatar-2 size-16 rounded-circle d-none d-md-block" style={{ position: 'absolute', top: '20px', right: '40px', border: '3px solid white' }} />
          <img src="/assets/user-57-BgWfHmFH.png" alt="Avatar" className="avatar-3 size-16 rounded-circle d-none d-md-block" style={{ position: 'absolute', bottom: '30px', right: '120px', border: '3px solid white' }} />
          <div className="row g-0 d-none d-md-block" style={{ position: 'absolute', bottom: '10px', left: '100px' }}>
            <div className="col-12">
              <h5 className="fw-medium text-white line-clamp-2 lh-base overflow-hidden px-4" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}>
                A powerful POS admin dashboard to manage sales, inventory, and daily store operations
              </h5>
            </div>
          </div>
        </div>

        {/* Profile Card Header */}
        <div className="card border-0 border-bottom rounded-0 user-card mb-4">
          <div className="card-body px-6 pb-0">
            <div className="d-flex flex-wrap gap-3 justify-content-between align-items-end mb-3">
              <img src={profile.avatar} loading="lazy" alt="Avatar" className="size-36 mt-n28 rounded-5 border border-5 border-light" style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
              <div className="d-flex flex-wrap align-items-center gap-3">
                <div className="border py-1 px-2 d-flex align-items-center gap-3 h-100 rounded bg-body-tertiary">
                  <i className="ri-error-warning-fill text-secondary fs-xl"></i>
                  <p className="mb-0 fs-14 fw-medium">POS Offline Mode</p>
                  <div className="form-switch switch-light-primary my-auto d-flex">
                    <input
                      type="checkbox"
                      id="switch-light-1"
                      className="form-check-input"
                      checked={offlineMode}
                      onChange={(e) => setOfflineMode(e.target.checked)}
                    />
                    <label className="label" htmlFor="switch-light-1"></label>
                  </div>
                </div>
                <a href={ROUTES.POS} target="_blank" rel="noopener noreferrer" className="btn btn-primary py-2 d-flex align-items-center gap-1">
                  <i className="ri-shopping-bag-3-line"></i> Open POS
                </a>
              </div>
            </div>

            <div className="avatar justify-content-start gap-1 mb-1 d-flex align-items-center">
              <h5 className="mt-2 mb-1 fw-bold">{profile.name}</h5>
              <i data-lucide="badge-check" className="size-5 text-primary stroke-2"></i>
            </div>

            <ul className="text-muted avatar justify-content-start gap-4 flex-wrap ps-0 mb-5 d-flex list-unstyled">
              <li className="d-flex align-items-center gap-2">
                <i data-lucide="building-2" className="size-4"></i>
                <span>{profile.role}</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <i data-lucide="map-pin" className="size-4"></i>
                <span>{profile.location}</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <i data-lucide="calendar-days" className="size-4"></i>
                <span>Joined on {profile.joinDate}</span>
              </li>
            </ul>

            <div className="d-flex flex-wrap justify-content-between align-items-center gap-4 mb-4 border-top pt-3">
              <div className="d-flex flex-wrap gap-3 align-items-center">
                <div className="py-6px px-3 border rounded bg-light fs-13">
                  <i className="ri-calendar-fill me-2 text-primary"></i>Last Login: May 17, 2025 | 10:00 AM
                </div>
                <div className="py-6px px-3 text-white bg-primary border-primary border rounded fs-13">
                  9 Active Staff
                </div>
              </div>
              <div className="d-flex flex-wrap gap-2 align-items-center">
                <span className="link link-custom-primary py-6px px-3 border rounded bg-light fs-13">http://localhost:8080/index.html</span>
                <button type="button" className="btn btn-indigo btn-icon size-9 rounded-circle"><i className="ri-facebook-fill fs-14"></i></button>
                <button type="button" className="btn btn-pink btn-icon size-9 rounded-circle"><i className="ri-instagram-fill fs-14"></i></button>
                <button type="button" className="btn btn-info btn-icon size-9 rounded-circle"><i className="ri-twitter-fill fs-14"></i></button>
              </div>
            </div>

            {/* Underline Tabs */}
            <div className="border-top">
              <ul className="nav nav-underline gap-1 gap-lg-4 border-0">
                <li className="nav-item">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`nav-link border-0 bg-transparent py-3 px-2 d-flex align-items-center gap-2 ${activeTab === 'overview' ? 'active text-primary fw-semibold' : 'text-muted'}`}
                  >
                    <i data-lucide="eye" className="size-4"></i> Overview
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    onClick={() => setActiveTab('activity')}
                    className={`nav-link border-0 bg-transparent py-3 px-2 d-flex align-items-center gap-2 ${activeTab === 'activity' ? 'active text-primary fw-semibold' : 'text-muted'}`}
                  >
                    <i data-lucide="sparkles" className="size-4"></i> Activity
                  </button>
                </li>
                <li class="nav-item">
                  <button
                    onClick={() => setActiveTab('followers')}
                    className={`nav-link border-0 bg-transparent py-3 px-2 d-flex align-items-center gap-2 ${activeTab === 'followers' ? 'active text-primary fw-semibold' : 'text-muted'}`}
                  >
                    <i data-lucide="user-round" className="size-4"></i> Followers
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    onClick={() => setActiveTab('documents')}
                    className={`nav-link border-0 bg-transparent py-3 px-2 d-flex align-items-center gap-2 ${activeTab === 'documents' ? 'active text-primary fw-semibold' : 'text-muted'}`}
                  >
                    <i data-lucide="file-text" className="size-4"></i> Documents
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    onClick={() => setActiveTab('notes')}
                    className={`nav-link border-0 bg-transparent py-3 px-2 d-flex align-items-center gap-2 ${activeTab === 'notes' ? 'active text-primary fw-semibold' : 'text-muted'}`}
                  >
                    <i data-lucide="list" className="size-4"></i> Notes
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    onClick={() => setActiveTab('projects')}
                    className={`nav-link border-0 bg-transparent py-3 px-2 d-flex align-items-center gap-2 ${activeTab === 'projects' ? 'active text-primary fw-semibold' : 'text-muted'}`}
                  >
                    <i data-lucide="monitor" className="size-4"></i> Projects
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="row">
        
        {/* Left Column Sidebar (Shows on Overview, Notes, v.v. để chứa Introduction và Badges) */}
        {['overview', 'notes'].includes(activeTab) && (
          <div className="col-12 col-xl-4">
            {activeTab === 'overview' && (
              <div className="card mb-4 shadow-sm">
                <div className="card-body text-center py-4">
                  <div className="row g-0 mb-4 text-center">
                    <div className="col border-end">
                      <h6 className="mb-1 fw-bold fs-16">2,459</h6>
                      <p className="text-muted mb-0 fs-13">Followers</p>
                    </div>
                    <div className="col">
                      <h6 className="mb-1 fw-bold fs-16">2,459</h6>
                      <p className="text-muted mb-0 fs-13">Following</p>
                    </div>
                  </div>
                  <button
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    type="button"
                    className={`btn w-100 py-2 d-flex align-items-center justify-content-center gap-2 ${isFollowed ? 'btn-outline-danger' : 'btn-info text-white'}`}
                  >
                    {followLoading ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : isFollowed ? (
                      <>
                        <i className="ri-user-unfollow-line"></i> Unfollow
                      </>
                    ) : (
                      <>
                        <i className="ri-user-add-line"></i> Follow
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Introductions Card */}
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-transparent border-bottom py-3">
                <h6 className="card-title mb-0 fw-semibold text-body">Introductions</h6>
              </div>
              <div className="card-body">
                <p className="mb-4 text-uppercase fs-11 fw-bold text-muted tracking-wider">About</p>
                <div className="mb-3 vstack gap-3">
                  <h6 className="d-flex align-items-center mb-0 fw-medium fs-14">
                    <i data-lucide="monitor" className="size-4 text-muted me-3"></i>
                    <span>{profile.name}</span>
                  </h6>
                  <h6 className="d-flex align-items-center mb-0 fw-medium fs-14">
                    <i data-lucide="briefcase-business" className="size-4 text-muted me-3"></i>
                    <span>{profile.role}</span>
                  </h6>
                  <h6 className="d-flex align-items-center mb-0 fw-medium fs-14">
                    <i data-lucide="map-pin" className="size-4 text-muted me-3"></i>
                    <span>{profile.location}</span>
                  </h6>
                  <h6 className="d-flex align-items-center mb-0 fw-medium fs-14">
                    <i data-lucide="calendar-days" className="size-4 text-muted me-3"></i>
                    <span>{profile.joinDate}</span>
                  </h6>
                </div>

                <div className="pt-4 mt-4 border-top vstack gap-3">
                  <h6 className="d-flex align-items-center mb-0 fw-medium fs-14">
                    <i data-lucide="globe" className="size-4 text-muted me-3"></i>
                    <a href="#!" className="text-body link-primary">{profile.website}</a>
                  </h6>
                  <h6 className="d-flex align-items-center mb-0 fw-medium fs-14">
                    <i data-lucide="mail" className="size-4 text-muted me-3"></i>
                    <a href={`mailto:${profile.email}`} className="text-body">{profile.email}</a>
                  </h6>
                  <h6 className="d-flex align-items-center mb-0 fw-medium fs-14">
                    <i data-lucide="phone" className="size-4 text-muted me-3"></i>
                    <span className="text-body">{profile.phone}</span>
                  </h6>
                  <h6 className="d-flex align-items-center mb-0 fw-medium fs-14">
                    <i data-lucide="twitter" className="size-4 text-muted me-3"></i>
                    <span className="text-body">SRBThemes</span>
                  </h6>
                </div>

                <p className="pt-4 mb-3 border-top text-uppercase fs-11 fw-bold text-muted tracking-wider">Fluent In</p>
                <div className="d-flex gap-2 flex-wrap">
                  <span className="badge border bg-light text-muted px-2 py-1 fs-12">English</span>
                  <span className="badge border bg-light text-muted px-2 py-1 fs-12">Mandarin</span>
                  <span className="badge border bg-light text-muted px-2 py-1 fs-12">French</span>
                </div>
              </div>
            </div>

            {/* Badges Card */}
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-transparent border-bottom py-3">
                <h6 className="card-title mb-0 fw-semibold text-body">Badges</h6>
              </div>
              <div className="card-body d-flex gap-3">
                <div className="badge-wrapper" title="New User" style={{ cursor: 'pointer' }}>
                  <img src="/assets/new-CXRkkB7-.png" loading="lazy" alt="New User" className="size-7" style={{ width: '28px', height: '28px' }} />
                </div>
                <div className="badge-wrapper" title="Verified Badge" style={{ cursor: 'pointer' }}>
                  <img src="/assets/quality-CsTXHd4t.png" loading="lazy" alt="Verified Badge" className="size-7" style={{ width: '28px', height: '28px' }} />
                </div>
                <div className="badge-wrapper" title="High Quality" style={{ cursor: 'pointer' }}>
                  <img src="/assets/high-quality-CGRtVPGv.png" loading="lazy" alt="High Quality" className="size-7" style={{ width: '28px', height: '28px' }} />
                </div>
                <div className="badge-wrapper" title="Reward" style={{ cursor: 'pointer' }}>
                  <img src="/assets/reward-CrMSSjzK.png" loading="lazy" alt="Reward" className="size-7" style={{ width: '28px', height: '28px' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab-specific Content Body */}
        <div className={`col-12 ${['overview', 'notes'].includes(activeTab) ? 'col-xl-8' : 'col-xl-12'}`}>
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="vstack gap-4">
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <h6 className="mb-3 fw-bold fs-16">Overview</h6>
                  <p className="mb-3 text-muted">
                    Hello, I'm <strong className="fw-semibold text-body">Lucas Ethan</strong>, a POS system administrator and store operations manager focused on ensuring smooth, accurate, and efficient daily retail operations. I oversee sales workflows, inventory control, and staff performance to make sure every transaction is fast, reliable, and customer-friendly.
                  </p>
                  <p className="mb-0 text-muted">
                    I work closely with cashiers, supervisors, and management teams to optimize POS settings, monitor real-time sales data, and resolve operational issues quickly. By leveraging detailed reports and insights, I help improve decision-making, reduce errors, and maintain consistent service quality across all store terminals.
                  </p>
                </div>
              </div>

              {/* Experience Timeline */}
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <h6 className="mb-4 fw-bold fs-16">Experience</h6>
                  <ul className="timeline-basic timeline-primary list-unstyled ps-3 border-start position-relative">
                    <li className="timeline-item pb-4 position-relative">
                      <div className="timeline-bullet bg-primary rounded-circle" style={{ width: '12px', height: '12px', position: 'absolute', left: '-20px', top: '6px' }}></div>
                      <h6 className="mb-1 fw-semibold fs-15 text-body">POS System Administrator – March 2020 – Present</h6>
                      <p className="fs-13 text-muted mb-3">Main Branch Retail Group, Buenos Aires, AR</p>
                      <ul className="text-muted ps-4 fs-14">
                        <li className="mb-2">Managed daily POS operations across multiple terminals, ensuring accurate billing, smooth checkouts, and system reliability.</li>
                        <li className="mb-2">Monitored real-time sales data, transaction logs, and cash flow to identify discrepancies and improve operational efficiency.</li>
                        <li className="mb-2">Configured products, pricing rules, discounts, taxes, and payment methods within the POS system.</li>
                        <li className="mb-2">Handled inventory synchronization, low-stock alerts, and stock adjustments to prevent over-selling and shortages.</li>
                        <li className="mb-2">Managed user roles, staff permissions, and access controls to ensure secure POS usage.</li>
                      </ul>
                    </li>

                    <li className="timeline-item position-relative">
                      <div className="timeline-bullet bg-secondary rounded-circle" style={{ width: '12px', height: '12px', position: 'absolute', left: '-20px', top: '6px' }}></div>
                      <h6 className="mb-1 fw-semibold fs-15 text-body">Assistant POS Operator – January 2018 - February 2020</h6>
                      <p className="fs-13 text-muted mb-3">CityMart Convenience Store, New York, NY</p>
                      <ul className="text-muted ps-4 fs-14">
                        <li className="mb-2">Supported day-to-day POS operations including billing, order processing, and receipt handling.</li>
                        <li className="mb-2">Assisted with product entry, barcode management, and price updates in the POS system.</li>
                        <li className="mb-2">Helped reconcile cash drawers and end-of-day sales summaries.</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Portfolio */}
              <div className="card shadow-sm">
                <div className="card-body p-4">
                  <h6 className="mb-4 fw-bold fs-16">Portfolio Highlights</h6>
                  <div className="row g-4">
                    <div className="col-12 col-md-4 text-center">
                      <div className="overflow-hidden rounded-3 mb-2 shadow-sm" style={{ height: '150px' }}>
                        <img src="/assets/img-01-CIcfpw9H.jpg" alt="Portfolio 1" className="img-fluid w-100 h-100 object-fit-cover" />
                      </div>
                      <h6 className="mb-0"><a href="#!" className="text-body fw-medium link-primary">Chat Application</a></h6>
                    </div>
                    <div className="col-12 col-md-4 text-center">
                      <div className="overflow-hidden rounded-3 mb-2 shadow-sm" style={{ height: '150px' }}>
                        <img src="/assets/img-02-Ch7WPbnc.jpg" alt="Portfolio 2" className="img-fluid w-100 h-100 object-fit-cover" />
                      </div>
                      <h6 className="mb-0"><a href="#!" class="text-body fw-medium link-primary">CRM React Projects</a></h6>
                    </div>
                    <div className="col-12 col-md-4 text-center">
                      <div className="overflow-hidden rounded-3 mb-2 shadow-sm" style={{ height: '150px' }}>
                        <img src="/assets/img-04-BL5cuwkW.jpg" alt="Portfolio 3" className="img-fluid w-100 h-100 object-fit-cover" />
                      </div>
                      <h6 className="mb-0"><a href="#!" className="text-body fw-medium link-primary">HR Management Team</a></h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVITY */}
          {activeTab === 'activity' && (
            <div className="row mt-1">
              {/* Filter Column */}
              <div className="col-12 col-md-4 col-xl-3 mb-4">
                <div className="card shadow-sm">
                  <div className="card-header bg-transparent border-bottom py-3">
                    <h6 className="card-title mb-0 fw-semibold text-body">Filter Activity</h6>
                  </div>
                  <div className="card-body">
                    <p className="mb-3 fs-11 fw-bold text-uppercase text-muted tracking-wider">Type</p>
                    <div className="mb-4">
                      <div className="form-check mb-2">
                        <input
                          id="typeCheckboxAll"
                          className="form-check-input"
                          type="checkbox"
                          checked={activityFilter.all}
                          onChange={(e) => {
                            const val = e.target.checked;
                            setActivityFilter({
                              all: val,
                              sales: val,
                              reports: val,
                              staff: val,
                              inventory: val,
                              terminals: val,
                              alerts: val
                            });
                          }}
                        />
                        <label htmlFor="typeCheckboxAll" className="form-check-label fs-14">All Activities</label>
                      </div>
                      <div className="form-check mb-2">
                        <input
                          id="typeCheckbox1"
                          className="form-check-input"
                          type="checkbox"
                          checked={activityFilter.sales}
                          onChange={(e) => setActivityFilter({ ...activityFilter, sales: e.target.checked, all: false })}
                        />
                        <label htmlFor="typeCheckbox1" className="form-check-label fs-14">Sales Transactions</label>
                      </div>
                      <div className="form-check mb-2">
                        <input
                          id="typeCheckbox2"
                          className="form-check-input"
                          type="checkbox"
                          checked={activityFilter.reports}
                          onChange={(e) => setActivityFilter({ ...activityFilter, reports: e.target.checked, all: false })}
                        />
                        <label htmlFor="typeCheckbox2" className="form-check-label fs-14">Reports & Files</label>
                      </div>
                      <div className="form-check mb-2">
                        <input
                          id="typeCheckbox3"
                          className="form-check-input"
                          type="checkbox"
                          checked={activityFilter.staff}
                          onChange={(e) => setActivityFilter({ ...activityFilter, staff: e.target.checked, all: false })}
                        />
                        <label htmlFor="typeCheckbox3" className="form-check-label fs-14">Staff Requests</label>
                      </div>
                      <div className="form-check mb-2">
                        <input
                          id="typeCheckbox4"
                          className="form-check-input"
                          type="checkbox"
                          checked={activityFilter.inventory}
                          onChange={(e) => setActivityFilter({ ...activityFilter, inventory: e.target.checked, all: false })}
                        />
                        <label htmlFor="typeCheckbox4" className="form-check-label fs-14">Products & Inventory</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Column */}
              <div className="col-12 col-md-8 col-xl-9">
                <div className="card shadow-sm">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center pb-2 border-bottom justify-content-between mb-4">
                      <h6 className="mb-0 fw-bold fs-15 text-body">Recent Activities</h6>
                      <p className="fs-13 text-muted mb-0">Monday, May 20, 2024</p>
                    </div>

                    <ul className="ps-0 mb-0 timeline-modern list-unstyled position-relative border-start">
                      {activities
                        .filter(act => activityFilter.all || activityFilter[act.type])
                        .map((act) => (
                          <li key={act.id} className="timeline-item pb-4 ps-4 position-relative">
                            {/* Avatar/Icon Bullet */}
                            <div className="position-absolute" style={{ left: '-18px', top: '0' }}>
                              {act.icon ? (
                                <div className={`avatar text-${act.color} bg-${act.color}-subtle size-8 rounded-circle d-flex align-items-center justify-content-center`} style={{ width: '32px', height: '32px' }}>
                                  <i data-lucide={act.icon} className="size-4"></i>
                                </div>
                              ) : (
                                <img src="/assets/user-12-CfsiEgBV.png" alt="User" className="rounded-circle border size-8" style={{ width: '32px', height: '32px' }} />
                              )}
                            </div>

                            <div className="card border shadow-none bg-body-tertiary">
                              <div className="card-body p-3">
                                <p className="float-end fs-12 text-muted mb-0">{act.time}</p>
                                <h6 className="mb-1 fw-semibold fs-14">{act.title}</h6>
                                <p className="text-muted fs-13 mb-2">{act.desc}</p>
                                
                                {act.tags && (
                                  <div className="mb-2 d-flex gap-2">
                                    {act.tags.map((t, idx) => (
                                      <span key={idx} className="badge border text-muted fs-11">{t}</span>
                                    ))}
                                  </div>
                                )}

                                {act.files && (
                                  <div className="row g-2 mt-2">
                                    {act.files.map((file, idx) => (
                                      <div key={idx} className="col-12 col-md-6 col-xl-4">
                                        <div className="d-flex align-items-center gap-3 p-2 border border-dashed rounded bg-white">
                                          <i data-lucide="file-text" className="size-6 text-danger stroke-1"></i>
                                          <div>
                                            <h6 className="mb-0 fs-12 fw-medium text-truncate" style={{ maxWidth: '120px' }}>{file.name}</h6>
                                            <p className="text-muted small mb-0">{file.size}</p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {act.type === 'staff' && (
                                  <div className="d-flex gap-3 mt-3 fs-12 text-muted border-top pt-2">
                                    <span className="d-flex align-items-center gap-1"><i data-lucide="smile" className="size-3-5"></i> 2 acknowledgements</span>
                                    <span className="d-flex align-items-center gap-1"><i data-lucide="message-square-text" className="size-3-5"></i> 6 internal notes</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FOLLOWERS */}
          {activeTab === 'followers' && (
            <div className="row g-4 mt-1">
              {followers.map((f) => (
                <div key={f.id} className="col-12 col-lg-6 col-xl-4">
                  <div className="card shadow-sm h-100 border">
                    <div className="card-body d-flex flex-column align-items-center text-center p-4">
                      <img src={f.avatar} alt={f.name} className="rounded-circle size-20 mb-3" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                      <h6 className="fw-semibold mb-1 fs-15">{f.name}</h6>
                      <p className="text-muted fs-13 mb-3 d-flex align-items-center gap-1"><i data-lucide="mail" className="size-3-5"></i> {f.email}</p>
                      <p className="text-muted fs-13 mb-4 d-flex align-items-center gap-1"><i data-lucide="phone" className="size-3-5"></i> {f.phone}</p>
                      
                      <div className="w-100 d-flex gap-2 justify-content-center border-top pt-3">
                        <a href="#!" className="btn btn-sm btn-light px-3 py-1-5 fs-13 d-flex align-items-center gap-1">
                          View <i data-lucide="move-right" className="size-3-5"></i>
                        </a>
                        <button
                          onClick={() => handleFollowerFollowToggle(f.id)}
                          type="button"
                          className={`btn btn-sm px-3 py-1-5 fs-13 d-flex align-items-center gap-1 ${f.isFollowing ? 'btn-outline-danger' : 'btn-primary'}`}
                        >
                          {f.isFollowing ? 'Unfollow' : 'Follow'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="mt-1">
              {/* Header options */}
              <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
                <h6 className="fw-bold fs-16 mb-0">Documents &amp; Assets</h6>
                <div className="d-flex gap-3 align-items-center">
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form-control form-control-sm ps-5"
                      placeholder="Search files..."
                      value={docSearchQuery}
                      onChange={(e) => setDocSearchQuery(e.target.value)}
                    />
                    <i data-lucide="search" className="position-absolute size-4 text-muted" style={{ left: '10px', top: '10px' }}></i>
                  </div>
                  <div className="dropdown">
                    <button className="btn btn-sm btn-light dropdown-toggle d-flex align-items-center gap-1" type="button" id="docFilterBtn" data-bs-toggle="dropdown" aria-expanded="false">
                      <i data-lucide="sliders-horizontal" className="size-3-5"></i> Filters
                    </button>
                    <div className="dropdown-menu dropdown-menu-end p-4 w-72" aria-labelledby="docFilterBtn">
                      <h6 className="mb-3 fw-bold fs-14">Filter Options</h6>
                      <div className="mb-3">
                        <label className="form-label fs-13 fw-semibold text-muted">Uploaded By</label>
                        <div className="form-check mb-2">
                          <input className="form-check-input" type="checkbox" id="authorCheck" checked={docFilterAuthor} onChange={(e) => setDocFilterAuthor(e.target.checked)} />
                          <label className="form-check-label fs-13" htmlFor="authorCheck">Author / Staff</label>
                        </div>
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" id="customerCheck" checked={docFilterCustomer} onChange={(e) => setDocFilterCustomer(e.target.checked)} />
                          <label className="form-check-label fs-13" htmlFor="customerCheck">Customer</label>
                        </div>
                      </div>
                      <div className="d-flex justify-content-end gap-2 border-top pt-2">
                        <button type="button" className="btn btn-xs btn-light" onClick={() => { setDocFilterAuthor(true); setDocFilterCustomer(true); }}>Reset</button>
                        <button type="button" className="btn btn-xs btn-primary">Apply</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Folders Section */}
              <h6 className="fw-semibold text-body mb-3 fs-14">Folders</h6>
              <div className="row g-4 mb-4">
                {folders.map((f) => (
                  <div key={f.id} className="col-12 col-md-4 col-xxl">
                    <div className="card border shadow-sm h-100 bg-body-tertiary">
                      <div className="card-body p-3">
                        <i data-lucide="folder-closed" className="size-8 text-secondary stroke-1 mb-3"></i>
                        <h6 className="fw-semibold fs-14 mb-1">
                          <a href="#!" className="text-reset link-primary">{f.name}</a>
                        </h6>
                        <p className="text-muted fs-12 mb-0">{f.filesCount} Files · {f.size}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Files Section */}
              <h6 className="fw-semibold text-body mb-3 fs-14">Files ({filteredDocFiles.length})</h6>
              <div className="row g-4 mb-4">
                {filteredDocFiles.map((file) => (
                  <div key={file.id} className="col-12 col-md-4 col-xxl">
                    <div className="card border shadow-sm h-100">
                      <div className="card-body p-3">
                        <i data-lucide="file" className="size-8 text-info stroke-1 mb-3"></i>
                        <h6 className="fw-semibold fs-14 mb-1">
                          <a href="#!" className="text-reset link-primary text-truncate d-block">{file.name}</a>
                        </h6>
                        <p className="text-muted fs-12 mb-0">{file.size}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Media Section */}
              <h6 className="fw-semibold text-body mb-3 fs-14">Images &amp; Videos</h6>
              <div className="row g-4">
                <div className="col-12 col-md-6 col-xl-3">
                  <div className="card border shadow-sm">
                    <div className="card-body p-2">
                      <img src="/assets/img-01-CIcfpw9H.jpg" alt="Gallery" className="ratio ratio-16x9 object-fit-cover rounded shadow-sm mb-2" style={{ height: '140px' }} />
                      <h6 className="fs-13 text-truncate mb-0 fw-semibold"><a href="#!" className="text-body">Adventure is a form of self care</a></h6>
                      <p className="text-muted small mb-0">15.6 KB</p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6 col-xl-3">
                  <div className="card border shadow-sm">
                    <div className="card-body p-2">
                      <div className="ratio ratio-16x9 mb-2" style={{ height: '140px' }}>
                        <iframe className="w-100 h-100 rounded shadow-sm" src="https://www.youtube-nocookie.com/embed/b9g4_8nAsdA?si=_e3X8mngp-4-wHZj" title="YouTube video player" allowFullScreen></iframe>
                      </div>
                      <h6 className="fs-13 text-truncate mb-0 fw-semibold"><a href="#!" className="text-body">Bootstrap 5 Full Course</a></h6>
                      <p className="text-muted small mb-0">23.98 MB</p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6 col-xl-3">
                  <div className="card border shadow-sm">
                    <div className="card-body p-2">
                      <div className="ratio ratio-16x9 mb-2" style={{ height: '140px' }}>
                        <iframe className="w-100 h-100 rounded shadow-sm" src="https://www.youtube-nocookie.com/embed/CbdAIzQwb6M?si=1B0sgm5P_g22ACW1" title="YouTube video" allowFullScreen></iframe>
                      </div>
                      <h6 className="fs-13 text-truncate mb-0 fw-semibold"><a href="#!" className="text-body">Bootstrap 5 Dropdown on Hover</a></h6>
                      <p className="text-muted small mb-0">23.98 MB</p>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-6 col-xl-3">
                  <div className="card border shadow-sm">
                    <div className="card-body p-2">
                      <img src="/assets/img-02-Ch7WPbnc.jpg" alt="Gallery" className="ratio ratio-16x9 object-fit-cover rounded shadow-sm mb-2" style={{ height: '140px' }} />
                      <h6 className="fs-13 text-truncate mb-0 fw-semibold"><a href="#!" className="text-body">Cuteness in every bloom</a></h6>
                      <p className="text-muted small mb-0">1.97 KB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: NOTES */}
          {activeTab === 'notes' && (
            <div className="vstack gap-4">
              {/* Note input form card */}
              <div className="card shadow-sm border" id="noteFormCard">
                <div className="card-header bg-transparent border-bottom py-3">
                  <h6 className="card-title mb-0 fw-bold text-body">{editingNoteId ? 'Update Note' : 'Create Notes'}</h6>
                </div>
                <div className="card-body">
                  <form onSubmit={handleNoteSubmit}>
                    <div className="mb-3">
                      <label htmlFor="noteTitleInput" className="form-label fs-13 fw-semibold">Note Title</label>
                      <input
                        type="text"
                        id="noteTitleInput"
                        className="form-control"
                        placeholder="Note Title"
                        value={noteTitle}
                        onChange={(e) => setNoteTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="writeNotes" className="form-label fs-13 fw-semibold">Write Notes</label>
                      <textarea
                        id="writeNotes"
                        rows="3"
                        className="form-control"
                        placeholder="Write your notes"
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        required
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="notesImageInput" className="form-label fs-13 fw-semibold">Notes Image (Optional)</label>
                      <input
                        className="form-control"
                        type="file"
                        id="notesImageInput"
                        onChange={handleNoteImageChange}
                        accept="image/*"
                      />
                    </div>
                    <div className="d-flex justify-content-end gap-2">
                      {editingNoteId && (
                        <button type="button" className="btn btn-light" onClick={() => { setEditingNoteId(null); setNoteTitle(''); setNoteContent(''); setNoteImage(null); }}>
                          Cancel
                        </button>
                      )}
                      <button type="submit" className="btn btn-primary px-4">
                        {editingNoteId ? 'Update Note' : 'Create Note'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Notes List */}
              <div className="vstack gap-3">
                {notes.map((note) => (
                  <div key={note.id} className="card shadow-sm border border-light">
                    <div className="card-body">
                      <div className="mb-3 d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1 fw-bold fs-15 text-body">{note.title}</h6>
                          <p className="text-muted small mb-0">
                            By <span className="link-primary">{note.author}</span> - {note.date}
                          </p>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <button
                            onClick={() => handleEditNote(note)}
                            type="button"
                            className="btn btn-icon size-8 btn-light text-success border-0"
                            title="Edit"
                          >
                            <i data-lucide="pencil" className="size-4"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            type="button"
                            className="btn btn-icon size-8 btn-light text-danger border-0"
                            title="Delete"
                          >
                            <i data-lucide="trash-2" className="size-4"></i>
                          </button>
                        </div>
                      </div>

                      {/* Content layout with optional image */}
                      {note.image ? (
                        <div className="row g-4">
                          <div className="col-12 col-lg-3">
                            <img src={note.image} alt="Note asset" className="img-fluid rounded border w-100" style={{ maxHeight: '140px', objectFit: 'cover' }} />
                          </div>
                          <div className="col-12 col-lg-9">
                            <p className="text-muted fs-14 mb-0">{note.content}</p>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-muted fs-14 mb-2">{note.content}</p>
                          {note.bullets && (
                            <ul className="list-group list-borderless list-group-numbered ps-0 fs-13 text-muted">
                              {note.bullets.map((bullet, idx) => (
                                <li key={idx} className="list-group-item bg-transparent py-1 border-0">{bullet}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="row g-4 mt-1">
              {projects.map((proj) => (
                <div key={proj.id} className="col-12 col-md-6 col-xl-4">
                  <div className="card shadow-sm h-100 border d-flex flex-column justify-content-between">
                    <div className="card-body p-4">
                      <div className="d-flex gap-3 mb-3">
                        <div className={`avatar rounded-modern flex-shrink-0 size-12 bg-gradient-b-${proj.color} d-flex align-items-center justify-content-center`} style={{ width: '48px', height: '48px' }}>
                          <i data-lucide={proj.icon} className="size-6 text-white"></i>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="fw-bold mb-1 fs-15"><a href="#!" className="text-body text-decoration-none">{proj.name}</a></h6>
                          <p className="line-clamp-4 text-muted fs-13 mb-0" style={{ display: '-webkit-box', WebkitLineClamp: '4', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{proj.desc}</p>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between gap-3 mt-3 border-top pt-2">
                        <span className="badge bg-light text-muted border fs-12">{proj.tag}</span>
                        <p className="fs-13 text-muted mb-0 d-flex align-items-center gap-1">
                          <i data-lucide="eye" className="size-4"></i>
                          <span>{proj.views} views</span>
                        </p>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between card-footer bg-light border-top py-3 px-4">
                      <div className="avatar-group d-flex align-items-center">
                        {proj.team.map((avatar, idx) => (
                          <a key={idx} href="#!" className="avatar-group-item ms-n2 border border-2 border-white rounded-circle overflow-hidden" style={{ width: '28px', height: '28px' }}>
                            <img src={avatar} alt="Team member" className="w-100 h-100 object-fit-cover" />
                          </a>
                        ))}
                      </div>
                      <div className="dropdown">
                        <button className="btn btn-icon size-8 btn-light border-0 dropdown-toggle no-caret" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                          <i data-lucide="ellipsis" className="size-4"></i>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                          <li><a className="dropdown-item fs-13" href="#!">Overview</a></li>
                          <li><a className="dropdown-item fs-13" href="#!">Edit</a></li>
                          <li><a className="dropdown-item fs-13" href="#!">Delete</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
