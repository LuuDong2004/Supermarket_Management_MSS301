// pages/Dashboard/Products/ProductAddPage.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

export default function ProductAddPage() {
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, []);

  return (
    <>
      <div className="container-fluid">

    <div className="gap-2 page-heading mb-3 flex-column flex-md-row">
        <h6 className="flex-grow-1 mb-0">Add Products</h6>
        <ul className="breadcrumb flex-shrink-0 mb-0">
            <li className="breadcrumb-item"><a href="#!">Products</a></li>
            <li className="breadcrumb-item active">Add Products</li>
        </ul>
    </div>
    <div className="row">
        <div className="col-xl-7 col-xxl-8">
            <form action="#">
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title mb-0">Product Information</h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-4">
                            <div className="col-12">
                                <label htmlFor="productName" className="form-label fw-medium">Product Name</label>
                                <input type="text" id="productName" className="form-control" placeholder="Enter product name" required />
                            </div>
                            <div className="col-12">
                                <label htmlFor="productDescription" className="form-label fw-medium">Description</label>
                                <textarea id="productDescription" className="form-control" rows="4" placeholder="Enter product description" required></textarea>
                            </div>
                            <div className="col-md-6 col-xxl-4">
                                <label htmlFor="categorySelect" className="form-label fw-medium">Category</label>
                                <div id="categorySelect"></div>
                            </div>
                            <div className="col-md-6 col-xxl-4">
                                <label htmlFor="brandName" className="form-label fw-medium">Brand</label>
                                <input type="text" id="brandName" className="form-control" placeholder="Brand name" required />
                            </div>
                            <div className="col-xxl-4">
                                <label htmlFor="modelName" className="form-label fw-medium">Model</label>
                                <input type="text" id="modelName" className="form-control" placeholder="Model name" required />
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-medium">Tags (Advanced)</label>
                                <input className="form-control" placeholder="Add tags — Example: Best Seller" required />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title mb-0">Pricing & Stock</h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-4">
                            <div className="col-md-6 col-xxl-4">
                                <label htmlFor="unitPrice" className="form-label fw-medium">Unit Price</label>
                                <input type="number" id="unitPrice" className="form-control" placeholder="₹0.00" required />
                            </div>
                            <div className="col-md-6 col-xxl-4">
                                <label htmlFor="costPrice" className="form-label fw-medium">Cost Price</label>
                                <input type="number" id="costPrice" className="form-control" placeholder="₹0.00" required />
                            </div>
                            <div className="col-md-6 col-xxl-4">
                                <label htmlFor="marginPercent" className="form-label fw-medium">Margin (%) — Auto Calculator</label>
                                <input type="number" id="marginPercent" className="form-control" placeholder="%" required />
                            </div>
                            <div className="col-md-6 col-xxl-4 d-flex align-items-center gap-2">
                                <div className="form-switch switch-light-primary mt-2">
                                    <input className="form-check-input" type="checkbox" id="availableSale" defaultChecked required />
                                    <label className="form-check-label" htmlFor="availableSale"></label>
                                </div>
                                <p className="mb-0">Available for Sale</p>
                            </div>
                            <div className="col-md-6 col-xxl-4">
                                <label htmlFor="stockQty" className="form-label fw-medium">Stock Quantity</label>
                                <div className="input-spin-group input-spin-primary">
                                    <button type="button" className="input-spin-minus"><i data-lucide="minus" className="size-4"></i></button>
                                    <input type="text" className="input-spin form-control" readonly defaultValue="1" />
                                    <button type="button" className="input-spin-plus"><i data-lucide="plus" className="size-4"></i></button>
                                </div>
                            </div>
                            <div className="col-md-6 col-xxl-4">
                                <label htmlFor="lowStockAlert" className="form-label fw-medium">Low Stock Alert</label>
                                <div className="input-spin-group input-spin-primary">
                                    <button type="button" className="input-spin-minus"><i data-lucide="minus" className="size-4"></i></button>
                                    <input type="text" id="lowStockAlert" className="input-spin form-control" readonly defaultValue="1" />
                                    <button type="button" className="input-spin-plus"><i data-lucide="plus" className="size-4"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title mb-0">Advanced Product Settings</h5>
                    </div>
                    <div className="card-body">
                        <div className="row g-4">
                            <div className="col-md-6 col-xxl-3">
                                <label htmlFor="sku" className="form-label fw-medium">SKU</label>
                                <input type="text" id="sku" className="form-control" placeholder="SKU" required />
                            </div>
                            <div className="col-md-6 col-xxl-3">
                                <label htmlFor="tax" className="form-label fw-medium">Tax (%)</label>
                                <input type="number" id="tax" className="form-control" placeholder="18" required />
                            </div>
                            <div className="col-md-6 col-xxl-3">
                                <label htmlFor="lowStockalert" className="form-label fw-medium">Low Stock Alert</label>
                                <input type="number" id="lowStockalert" className="form-control" placeholder="e.g. 5" required />
                            </div>
                            <div className="col-md-6 col-xxl-3">
                                <label htmlFor="trackInventory" className="form-label fw-medium">Track Inventory</label>
                                <div id="trackInventory"></div>
                            </div>
                            <div className="col-md-6 col-xxl-4">
                                <label htmlFor="expiryDate" className="form-label fw-medium">Expiry Date</label>
                                <input type="text" id="expiryDate" className="form-control" data-datepicker data-date-format="dd-MM-yyyy" placeholder="Choose date" required />
                            </div>
                            <div className="col-md-6 col-xxl-4">
                               <label htmlFor="Warranty" className="form-label fw-medium">Warranty</label> 
                               <div id="Warranty"></div>
                            </div>
                            <div className="col-md-6 col-xxl-4">
                                <label htmlFor="productStatus" className="form-label fw-medium">Product Status</label>
                                <div id="productStatus"></div>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="hsnCode" className="form-label fw-medium">HSN Code</label>
                                <input type="text" id="hsnCode" className="form-control" placeholder="Enter HSN code" required />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="returnPolicy" className="form-label fw-medium">Return Policy</label>
                                <div id="returnPolicy"></div>
                            </div>
                        </div>
                        <div className="mt-5 d-flex justify-content-end">
                            <button type="button" className="btn btn-active-secondary"><i className="ri-close-line me-1 align-middle"></i>Cancel</button>
                            <button type="submit" className="btn btn-primary ms-2">Save Product</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div className="col-xl-5 col-xxl-4">
            <div className="card position-sticky top-20">
                <div className="card-header">
                    <h5 className="card-title mb-0">Product Images & Media</h5>
                </div>
                <div className="card-body">
                    <div className="row g-4">
                        <div className="col-12">
                            <label htmlFor="mainProductImage" className="avatar h-52 p-5 text-center bg-light rounded cursor-pointer">
                                <div>
                                    <i data-lucide="upload-cloud"></i><br />
                                    <div className="mt-3"><strong>Drag & Drop</strong> images here or click to upload</div>
                                </div>
                            </label>
                            <input type="file" id="mainProductImage" className="d-none" />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="subImage1" className="avatar h-28 p-4 text-center bg-light rounded cursor-pointer">
                                <div>
                                    <i data-lucide="upload-cloud" className="size-5"></i>
                                    <div className="mt-1 fs-sm">Image 2</div>
                                </div>
                            </label>
                            <input type="file" id="subImage1" className="d-none" />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="subImage2" className="avatar h-28 p-4 text-center bg-light rounded cursor-pointer">
                                <div>
                                    <i data-lucide="upload-cloud" className="size-5"></i>
                                    <div className="mt-1 fs-sm">Image 3</div>
                                </div>
                            </label>
                            <input type="file" id="subImage2" className="d-none" />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="subImage3" className="avatar h-28 p-4 text-center bg-light rounded cursor-pointer">
                                <div>
                                    <i data-lucide="upload-cloud" className="size-5"></i>
                                    <div className="mt-1 fs-sm">Image 4</div>
                                </div>
                            </label>
                            <input type="file" id="subImage3" className="d-none" />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="imageTitle" className="form-label fw-medium">Image Title</label>
                            <input type="text" id="imageTitle" className="form-control" placeholder="title" />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="imageTags" className="form-label fw-medium">Image Tags</label>
                            <input type="text" id="imageTags" className="form-control" placeholder="e.g. packaging" />
                        </div>
                        <div className="col-12">
                            <label htmlFor="productVideoUrl" className="form-label fw-medium">Product Video URL</label>
                            <input type="text" id="productVideoUrl" className="form-control" placeholder="YouTube / Vimeo / MP4 link" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    
</div>
    </>
  );
}
