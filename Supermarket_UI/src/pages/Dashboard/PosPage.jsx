// pages/Dashboard/PosPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../configs/routes';

const initialProducts = [
  { id: 1, name: "Women’s Elegant Handbag", sku: "BG-HBG-011", price: 89.99, image: "/assets/pr-35-B2Unq0hU.png", category: "Bags", stock: 15 },
  { id: 2, name: "Classic Salted Potato Chips", sku: "FD-SNK-001", price: 2.99, image: "/assets/pr-21-Dip6sWIz.png", category: "Food", stock: 50 },
  { id: 3, name: "Polka Dot Skater Dress", sku: "DR-WMN-002", price: 32.99, image: "/assets/pr-3-BzZJ2azf.png", category: "Clothing", stock: 8 },
  { id: 4, name: "Women’s Designer Shoulder Bag", sku: "BG-HBG-012", price: 99.99, image: "/assets/pr-36-COs7RIFT.png", category: "Bags", stock: 12 },
  { id: 5, name: "Women’s Red Camisole Top", sku: "TP-WMN-003", price: 17.99, image: "/assets/pr-2-BB_J2W-Z.png", category: "Clothing", stock: 0 },
  { id: 6, name: "Men’s Running Sports Shoes", sku: "FT-MEN-002", price: 54.99, image: "/assets/pr-16-qIivuYeB.png", category: "Footwear", stock: 22 },
  { id: 7, name: "Smart Watch Series 9", sku: "WT-SM9-01", price: 199.99, image: "/assets/img-03-oTTY_McP.png", category: "Watches", stock: 5 },
  { id: 8, name: "Bluetooth Soundbar Speaker", sku: "EL-SPK-05", price: 45.00, image: "/assets/img-04-DZ4OtBxS.png", category: "Electronics", stock: 18 },
  { id: 9, name: "Wireless Charging Pad", sku: "EL-WCP-02", price: 15.99, image: "/assets/img-01-BBWp8t8E.png", category: "Accessories", stock: 3 },
  { id: 10, name: "Matte Lipstick Red", sku: "BT-LIP-09", price: 12.50, image: "/assets/pr-37-CrN88d3y.png", category: "Beauty", stock: 40 }
];

const categories = [
  { id: 'all', name: 'All', icon: '/assets/img-14-Bq_mg9xG.png' },
  { id: 'clothing', name: 'Clothing', icon: '/assets/img-01-BBWp8t8E.png' },
  { id: 'footwear', name: 'Footwear', icon: '/assets/img-03-oTTY_McP.png' },
  { id: 'watches', name: 'Watches', icon: '/assets/img-02-ClVfz9I5.png' },
  { id: 'food', name: 'Food', icon: '/assets/img-22-D2w1zjf6.png' },
  { id: 'accessories', name: 'Accessories', icon: '/assets/img-19-UVF-VI0Q.png' },
  { id: 'electronics', name: 'Electronics', icon: '/assets/img-24-Q6X8xUcA.png' },
  { id: 'bags', name: 'Bags', icon: '/assets/img-08-BXmGY-HZ.png' },
  { id: 'beauty', name: 'Beauty', icon: '/assets/pr-37-CrN88d3y.png' }
];

export default function PosPage() {
  const [products] = useState(initialProducts);
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [filterStock, setFilterStock] = useState('all'); // all, instock, outofstock, lowstock
  const [sortOrder, setSortOrder] = useState('default'); // default, price-low, price-high

  const [selectedMethod, setSelectedMethod] = useState('Cash');
  const [heldOrders, setHeldOrders] = useState([]);
  const [historyOrders, setHistoryOrders] = useState([]);
  
  // Modals management states
  const [activeModal, setActiveModal] = useState(null); // 'hold', 'invoice', 'payLater', 'history', 'payment', 'payment-direct', 'cash', 'card', 'upi', 'bank', 'split', 'editCustomer'
  const [lastOrder, setLastOrder] = useState(null);
  
  // Modal forms states
  const [cashReceived, setCashReceived] = useState('');
  const [changeToReturn, setChangeToReturn] = useState(0);
  const [holdReference, setHoldReference] = useState('');
  const [holdNotes, setHoldNotes] = useState('');
  
  // Customer details state
  const [customerData, setCustomerData] = useState({
    name: 'Jonathan Michael',
    points: 2450,
    level: 'Platinum Member',
    avatar: '/assets/user-47-C1F3Gd9o.png'
  });

  // Discount states
  const [discountApplied, setDiscountApplied] = useState(true);
  const [appliedDiscountRate] = useState(0.10); // 10% Discount

  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Clock tick
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentDate(now.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [cart, activeCategory, search, filterStock, sortOrder, selectedMethod, activeModal]);

  const addToCart = (product) => {
    if (product.stock === 0) {
      alert('This product is currently out of stock.');
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (id, amount) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + amount;
        if (newQty <= 0) {
          // If qty reaches 0, remove item (same as original HTML behavior)
          setTimeout(() => removeFromCart(id), 0);
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Financial calculations
  const subtotal = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const discount = discountApplied ? subtotal * appliedDiscountRate : 0;
  const gst = (subtotal - discount) * 0.18; // 18% GST
  const serviceCharge = cart.length > 0 ? 10 : 0;
  const totalPayable = subtotal - discount + gst + serviceCharge;

  // Filter & Sort Products
  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    
    let matchesStock = true;
    if (filterStock === 'instock') matchesStock = p.stock > 0;
    else if (filterStock === 'outofstock') matchesStock = p.stock === 0;
    else if (filterStock === 'lowstock') matchesStock = p.stock > 0 && p.stock <= 5;

    return matchesCategory && matchesSearch && matchesStock;
  }).sort((a, b) => {
    if (sortOrder === 'price-low') return a.price - b.price;
    if (sortOrder === 'price-high') return b.price - a.price;
    return 0; // default
  });

  // Modal Content Renderer Helper
  const renderModalContent = () => {
    switch (activeModal) {
      case 'hold':
        return (
          <>
            <div className="modal-header">
              <h6 className="modal-title">Hold Bill</h6>
              <button className="btn-close" type="button" onClick={() => setActiveModal(null)}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => {
                e.preventDefault();
                const holdRecord = {
                  id: `HLD-${Date.now().toString().slice(-6)}`,
                  time: new Date().toLocaleTimeString(),
                  date: new Date().toLocaleDateString(),
                  items: [...cart],
                  total: totalPayable,
                  reference: holdReference || 'Table Order',
                  notes: holdNotes || ''
                };
                setHeldOrders([holdRecord, ...heldOrders]);
                clearCart();
                setActiveModal(null);
              }}>
                <div className="d-flex flex-column gap-4">
                  <div className="rounded p-3 bg-light">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Total Bill Amount</span>
                      <h6 className="fs-16 mb-0">${totalPayable.toFixed(2)}</h6>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="holdReference" className="form-label">Hold Reference</label>
                    <input
                      id="holdReference"
                      type="text"
                      className="form-control"
                      placeholder="Table 5 / John Order"
                      value={holdReference}
                      onChange={(e) => setHoldReference(e.target.value)}
                    />
                    <p className="text-muted mb-0 mt-1 fs-sm">This reference helps you identify the bill later.</p>
                  </div>
                  <div>
                    <label htmlFor="Notes" className="form-label">Notes</label>
                    <textarea
                      id="Notes"
                      className="form-control"
                      rows="3"
                      placeholder="Optional"
                      value={holdNotes}
                      onChange={(e) => setHoldNotes(e.target.value)}
                    ></textarea>
                    <p className="text-muted mb-0 mt-1 fs-sm">Add special instructions or customer notes if needed.</p>
                  </div>
                  <div className="d-flex gap-3 mt-3">
                    <button type="button" className="btn btn-light w-50" onClick={() => setActiveModal(null)}>Cancel</button>
                    <button type="submit" className="btn btn-primary w-50">Hold Bill</button>
                  </div>
                </div>
              </form>
            </div>
          </>
        );

      case 'invoice':
        return (
          <>
            <div className="modal-header border-bottom-0 pb-0">
              <div className="d-flex flex-wrap align-items-center gap-4">
                <h5 className="modal-title">Invoice Preview</h5>
                <div className="d-flex flex-wrap gap-2">
                  <button type="button" className="btn btn-light btn-sm px-4 h-9" onClick={() => alert("PDF downloaded")}><i className="ri-file-pdf-2-line me-1"></i>PDF</button>
                  <button type="button" className="btn btn-active-dark btn-sm px-4 h-9" onClick={() => alert("Email sent")}><i className="ri-mail-line me-1"></i>Email</button>
                  <button type="button" className="btn btn-active-dark btn-sm px-4 h-9" onClick={() => alert("Online payment requested")}><i className="ri-bank-card-line me-1"></i>Online Payment</button>
                </div>
              </div>
              <button type="button" className="btn btn-primary flex-shrink-0 ms-auto btn-sm px-4 h-9 rounded" onClick={() => {
                const orderRecord = {
                  id: `INV-${Date.now().toString().slice(-6)}`,
                  time: new Date().toLocaleTimeString(),
                  date: new Date().toLocaleDateString(),
                  items: [...cart],
                  total: totalPayable,
                  method: selectedMethod
                };
                setHistoryOrders([orderRecord, ...historyOrders]);
                setLastOrder(orderRecord);
                clearCart();
                setActiveModal('payment');
              }}>Save Invoice</button>
              <button className="btn-close ms-2" type="button" onClick={() => setActiveModal(null)}></button>
            </div>
            <div className="modal-body">
              <div className="border p-4 rounded">
                <div className="d-flex justify-content-between mb-6">
                  <h6 className="fs-16">#INV-7853</h6>
                  <a href="#!">
                    <img src="/assets/main-logo-CWEU2RA-.png" loading="lazy" aria-label="logo" alt="Logo" height="20" className="mx-auto logo-dark" />
                  </a>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p className="text-muted mb-1">Invoice Purpose:</p>
                    <h6>E-Commerce POS Integration</h6>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex gap-10 align-items-center justify-content-end">
                      <div>
                        <p className="text-muted mb-1">Issued On:</p>
                        <h6>{currentDate}</h6>
                      </div>
                      <div>
                        <p className="text-muted mb-1">Due By:</p>
                        <h6>{currentDate}</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col-md-6">
                    <p className="text-muted mb-2">Seller:</p>
                    <h6>NovaTech Solutions Ltd.</h6>
                    <p className="text-muted mb-1">Sector 62, Noida, India</p>
                    <a href="#!" className="link link-custom-primary d-block mb-1">finance@novatech.io</a>
                    <p className="text-muted">+91 98765 43210</p>
                  </div>
                  <div className="col-md-6 text-md-end">
                    <p className="text-muted mb-2">Client:</p>
                    <h6>{customerData.name}</h6>
                    <p className="text-muted mb-1">MG Road, Bengaluru, India</p>
                    <a href="#!" className="link link-custom-primary d-block mb-1">payments@brightmart.in</a>
                    <p className="text-muted">+91 80456 77890</p>
                  </div>
                </div>
                <div className="table-responsive mb-2">
                  <table className="table table-borderless text-nowrap">
                    <thead>
                      <tr className="border-bottom">
                        <th className="fw-medium text-muted">Service Details</th>
                        <th className="fw-medium text-muted">Qty</th>
                        <th className="fw-medium text-muted">Rate</th>
                        <th className="fw-medium text-muted">GST</th>
                        <th className="fw-medium text-muted text-end">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map(item => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                          <td>${item.price.toFixed(2)}</td>
                          <td>${((item.price * item.quantity - (discountApplied ? item.price * item.quantity * appliedDiscountRate : 0)) * 0.18).toFixed(2)}</td>
                          <td className="text-end">${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr>
                        <th colSpan="4" className="text-end">Total Payable</th>
                        <th className="text-end">${totalPayable.toFixed(2)}</th>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="bg-light py-2 px-3 rounded border mb-6">
                  <span className="fw-medium">Payment Terms:</span> Full payment required before final deployment. Delays may affect delivery timelines.
                </p>
                <div className="row align-items-end">
                  <div className="col-md-6">
                    <h6>Payment Information:</h6>
                    <p className="text-muted">{selectedMethod}</p>
                    <p className="text-muted">Beneficiary: NovaTech Solutions Ltd.</p>
                    <p className="text-muted">IFSC: HDFC0001298 · A/C No: 502001889334</p>
                    <p className="text-muted">GST Responsibility: Buyer</p>
                  </div>
                  <div className="col-md-6 text-end">
                    <img src="/assets/signature-BiyA9Vug.png" alt="Signature" className="h-12 mb-2" />
                    <h6 className="mb-0">Amit Verma</h6>
                    <p className="text-muted mb-0">Finance & Operations Head</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 'payLater':
        return (
          <>
            <div className="modal-header">
              <h6 className="modal-title">Pay Later</h6>
              <button className="btn-close" type="button" onClick={() => setActiveModal(null)}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => {
                e.preventDefault();
                const orderRecord = {
                  id: `PLT-${Date.now().toString().slice(-6)}`,
                  time: new Date().toLocaleTimeString(),
                  date: new Date().toLocaleDateString(),
                  items: [...cart],
                  total: totalPayable,
                  method: 'Pay Later',
                  dueDate: e.target.dueDate.value || 'Not Specified'
                };
                setHistoryOrders([orderRecord, ...historyOrders]);
                clearCart();
                setActiveModal(null);
                alert(`Order saved to "Pay Later" list for ${customerData.name}.`);
              }}>
                <div className="d-flex flex-column gap-4">
                  <div className="rounded p-3 bg-light">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Total Bill Amount</span>
                      <h6 className="fs-16 mb-0">${totalPayable.toFixed(2)}</h6>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="CustomerInput" className="form-label">Customer</label>
                    <input id="CustomerInput" type="text" className="form-control" readOnly value={customerData.name} />
                  </div>
                  <div>
                    <label htmlFor="dueDate" className="form-label">Due Date</label>
                    <input type="date" className="form-control" id="dueDate" defaultValue={new Date(Date.now() + 10*24*60*60*1000).toISOString().split('T')[0]} />
                  </div>
                  <div className="d-flex gap-3 mt-3">
                    <button type="button" className="btn btn-light w-50" onClick={() => setActiveModal(null)}>Cancel</button>
                    <button type="submit" className="btn btn-primary w-50">Confirm</button>
                  </div>
                </div>
              </form>
            </div>
          </>
        );

      case 'history':
        return (
          <>
            <div className="modal-header">
              <h6 className="modal-title">Billing History & Held Bills</h6>
              <button className="btn-close" type="button" onClick={() => setActiveModal(null)}></button>
            </div>
            <div className="modal-body">
              <div className="d-flex flex-column gap-4">
                
                {/* Completed Invoices Table */}
                <div>
                  <h6 className="fw-semibold mb-3 text-primary">Paid Invoices ({historyOrders.length})</h6>
                  {historyOrders.length === 0 ? (
                    <div className="text-center py-4 border rounded bg-light text-muted">No paid invoices yet.</div>
                  ) : (
                    <div className="table-card table-responsive border rounded">
                      <table className="table table-borderless align-middle mb-0">
                        <thead>
                          <tr className="bg-light">
                            <th>Invoice ID</th>
                            <th>Customer</th>
                            <th>Payment Method</th>
                            <th>Date & Time</th>
                            <th>Amount</th>
                            <th className="text-end">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {historyOrders.map(order => (
                            <tr key={order.id}>
                              <td><span className="link link-custom-primary fw-medium">{order.id}</span></td>
                              <td>{customerData.name}</td>
                              <td><span className="badge bg-success-subtle text-success">{order.method}</span></td>
                              <td>{order.date} <span className="text-muted ms-2">{order.time}</span></td>
                              <td className="fw-semibold">${order.total.toFixed(2)}</td>
                              <td className="text-end">
                                <button className="btn btn-sm btn-sub-danger rounded-1 py-1 px-2 border-0" onClick={() => {
                                  setHistoryOrders(historyOrders.filter(o => o.id !== order.id));
                                }}>
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Held Invoices Table */}
                <div className="mt-2">
                  <h6 className="fw-semibold mb-3 text-warning">Held Orders ({heldOrders.length})</h6>
                  {heldOrders.length === 0 ? (
                    <div className="text-center py-4 border rounded bg-light text-muted">No held orders.</div>
                  ) : (
                    <div className="table-card table-responsive border rounded">
                      <table className="table table-borderless align-middle mb-0">
                        <thead>
                          <tr className="bg-light">
                            <th>Hold ID</th>
                            <th>Reference</th>
                            <th>Date & Time</th>
                            <th>Amount</th>
                            <th className="text-end">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {heldOrders.map(hold => (
                            <tr key={hold.id}>
                              <td><span className="link link-custom-primary fw-medium">{hold.id}</span></td>
                              <td>{hold.reference}</td>
                              <td>{hold.date} <span className="text-muted ms-2">{hold.time}</span></td>
                              <td className="fw-semibold">${hold.total.toFixed(2)}</td>
                              <td className="text-end d-flex justify-content-end gap-2">
                                <button className="btn btn-sm btn-primary py-1 px-2 border-0" onClick={() => {
                                  setCart(hold.items);
                                  setHeldOrders(heldOrders.filter(h => h.id !== hold.id));
                                  setActiveModal(null);
                                }}>
                                  Retrieve
                                </button>
                                <button className="btn btn-sm btn-sub-danger py-1 px-2 border-0" onClick={() => {
                                  setHeldOrders(heldOrders.filter(h => h.id !== hold.id));
                                }}>
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </>
        );

      case 'payment':
      case 'payment-direct':
        const displayTotal = activeModal === 'payment-direct' ? totalPayable : (lastOrder ? lastOrder.total : totalPayable);
        const displayId = activeModal === 'payment-direct' ? `#GOT${Date.now().toString().slice(-4)}` : (lastOrder ? lastOrder.id : `#GOT${Date.now().toString().slice(-4)}`);
        
        return (
          <>
            <button type="button" className="btn-close position-absolute top-0 end-0 p-4 border-0 bg-transparent" onClick={() => {
              if (activeModal === 'payment-direct') {
                const orderRecord = {
                  id: displayId,
                  time: new Date().toLocaleTimeString(),
                  date: new Date().toLocaleDateString(),
                  items: [...cart],
                  total: totalPayable,
                  method: selectedMethod
                };
                setHistoryOrders([orderRecord, ...historyOrders]);
                clearCart();
              }
              setActiveModal(null);
            }}></button>
            <div className="modal-body pt-3 text-center">
              <img src="/assets/payment-D8Yv-YSk.png" alt="Payment Success" className="h-24 mt-4 mb-5" />
              <h5>Payment Successful!</h5>
              <p className="text-muted mb-4">Payment successful! Your transaction has been processed smoothly.</p>
              <div className="mb-4">
                <small className="text-muted">Amount</small>
                <h4 className="my-1 fw-bold">${displayTotal.toFixed(2)}</h4>
                <small className="text-muted">{currentDate} · Bill ID: <span className="text-body">{displayId}</span></small>
              </div>
              <div className="d-flex justify-content-center gap-2 mb-3">
                <a href="#!" className="btn btn-outline-light border btn-sm" onClick={(e) => { e.preventDefault(); alert("Invoice downloaded successfully!"); }}>
                  Download Receipt
                </a>
                <a href="#!" className="btn btn-outline-light border btn-sm" onClick={(e) => { e.preventDefault(); window.print(); }}>
                  Print Receipt
                </a>
              </div>
            </div>
          </>
        );

      case 'cash':
        return (
          <>
            <div className="modal-header">
              <h6 className="modal-title">Cash Payment</h6>
              <button type="button" className="btn-close" onClick={() => setActiveModal(null)}></button>
            </div>
            <div className="modal-body pt-3">
              <div className="mb-5">
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Total Payable</span>
                  <span className="fw-semibold fs-17">${totalPayable.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted">Payment Method</span>
                  <span className="badge bg-success-subtle text-success border border-success-subtle">Cash</span>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-medium">Cash Received</label>
                <div className="input-group input-group-lg">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="0.00"
                    autoFocus
                    value={cashReceived}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      setCashReceived(e.target.value);
                      setChangeToReturn(Math.max(0, val - totalPayable));
                    }}
                  />
                </div>
              </div>
              <div className="d-flex flex-wrap gap-2 mb-5">
                {[10, 20, 50, 100].map(val => (
                  <button
                    key={val}
                    type="button"
                    className="btn btn-outline-light border flex-fill text-dark"
                    onClick={() => {
                      setCashReceived(val.toString());
                      setChangeToReturn(Math.max(0, val - totalPayable));
                    }}
                  >
                    ${val}
                  </button>
                ))}
                <button
                  type="button"
                  className="btn btn-outline-light border flex-fill text-dark"
                  onClick={() => {
                    setCashReceived(totalPayable.toFixed(2));
                    setChangeToReturn(0);
                  }}
                >
                  Exact
                </button>
              </div>
              <div className="alert alert-success d-flex justify-content-between align-items-center mb-4">
                <span className="fw-medium">Change to Return</span>
                <span className="fw-semibold">${changeToReturn.toFixed(2)}</span>
              </div>
              <div className="d-flex gap-3 mt-7">
                <button type="button" className="btn btn-light w-50" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="button" className="btn btn-primary w-50" onClick={() => {
                  const orderRecord = {
                    id: `INV-${Date.now().toString().slice(-6)}`,
                    time: new Date().toLocaleTimeString(),
                    date: new Date().toLocaleDateString(),
                    items: [...cart],
                    total: totalPayable,
                    method: 'Cash',
                    cashReceived: parseFloat(cashReceived) || totalPayable,
                    changeToReturn: changeToReturn
                  };
                  setHistoryOrders([orderRecord, ...historyOrders]);
                  setLastOrder(orderRecord);
                  clearCart();
                  setActiveModal('payment');
                }}>Submit</button>
              </div>
            </div>
          </>
        );

      case 'card':
        return (
          <>
            <div className="modal-header">
              <h6 className="modal-title">Card Payment</h6>
              <button className="btn-close" type="button" onClick={() => setActiveModal(null)}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => {
                e.preventDefault();
                const orderRecord = {
                  id: `INV-${Date.now().toString().slice(-6)}`,
                  time: new Date().toLocaleTimeString(),
                  date: new Date().toLocaleDateString(),
                  items: [...cart],
                  total: totalPayable,
                  method: 'Card'
                };
                setHistoryOrders([orderRecord, ...historyOrders]);
                setLastOrder(orderRecord);
                clearCart();
                setActiveModal('payment');
              }}>
                <div className="row g-3">
                  <div className="col-12">
                    <ul className="nav nav-pills nav-light gap-3 mb-4" id="paymentMethodTabs">
                      <li className="nav-item">
                        <button className="nav-link border active text-start py-2 px-3" type="button">
                          <img src="/assets/visa-Xmp1xRly.png" alt="Visa" className="h-4 mb-1 d-block" />
                          <span>Visa</span>
                        </button>
                      </li>
                    </ul>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label" htmlFor="visaCardNumber">Card Number</label>
                        <input type="text" className="form-control" id="visaCardNumber" placeholder="XXXX XXXX XXXX 1234" required />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label" htmlFor="visaExpiry">Expiry</label>
                        <input type="text" className="form-control" id="visaExpiry" placeholder="MM/YY" required />
                      </div>
                      <div className="col-md-3">
                        <label className="form-label" htmlFor="visaCvv">Cvv</label>
                        <input type="password" className="form-control" id="visaCvv" placeholder="***" required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Amount</label>
                        <input type="text" className="form-control" value={`$${totalPayable.toFixed(2)}`} readOnly />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="d-flex gap-3 mt-4">
                  <button type="button" className="btn btn-light w-50" onClick={() => setActiveModal(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary w-50">Submit</button>
                </div>
              </form>
            </div>
          </>
        );

      case 'upi':
        return (
          <>
            <div className="modal-body text-center pt-4">
              <p className="sub-title text-muted mb-2">Total Price</p>
              <h4 className="fw-bold sub-title mb-3">${totalPayable.toFixed(2)}</h4>
              <img src="/assets/qr-CvtWFzmv.png" alt="QR Code" className="img-fluid w-56 mb-1 border rounded p-2 bg-white" />
              <p className="text-muted mb-3">Ask customer to scan & complete payment</p>
              <div className="d-flex gap-3 mt-4">
                <button type="button" className="btn btn-light w-50" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="button" className="btn btn-primary w-50" onClick={() => {
                  const orderRecord = {
                    id: `INV-${Date.now().toString().slice(-6)}`,
                    time: new Date().toLocaleTimeString(),
                    date: new Date().toLocaleDateString(),
                    items: [...cart],
                    total: totalPayable,
                    method: 'UPI / Scan'
                  };
                  setHistoryOrders([orderRecord, ...historyOrders]);
                  setLastOrder(orderRecord);
                  clearCart();
                  setActiveModal('payment');
                }}>Confirm Payment</button>
              </div>
            </div>
          </>
        );

      case 'bank':
        return (
          <>
            <div className="modal-header">
              <h6 className="modal-title">Bank Transfer</h6>
              <button type="button" className="btn-close" onClick={() => setActiveModal(null)}></button>
            </div>
            <div className="modal-body pt-3">
              <form onSubmit={(e) => {
                e.preventDefault();
                const orderRecord = {
                  id: `INV-${Date.now().toString().slice(-6)}`,
                  time: new Date().toLocaleTimeString(),
                  date: new Date().toLocaleDateString(),
                  items: [...cart],
                  total: totalPayable,
                  method: 'Bank Transfer'
                };
                setHistoryOrders([orderRecord, ...historyOrders]);
                setLastOrder(orderRecord);
                clearCart();
                setActiveModal('payment');
              }}>
                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Total Payable</span>
                    <span className="fw-semibold fs-17">${totalPayable.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-muted">Payment Method</span>
                    <span className="badge bg-info-subtle text-info border border-info-subtle">Bank Transfer</span>
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="bankName" className="form-label">Bank Name</label>
                  <input id="bankName" type="text" className="form-control" placeholder="e.g. HDFC Bank, SBI, ICICI" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="referenceID" className="form-label">Transaction Reference ID</label>
                  <input id="referenceID" type="text" className="form-control" placeholder="Enter UTR / Reference number" required />
                </div>
                <div className="alert alert-info d-flex align-items-start gap-2 mb-4">
                  <i className="ri-bank-line fs-5"></i>
                  <div className="small">
                    Ensure the transfer is completed and reflected in your bank account before confirming.
                  </div>
                </div>
                <div className="d-flex gap-3 mt-4">
                  <button type="button" className="btn btn-light w-50" onClick={() => setActiveModal(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary w-50">Confirm</button>
                </div>
              </form>
            </div>
          </>
        );

      case 'split':
        return (
          <>
            <div className="modal-header">
              <h6 className="modal-title">Split Payment</h6>
              <button className="btn-close" type="button" onClick={() => setActiveModal(null)}></button>
            </div>
            <div className="modal-body">
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Total Bill</span>
                  <h6 className="mb-0 fw-semibold">${totalPayable.toFixed(2)}</h6>
                </div>
              </div>
              <div className="d-flex flex-column gap-3">
                <div className="border rounded p-3">
                  <div className="row g-2 align-items-center">
                    <div className="col-md-4">
                      <label className="form-label small text-muted">Method 1</label>
                      <select className="form-select form-select-sm">
                        <option>Cash</option>
                        <option>Card</option>
                      </select>
                    </div>
                    <div className="col-md-5">
                      <label className="form-label small text-muted">Amount</label>
                      <input type="number" className="form-control form-control-sm" defaultValue={(totalPayable/2).toFixed(2)} />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small text-muted d-block">&nbsp;</label>
                      <button type="button" className="btn btn-secondary btn-sm w-100">Applied</button>
                    </div>
                  </div>
                </div>
                <div className="border rounded p-3">
                  <div className="row g-2 align-items-center">
                    <div className="col-md-4">
                      <label className="form-label small text-muted">Method 2</label>
                      <select className="form-select form-select-sm" defaultValue="Card">
                        <option>Cash</option>
                        <option>Card</option>
                      </select>
                    </div>
                    <div className="col-md-5">
                      <label className="form-label small text-muted">Amount</label>
                      <input type="number" className="form-control form-control-sm" defaultValue={(totalPayable/2).toFixed(2)} />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label small text-muted d-block">&nbsp;</label>
                      <button type="button" className="btn btn-secondary btn-sm w-100">Applied</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="d-flex gap-3 mt-4">
                <button type="button" className="btn btn-light w-50" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="button" className="btn btn-primary w-50" onClick={() => {
                  const orderRecord = {
                    id: `INV-${Date.now().toString().slice(-6)}`,
                    time: new Date().toLocaleTimeString(),
                    date: new Date().toLocaleDateString(),
                    items: [...cart],
                    total: totalPayable,
                    method: 'Split'
                  };
                  setHistoryOrders([orderRecord, ...historyOrders]);
                  setLastOrder(orderRecord);
                  clearCart();
                  setActiveModal('payment');
                }}>Submit</button>
              </div>
            </div>
          </>
        );

      case 'editCustomer':
        return (
          <>
            <div className="modal-header">
              <h6 className="modal-title">Edit Customer Details</h6>
              <button type="button" className="btn-close" onClick={() => setActiveModal(null)}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => {
                e.preventDefault();
                setCustomerData({
                  ...customerData,
                  name: e.target.customerName.value,
                  points: parseInt(e.target.customerPoints.value) || 0,
                  level: e.target.customerLevel.value
                });
                setActiveModal(null);
              }}>
                <div className="row g-4">
                  <div className="col-12">
                    <label className="form-label">Customer Name</label>
                    <input type="text" name="customerName" className="form-control" defaultValue={customerData.name} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Membership Level</label>
                    <select name="customerLevel" className="form-select" defaultValue={customerData.level}>
                      <option>Platinum Member</option>
                      <option>Gold Member</option>
                      <option>Silver Member</option>
                      <option>Regular Member</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Reward Points</label>
                    <input type="number" name="customerPoints" className="form-control" defaultValue={customerData.points} min="0" required />
                  </div>
                </div>
                <div className="d-flex gap-3 mt-5">
                  <button type="button" className="btn btn-light w-50" onClick={() => setActiveModal(null)}>Cancel</button>
                  <button type="submit" className="btn btn-primary w-50">Save Changes</button>
                </div>
              </form>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container-fluid px-0">
      <div className="row g-0 pos-wrapper">
        
        {/* Left Side: Product Grid (col-lg-7) */}
        <div className="col-lg-7 col-xl-8 col-xxl-9">
          <div className="position-relative">
            <header className="main-topbar start-0 position-absolute" id="main-topbar">
              <a href="#!" className="navbar-brand">
                <div className="logo-lg">
                  <img src="/assets/main-logo-CWEU2RA-.png" loading="lazy" alt="Logo" height="20" className="mx-auto logo-dark" />
                  <img src="/assets/logo-white-B_ImY8Qx.png" loading="lazy" alt="Logo" height="20" className="mx-auto logo-light" />
                </div>
              </a>
              <div className="d-none d-xl-flex align-items-center gap-2 ms-10">
                <div className="border py-6px px-3 rounded">
                  <i className="ri-calendar-line me-2 text-primary"></i>
                  <span>{currentDate}</span>
                </div>
                <span>-</span>
                <div className="border py-6px px-3 rounded">
                  <i className="ri-time-line me-2 text-primary"></i>
                  <span>{currentTime}</span>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3 ms-auto">
                <span className="py-6px ps-4 pe-6px bg-success-subtle rounded text-success d-none d-md-flex align-items-center">
                  <span className="size-1-5 d-block rounded-circle bg-success me-2"></span>Open Order
                </span>
                <Link to={ROUTES.DASHBOARD} className="btn h-9 px-3 btn-secondary py-6px d-none d-md-inline-flex align-items-center">
                  <i className="ri-dashboard-line pe-1"></i> Dashboard
                </Link>
              </div>
            </header>
          </div>

          <div className="pos-left-side d-flex flex-wrap flex-md-nowrap">
            {/* Category tabs list */}
            <div className="p-6 border-end shadow-sm bg-body-secondary category-wrapper" data-simplebar>
              <div className="nav flex-md-column nav-pills gap-4">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`nav-link text-reset bg-body-secondary h-22 min-w-24 rounded avatar flex-column p-3 border-0 ${activeCategory === cat.name ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat.name)}
                  >
                    <img src={cat.icon} className="img-fluid size-8" alt={cat.name} />
                    <span className="fw-medium fs-13 mt-2">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Products Grid */}
            <div className="p-6 flex-grow-1 overflow-hidden d-flex flex-column" style={{ height: 'calc(100vh - 70px)' }}>
              
              {/* Filter controls and Search */}
              <div className="d-flex flex-wrap gap-3 justify-content-between align-items-center mb-6">
                <div className="d-flex align-items-center gap-3">
                  <h5 className="mb-0 fw-semibold">Products ({filteredProducts.length})</h5>
                  <div className="dropdown">
                    <button className="btn btn-outline-light border bg-body-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                      Filter & Sort
                    </button>
                    <ul className="dropdown-menu">
                      <li><button className="dropdown-item" onClick={() => setFilterStock('all')}>All Stock</button></li>
                      <li><button className="dropdown-item" onClick={() => setFilterStock('instock')}>In Stock Only</button></li>
                      <li><button className="dropdown-item" onClick={() => setFilterStock('outofstock')}>Out of Stock</button></li>
                      <li><button className="dropdown-item" onClick={() => setFilterStock('lowstock')}>Low Stock Warning</button></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><button className="dropdown-item" onClick={() => setSortOrder('price-low')}>Price: Low to High</button></li>
                      <li><button className="dropdown-item" onClick={() => setSortOrder('price-high')}>Price: High to Low</button></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><button className="dropdown-item text-danger" onClick={() => { setFilterStock('all'); setSortOrder('default'); }}>Reset Filter</button></li>
                    </ul>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <div className="position-relative">
                    <input type="text" className="form-control ps-9" placeholder="Search product..." value={search} onChange={e => setSearch(e.target.value)} />
                    <i data-lucide="search" className="size-4 icon-dark position-absolute top-50 start-0 ms-3 translate-middle-y"></i>
                  </div>
                </div>
              </div>

              {/* Grid cards */}
              <div className="flex-grow-1 overflow-y-auto px-1">
                <div className="row g-4 pb-4">
                  {filteredProducts.length === 0 ? (
                    <div className="col-12 text-center py-5 text-muted">No products found matching the criteria.</div>
                  ) : (
                    filteredProducts.map(p => {
                      const isAdded = cart.some(item => item.id === p.id);
                      return (
                        <div className="col-sm-6 col-md-4 col-xl-3" key={p.id}>
                          <div className="card mb-0 pos-product-card border hover-shadow h-100">
                            <div className="card-body p-3 d-flex flex-column justify-content-between">
                              <div className="bg-body-tertiary bg-opacity-75 rounded p-3 mb-3 text-center position-relative">
                                <img src={p.image} className="img-fluid object-fit-cover rounded" style={{ height: '120px' }} alt={p.name} />
                                {p.stock === 0 && (
                                  <span className="position-absolute top-50 start-50 translate-middle badge bg-danger py-2 px-3">OUT OF STOCK</span>
                                )}
                                {p.stock > 0 && p.stock <= 5 && (
                                  <span className="position-absolute top-0 end-0 m-2 badge bg-warning">ONLY {p.stock} LEFT</span>
                                )}
                              </div>
                              <div>
                                <a href="#!" className="mb-1 d-block link link-custom fw-medium fs-16 text-truncate">{p.name}</a>
                                <p className="text-muted small mb-3">SKU: {p.sku}</p>
                                <div className="d-flex justify-content-between align-items-center">
                                  <h5 className="mb-0 fw-bold text-primary">${p.price.toFixed(2)}</h5>
                                  <button
                                    type="button"
                                    className={`btn btn-icon size-9 rounded-circle ${isAdded ? 'btn-success' : 'btn-primary'}`}
                                    onClick={() => addToCart(p)}
                                    disabled={p.stock === 0}
                                  >
                                    <i data-lucide={isAdded ? "check" : "plus"} className="size-4"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Side: Cart Summary (col-lg-5) */}
        <div className="col-lg-5 col-xl-4 col-xxl-3 border-start position-relative d-flex flex-column bg-card shadow-sm" style={{ height: '100vh', zIndex: 10 }}>
          <div className="p-4 border-bottom d-flex align-items-center justify-content-between bg-light bg-opacity-20">
            <h6 className="mb-0 fs-17 fw-semibold">Order ID: #GOT1698</h6>
            {cart.length > 0 && (
              <button type="button" className="btn btn-sm btn-link text-danger text-decoration-none border-0" onClick={clearCart}>
                Clear All
              </button>
            )}
          </div>

          <div className="btn-light d-flex flex-wrap align-items-center gap-3 p-3 bg-light bg-opacity-50 border rounded m-4 mb-2">
            <img src={customerData.avatar} alt="Avatar" className="img-fluid size-11 rounded-circle" />
            <div className="flex-grow-1">
              <a href="#!" className="fw-medium text-reset d-block fs-sm">{customerData.name}</a>
              <p className="text-muted text-truncate overflow-hidden fs-xs mb-0">{customerData.level} • {customerData.points} Points</p>
            </div>
            <button className="btn btn-active-dark btn-icon flex-shrink-0 border-0" onClick={() => setActiveModal('editCustomer')}>
              <i className="ri-pencil-line fs-14"></i>
            </button>
          </div>

          {/* Scrollable Container (Order Details) */}
          <div className="px-6 mx-n6 order-details overflow-y-auto flex-grow-1" style={{ marginBottom: '80px' }}>
            
            {/* Cart item list title */}
            <div className="pb-5">
              <div className="d-flex mb-3 justify-content-between align-items-center px-6">
                <h6 className="mb-0">Order Detail <span className="text-muted fw-normal ms-1">(Items: {cart.reduce((a, b) => a + b.quantity, 0)})</span></h6>
                {cart.length > 0 && (
                  <a href="#!" className="link link-custom-primary text-decoration-underline fs-sm" onClick={(e) => { e.preventDefault(); clearCart(); }}>Clear All</a>
                )}
              </div>
              
              {cart.length === 0 ? (
                <div className="my-auto text-center text-muted px-6" id="emptyOrderMessage">
                  <img src="/assets/no-order-CCjZwO4J.svg" alt="No Order" className="size-48 mx-auto mb-3 opacity-50" />
                  <p className="mb-0 fs-sm">Your cart is empty. Click "+" on products to add items.</p>
                </div>
              ) : (
                <div className="table-responsive pos-system-table px-6">
                  <table className="table table-borderless align-middle mb-0 text-nowrap">
                    <thead>
                      <tr className="border-bottom text-muted fs-xs">
                        <th>Product</th>
                        <th>QTY</th>
                        <th className="text-end">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map(item => (
                        <tr key={item.id}>
                          <td className="overflow-hidden text-truncate min-w-48 max-w-48 fw-medium">
                            {item.name}
                          </td>
                          <td>
                            <div className="input-spin-group input-borderless p-1 h-10 border rounded d-inline-flex align-items-center">
                              <button
                                type="button"
                                className="input-spin-minus btn bg-light text-reset p-1 border-0 size-7 d-flex justify-content-center align-items-center"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                <i data-lucide="minus" className="size-3"></i>
                              </button>
                              <input
                                type="text"
                                className="input-spin form-control text-center border-0 h-8 fs-13"
                                style={{ width: '32px' }}
                                readOnly
                                value={item.quantity}
                              />
                              <button
                                type="button"
                                className="input-spin-plus btn bg-light text-reset p-1 border-0 size-7 d-flex justify-content-center align-items-center"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <i data-lucide="plus" className="size-3"></i>
                              </button>
                            </div>
                          </td>
                          <td className="text-end">
                            <span className="item-price me-2 fw-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                            <a href="#!" onClick={(e) => { e.preventDefault(); removeFromCart(item.id); }}>
                              <i data-lucide="trash" className="size-4 text-danger trash-icon align-text-top"></i>
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Calculations, Select Method & Process to Payment */}
            {cart.length > 0 && (
              <>
                <div className="bg-light bg-opacity-50 px-3 py-4 border rounded mx-6 mb-4">
                  <div className="bg-body-secondary border rounded-pill px-3 py-2 mb-4">
                    <div className="d-flex gap-3 align-items-center">
                      <i data-lucide="badge-percent" className="icon-primary size-6"></i>
                      <span className="flex-grow-1 fs-sm">Discount {(appliedDiscountRate * 100).toFixed(0)}%</span>
                      <a href="#!" className="bg-primary-subtle py-1 px-4 fs-13 border border-primary-subtle text-primary rounded-pill text-decoration-none" onClick={(e) => { e.preventDefault(); setDiscountApplied(!discountApplied); }}>
                        {discountApplied ? 'Remove' : 'Apply'}
                      </a>
                    </div>
                  </div>

                  <div className="px-3 d-flex flex-column gap-3 fs-sm text-muted">
                    <div className="d-flex justify-content-between">
                      <span>Sub Total</span>
                      <span className="fw-medium text-dark" id="subtotalAmount">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Discount</span>
                      <span className="text-danger" id="discountAmount">- ${discount.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>GST (18%)</span>
                      <span className="fw-medium text-dark" id="gstAmount">${gst.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Service Charge</span>
                      <span className="fw-medium text-dark" id="serviceChargeAmount">${serviceCharge.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between fw-bold text-dark fs-15 border-top pt-2 mt-2">
                      <span>Total Payable</span>
                      <span className="text-primary" id="totalPayableAmount">${totalPayable.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mx-6 my-4">
                  <h6 className="mb-3 fs-14 fw-semibold text-muted">Select Method</h6>
                  <div className="d-flex flex-wrap gap-2">
                    {[
                      { name: 'Cash', modal: 'cash' },
                      { name: 'Card', modal: 'card' },
                      { name: 'UPI / Scan', modal: 'upi' },
                      { name: 'Bank Transfer', modal: 'bank' },
                      { name: 'Split Payment', modal: 'split' }
                    ].map(method => {
                      const isActive = selectedMethod === method.name;
                      return (
                        <button
                          key={method.name}
                          type="button"
                          className={`btn btn-sm py-1 px-3 ${isActive ? 'btn-primary' : 'btn-outline-light border bg-body-secondary'} pay-method`}
                          onClick={() => {
                            setSelectedMethod(method.name);
                            setCashReceived('');
                            setChangeToReturn(0);
                            setActiveModal(method.modal);
                          }}
                        >
                          {method.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mx-6 mb-4">
                  <button type="button" className="btn btn-primary w-100" onClick={() => {
                    const map = {
                      'Cash': 'cash',
                      'Card': 'card',
                      'UPI / Scan': 'upi',
                      'Bank Transfer': 'bank',
                      'Split Payment': 'split'
                    };
                    setActiveModal(map[selectedMethod] || 'cash');
                  }}>Process to Payment</button>
                </div>
              </>
            )}

          </div>

          {/* Advance features toolbar - fixed at bottom */}
          <div className="d-flex flex-wrap text-center justify-content-between border-top py-3 px-4 bg-body-secondary advance-features w-100 position-absolute bottom-0 start-0" style={{ zIndex: 11 }}>
            <div className="w-20">
              <a href="#!" className="text-reset text-decoration-none" onClick={(e) => { e.preventDefault(); if (cart.length > 0) setActiveModal('payment-direct'); }}>
                <span className="avatar size-10 mx-auto bg-purple-subtle rounded-circle text-purple mb-1 d-flex align-items-center justify-content-center">
                  <i data-lucide="euro" className="size-4"></i>
                </span>
                <span className="fs-xxs d-block text-muted">Payment</span>
              </a>
            </div>
            <div className="w-20">
              <a href="#!" className="text-reset text-decoration-none" onClick={(e) => { e.preventDefault(); if (cart.length > 0) { setHoldReference(''); setHoldNotes(''); setActiveModal('hold'); } }}>
                <span className="avatar size-10 mx-auto bg-success-subtle rounded-circle text-success mb-1 d-flex align-items-center justify-content-center">
                  <i data-lucide="pause" className="size-4"></i>
                </span>
                <span className="fs-xxs d-block text-muted">Hold</span>
              </a>
            </div>
            <div className="w-20">
              <a href="#!" className="text-reset text-decoration-none" onClick={(e) => { e.preventDefault(); if (cart.length > 0) setActiveModal('invoice'); }}>
                <span className="avatar size-10 mx-auto bg-pink-subtle rounded-circle text-pink mb-1 d-flex align-items-center justify-content-center">
                  <i data-lucide="file-text" className="size-4"></i>
                </span>
                <span className="fs-xxs d-block text-muted">Invoice</span>
              </a>
            </div>
            <div className="w-20">
              <a href="#!" className="text-reset text-decoration-none" onClick={(e) => { e.preventDefault(); if (cart.length > 0) setActiveModal('payLater'); }}>
                <span className="avatar size-10 mx-auto bg-secondary-subtle rounded-circle text-secondary mb-1 d-flex align-items-center justify-content-center">
                  <i data-lucide="clock" className="size-4"></i>
                </span>
                <span className="fs-xxs d-block text-muted">Pay Later</span>
              </a>
            </div>
            <div className="w-20">
              <a href="#!" className="text-reset text-decoration-none" onClick={(e) => { e.preventDefault(); setActiveModal('history'); }}>
                <span className="avatar size-10 mx-auto bg-danger-subtle rounded-circle text-danger mb-1 d-flex align-items-center justify-content-center">
                  <i data-lucide="folder-clock" className="size-4"></i>
                </span>
                <span className="fs-xxs d-block text-muted">History</span>
              </a>
            </div>
          </div>

        </div>

      </div>

      {/* Modals rendering */}
      {activeModal && (
        <>
          <div className="modal fade show" style={{ display: 'block', zIndex: 1055 }} tabIndex="-1" role="dialog" aria-modal="true">
            <div className={`modal-dialog modal-dialog-centered ${
              activeModal === 'invoice' || activeModal === 'history' ? 'modal-xl' :
              activeModal === 'split' ? 'modal-lg' :
              activeModal === 'upi' ? 'modal-sm' :
              activeModal === 'payment' || activeModal === 'payment-direct' ? 'w-96' : ''
            }`}>
              <div className="modal-content">
                {renderModalContent()}
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" style={{ zIndex: 1050 }} onClick={() => setActiveModal(null)}></div>
        </>
      )}

    </div>
  );
}

