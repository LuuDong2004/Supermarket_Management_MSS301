// pages/Dashboard/Products/ProductListPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

const initialProducts = [
  {id: 'PEP-19115', name: 'Blouse Ruffle Tube top', category: 'Fashion', price: '$14.99', discountPrice: '$11.99', inStock: true, discount: true, brand: 'Zara', cost: '$8.50', quantity: 154, revenue: '$15,236', status: 'Published', image: '/assets/images/products/img-01.png'},
  {id: 'PEP-19116', name: 'Cotton T-shirt', category: 'Apparel', price: '$24.99', discountPrice: '$24.99', inStock: true, discount: false, brand: 'H&M', cost: '$12.00', quantity: 89, revenue: '$12,350', status: 'Published', image: '/assets/images/products/img-02.png'},
  {id: 'PEP-19117', name: 'Wireless Headphones', category: 'Electronics', price: '$99.99', discountPrice: '$79.99', inStock: true, discount: true, brand: 'Sony', cost: '$55.00', quantity: 45, revenue: '$8,750', status: 'Published', image: '/assets/images/products/img-03.png'},
  {id: 'PEP-19118', name: 'Leather Wallet', category: 'Accessories', price: '$35.50', discountPrice: '$35.50', inStock: false, discount: false, brand: 'Gucci', cost: '$20.00', quantity: 0, revenue: '$0', status: 'Inactive', image: '/assets/images/products/img-04.png'},
  {id: 'PEP-19119', name: 'Smart Watch', category: 'Electronics', price: '$199.99', discountPrice: '$149.99', inStock: true, discount: true, brand: 'Apple', cost: '$110.00', quantity: 32, revenue: '$17,890', status: 'Published', image: '/assets/images/products/img-05.png'},
  {id: 'PEP-19120', name: 'Running Shoes', category: 'Footwear', price: '$79.99', discountPrice: '$79.99', inStock: true, discount: false, brand: 'Nike', cost: '$45.00', quantity: 67, revenue: '$9,875', status: 'Published', image: '/assets/images/products/img-06.png'},
  {id: 'PEP-19121', name: 'Denim Jeans', category: 'Fashion', price: '$45.99', discountPrice: '$34.99', inStock: true, discount: true, brand: "Levi's", cost: '$25.00', quantity: 120, revenue: '$13,450', status: 'Published', image: '/assets/images/products/img-07.png'},
  {id: 'PEP-19122', name: 'Sunglasses', category: 'Accessories', price: '$29.99', discountPrice: '$29.99', inStock: false, discount: false, brand: 'Ray-Ban', cost: '$15.00', quantity: 0, revenue: '$0', status: 'Inactive', image: '/assets/images/products/img-08.png'},
  {id: 'PEP-19123', name: 'Backpack', category: 'Bags', price: '$59.99', discountPrice: '$44.99', inStock: true, discount: true, brand: 'Adidas', cost: '$30.00', quantity: 43, revenue: '$7,890', status: 'Published', image: '/assets/images/products/img-09.png'},
  {id: 'PEP-19124', name: 'Water Bottle', category: 'Accessories', price: '$19.99', discountPrice: '$19.99', inStock: true, discount: false, brand: 'Puma', cost: '$10.00', quantity: 150, revenue: '$3,000', status: 'Published', image: '/assets/images/products/img-10.png'}
];

export default function ProductListPage() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  }, [products]);

  const handleDelete = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container-fluid">
      <PageBreadcrumb title="Products List" breadcrumbs={[{ label: 'Dashboard', href: ROUTES.DASHBOARD }, { label: 'Products' }, { label: 'Products List' }]} />
      
      <div className="card">
        <div className="card-header">
          <div className="d-flex flex-wrap align-items-center gap-5">
            <div className="flex-grow-1">
              <h5 className="card-title mb-0">Products List</h5>
            </div>
            <div className="d-flex flex-wrap gap-2 flex-shrink-0">
              <Link to={ROUTES.PRODUCTS_ADD} className="btn btn-primary"><i className="ri-add-line align-bottom me-1"></i> Add Product</Link>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center">
            <div className="flex-shrink-0">
              <div className="position-relative">
                <input type="text" className="form-control ps-9" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search for ID, name..." />
                <i className="ri-search-line position-absolute top-50 start-0 ms-3 translate-middle-y text-muted"></i>
              </div>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <select className="form-select w-40" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
        <div className="card-body pt-0">
          <div className="table-card table-responsive">
            <table className="table table-borderless mb-0 text-nowrap align-middle">
              <thead>
                <tr className="bg-light border-bottom">
                  <th scope="col" className="text-muted fw-medium">Product ID</th>
                  <th scope="col" className="text-muted fw-medium">Product</th>
                  <th scope="col" className="text-muted fw-medium">Category</th>
                  <th scope="col" className="text-muted fw-medium">Price</th>
                  <th scope="col" className="text-muted fw-medium">QTY</th>
                  <th scope="col" className="text-muted fw-medium">Stock</th>
                  <th scope="col" className="text-muted fw-medium">Brand</th>
                  <th scope="col" className="text-muted fw-medium">Status</th>
                  <th scope="col" className="text-muted fw-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id}>
                    <td><span className="fw-medium text-primary">{product.id}</span></td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="avatar size-9 border rounded-1 p-1">
                          <img src={product.image} className="img-fluid size-8" alt={product.name} />
                        </div>
                        <span className="fw-medium">{product.name}</span>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td>
                      {product.discount ? (
                        <div>
                          <del className="text-muted me-2">{product.price}</del>
                          <span className="text-danger fw-bold">{product.discountPrice}</span>
                        </div>
                      ) : (
                        <span>{product.price}</span>
                      )}
                    </td>
                    <td>{product.quantity}</td>
                    <td>
                      <span className={`badge bg-${product.inStock ? 'success' : 'danger'}-subtle text-${product.inStock ? 'success' : 'danger'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td>{product.brand}</td>
                    <td>
                      <span className={`badge bg-${product.status === 'Published' ? 'success' : 'secondary'}-subtle text-${product.status === 'Published' ? 'success' : 'secondary'}`}>
                        {product.status}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button type="button" className="btn btn-sub-danger btn-icon size-8" onClick={() => handleDelete(product.id)}><i className="ri-delete-bin-line"></i></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
