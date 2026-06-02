// pages/Dashboard/DashboardPage.jsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageBreadcrumb from '../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../configs/routes';

const kpiCards = [
  {
    id: 'today-sales',
    title: 'Today Sales',
    value: '$12,450',
    change: '+8.4%',
    trend: 'up',
    icon: 'dollar-sign',
    color: 'primary',
  },
  {
    id: 'total-orders',
    title: 'Total Orders',
    value: '1,865',
    change: '+5.2%',
    trend: 'up',
    icon: 'shopping-cart',
    color: 'secondary',
  },
  {
    id: 'net-profit',
    title: 'Net Profit',
    value: '$4,320',
    change: '+6.8%',
    trend: 'up',
    icon: 'trending-up',
    color: 'success',
  },
  {
    id: 'sales-return',
    title: 'Sales Return',
    value: '$540',
    change: '-2.1%',
    trend: 'down',
    icon: 'rotate-ccw',
    color: 'danger',
  },
];

const lowStockItems = [
  { id: 1, name: 'Urban Sneakers', sku: 'SH-204', stock: 5, img: '/assets/img-21-DthxwD3u.png' },
  { id: 2, name: 'Leather Shoulder Bag', sku: 'BG-112', stock: 3, img: '/assets/img-02-ClVfz9I5.png' },
  { id: 3, name: 'Wireless Headphones', sku: 'EL-088', stock: 8, img: '/assets/img-03-oTTY_McP.png' },
  { id: 4, name: 'Denim Jeans', sku: 'CL-321', stock: 2, img: '/assets/img-04-DZ4OtBxS.png' },
];

const recentOrders = [
  { id: '#ORD-4592', customer: 'Alex Morgan', amount: '$1,256', status: 'completed', date: '30 May 2026' },
  { id: '#ORD-4591', customer: 'Sarah Johnson', amount: '$890', status: 'pending', date: '30 May 2026' },
  { id: '#ORD-4590', customer: 'Mike Davis', amount: '$2,340', status: 'completed', date: '29 May 2026' },
  { id: '#ORD-4589', customer: 'Emily Clark', amount: '$560', status: 'cancelled', date: '29 May 2026' },
  { id: '#ORD-4588', customer: 'James Wilson', amount: '$1,780', status: 'completed', date: '28 May 2026' },
];

function KpiCard({ title, value, change, trend, icon, color, id }) {
  const isUp = trend === 'up';
  return (
    <div className="col-xl-3 col-md-6">
      <div className="card">
        <div className="card-body d-flex justify-content-between" id={id}>
          <div>
            <p className="mb-3">{title}</p>
            <h5 className="mb-5 fs-22">{value}</h5>
            <span className="text-muted">
              <span className={`text-${isUp ? 'success' : 'danger'} me-1`}>
                <i data-lucide={isUp ? 'arrow-big-up-dash' : 'arrow-big-down-dash'} className="size-4"></i>
                {change}
              </span>
              From Last Week
            </span>
          </div>
          <div className="position-relative size-10 widget-icon">
            <div className={`position-absolute top-0 h-100 w-100 rounded-2 bg-${color} bg-opacity-25 bg-layer z-0`}></div>
            <div className={`rounded-2 size-9 avatar ${color}-gradient position-relative`}>
              <i data-lucide={icon} className="size-5 text-white"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  // Re-init Lucide icons after mount
  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  }, []);

  return (
    <div className="container-fluid">
      <PageBreadcrumb
        title="Main Dashboard"
        breadcrumbs={[{ label: 'Dashboards' }, { label: 'Main' }]}
      />

      <div className="row g-5">
        {/* Left Column */}
        <div className="col-xxl-9">
          <div className="row">
            {/* KPI Cards */}
            {kpiCards.map((card) => (
              <KpiCard key={card.id} {...card} />
            ))}

            {/* Sales Trend Chart Placeholder */}
            <div className="col-xl-8">
              <div className="card">
                <div className="card-body pb-0">
                  <div className="mb-3 d-flex flex-wrap gap-2 justify-content-between align-items-center">
                    <h6 className="mb-0">
                      Sales Trend <span className="text-muted fw-normal ms-1">(75% sales growth)</span>
                    </h6>
                    <div className="dropdown">
                      <a href="#!" className="link link-custom-primary badge border d-flex align-items-center fs-12 py-1 px-3 dropdown-toggle"
                        data-bs-toggle="dropdown">Recent</a>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item" href="#!">Recent</a>
                        <a className="dropdown-item" href="#!">Weekly</a>
                        <a className="dropdown-item" href="#!">Monthly</a>
                        <a className="dropdown-item" href="#!">Yearly</a>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex gap-6 mb-4">
                    <div className="d-flex gap-1 align-items-center">
                      <i data-lucide="squircle" className="icon-secondary size-4"></i>
                      <span>Total Sales</span>
                    </div>
                    <div className="d-flex gap-1 align-items-center">
                      <i data-lucide="squircle" className="icon-primary size-4"></i>
                      <span>Total Orders</span>
                    </div>
                  </div>
                  <div id="salesTrend" style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p className="text-muted">Chart loading... (ApexCharts)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Staff Performance */}
            <div className="col-lg-6 col-xl-4">
              <div className="card card-h-100">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h6 className="mb-0">Staff Performance</h6>
                  <Link to={ROUTES.REPORTS_SALES} className="fs-sm text-muted">View Report</Link>
                </div>
                <div className="card-body text-center">
                  <div className="row text-center g-3 mt-3">
                    <div className="col-4">
                      <div className="border border-dashed p-3 rounded">
                        <h5 className="mb-1 fs-lg">82%</h5>
                        <p className="text-muted fs-xs mb-0">Best</p>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="border border-dashed p-3 rounded">
                        <h5 className="mb-1 fs-lg">1,248</h5>
                        <p className="text-muted fs-xs mb-0">Orders</p>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="border border-dashed p-3 rounded">
                        <h5 className="mb-1 fs-lg">₹4.8L</h5>
                        <p className="text-muted fs-xs mb-0">Sales</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Low Stock Items */}
            <div className="col-lg-6 col-xl-5">
              <div className="card">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h6 className="mb-0">Low Stock Items</h6>
                  <Link to={ROUTES.INVENTORY_ALERTS} className="link link-custom-primary">
                    View All <i className="ri-arrow-right-line"></i>
                  </Link>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-borderless text-nowrap align-middle mb-0">
                      <thead>
                        <tr>
                          <th className="ps-4">Product</th>
                          <th>SKU</th>
                          <th>Stock</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lowStockItems.map((item) => (
                          <tr key={item.id}>
                            <td className="ps-4">
                              <div className="d-flex align-items-center gap-3">
                                <div className="size-10 avatar flex-shrink-0 bg-light rounded-1">
                                  <img src={item.img} className="img-fluid size-9" alt={item.name} />
                                </div>
                                <div>
                                  <a href="#!" className="text-reset d-block fw-medium mb-1">{item.name}</a>
                                </div>
                              </div>
                            </td>
                            <td className="text-muted">{item.sku}</td>
                            <td>
                              <span className={`badge bg-${item.stock <= 3 ? 'danger' : 'warning'}-subtle text-${item.stock <= 3 ? 'danger' : 'warning'}`}>
                                {item.stock} left
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="col-xl-7">
              <div className="card">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h6 className="mb-0">Recent Orders</h6>
                  <Link to={ROUTES.ORDERS} className="link link-custom-primary">
                    View All <i className="ri-arrow-right-line"></i>
                  </Link>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-borderless align-middle mb-0">
                      <thead>
                        <tr>
                          <th className="ps-4">Order ID</th>
                          <th>Customer</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order) => (
                          <tr key={order.id}>
                            <td className="ps-4">
                              <a href="#!" className="link link-custom-primary fw-medium">{order.id}</a>
                            </td>
                            <td>{order.customer}</td>
                            <td className="fw-medium">{order.amount}</td>
                            <td>
                              <span className={`badge bg-${order.status === 'completed' ? 'success' : order.status === 'pending' ? 'warning' : 'danger'}-subtle text-${order.status === 'completed' ? 'success' : order.status === 'pending' ? 'warning' : 'danger'}`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </td>
                            <td className="text-muted">{order.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar Widgets */}
        <div className="col-xxl-3">
          <div className="card mb-5">
            <div className="card-body">
              <h6 className="mb-3">Quick Stats</h6>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Total Products</span>
                <strong>1,248</strong>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Active Customers</span>
                <strong>324</strong>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Total Suppliers</span>
                <strong>48</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Staff Members</span>
                <strong>12</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
