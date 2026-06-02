// pages/Dashboard/Customers/CustomerAddPage.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageBreadcrumb from '../../../components/ui/PageBreadcrumb';
import { ROUTES } from '../../../configs/routes';

export default function CustomerAddPage() {
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, []);

  return (
    <>
      <div className="container-fluid">

    <div className="gap-2 page-heading mb-3 flex-column flex-md-row">
        <h6 className="flex-grow-1 mb-0">Customers Add</h6>
        <ul className="breadcrumb flex-shrink-0 mb-0">
            <li className="breadcrumb-item"><a href="#!">Customers</a></li>
            <li className="breadcrumb-item active">Customers Add</li>
        </ul>
    </div>
    <div className="row g-4">
        <div className="col-xl-7 col-xxl-8 order-2 order-xl-1">
            <div className="card">
                <div className="card-body">
                    <div className="tab-content" id="customerPillsTabContent">
                        <div className="tab-pane fade show active" id="basic-info" role="tabpanel" aria-labelledby="basic-info-tab">
                            <h5 className="card-title mb-2 fs-16">Basic Information</h5>
                            <p className="text-muted mb-6">Enter the essential details for the customer including name, email, phone, and type.</p>
                            <form>
                                <div className="row g-5">
                                    <div className="col-12">
                                        <label htmlFor="customerName" className="form-label">Full Name <span className="text-danger">*</span></label>
                                        <input type="text" className="form-control" id="customerName" placeholder="Enter full name" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="customerEmail" className="form-label">Email <span className="text-danger">*</span></label>
                                        <input type="email" className="form-control" id="customerEmail" placeholder="Enter email" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="customerSecondaryEmail" className="form-label">Secondary Email</label>
                                        <input type="email" className="form-control" id="customerSecondaryEmail" placeholder="Enter secondary email" />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="customerPhone" className="form-label">Phone <span className="text-danger">*</span></label>
                                        <input type="tel" className="form-control" id="customerPhone" placeholder="Enter phone number" required />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="customerAltPhone" className="form-label">Alternate Phone</label>
                                        <input type="tel" className="form-control" id="customerAltPhone" placeholder="Enter alternate phone" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label d-block">Gender</label>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="gender" id="genderMale" defaultValue="male" defaultChecked />
                                            <label className="form-check-label" htmlFor="genderMale">Male</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="gender" id="genderFemale" defaultValue="female" />
                                            <label className="form-check-label" htmlFor="genderFemale">Female</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="radio" name="gender" id="genderOther" defaultValue="other" />
                                            <label className="form-check-label" htmlFor="genderOther">Other</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="customerDOB" className="form-label">Date of Birth</label>
                                        <input type="text" className="form-control" data-datepicker data-date-format="dd-MM-yyyy" placeholder="Choose date" />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="customerType" className="form-label">Customer Type</label>
                                        <div id="customerType"></div>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="customerCompany" className="form-label">Company / Organization</label>
                                        <input type="text" className="form-control" id="customerCompany" placeholder="Enter company name" />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="customerDesignation" className="form-label">Designation / Job Title</label>
                                        <input type="text" className="form-control" id="customerDesignation" placeholder="Enter designation" />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="customerWebsite" className="form-label">Website / Social Profile</label>
                                        <input type="url" className="form-control" id="customerWebsite" placeholder="Enter website or social link" />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="customerStatus" className="form-label">Status</label>
                                        <div id="customerStatus"></div>
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="customerNotes" className="form-label">Notes</label>
                                        <textarea className="form-control" id="customerNotes" rows="3" placeholder="Enter additional notes"></textarea>
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label d-block">Preferred Contact Method</label>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="checkbox" id="contactEmail" defaultValue="email" />
                                            <label className="form-check-label" htmlFor="contactEmail">Email</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="checkbox" id="contactPhone" defaultValue="phone" />
                                            <label className="form-check-label" htmlFor="contactPhone">Phone</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" type="checkbox" id="contactWhatsApp" defaultValue="whatsapp" />
                                            <label className="form-check-label" htmlFor="contactWhatsApp">WhatsApp</label>
                                        </div>
                                    </div>
                                    <div className="col-12 text-end">
                                        <button type="submit" className="btn btn-outline-light border me-1"><i className="ri-arrow-left-line me-1"></i>Prev</button>
                                        <button type="submit" className="btn btn-primary">Next <i className="ri-arrow-right-line ms-1"></i></button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="tab-pane fade" id="address" role="tabpanel" aria-labelledby="address-tab">
                            <h5 className="card-title mb-2 fs-16">Customer Address</h5>
                            <p className="text-muted mb-6">Fill in the customer's complete address details for accurate records and communication.</p>
                            <div className="row g-5">
                                <div className="col-12">
                                    <label htmlFor="customerAddress" className="form-label">Street Address</label>
                                    <input type="text" className="form-control" id="customerAddress" placeholder="Enter street address" />
                                </div>
                                <div className="col-md-8">
                                    <label htmlFor="customerAddressLine2" className="form-label">Address Line 2</label>
                                    <input type="text" className="form-control" id="customerAddressLine2" placeholder="Apartment, suite, etc. (optional)" />
                                </div>
                                <div className="col-md-6 col-xxl-4">
                                    <label htmlFor="customerCity" className="form-label">City</label>
                                    <input type="text" className="form-control" id="customerCity" placeholder="Enter city" />
                                </div>
                                <div className="col-md-6 col-xxl-4">
                                    <label htmlFor="customerState" className="form-label">State / Province</label>
                                    <input type="text" className="form-control" id="customerState" placeholder="Enter state" />
                                </div>
                                <div className="col-md-6 col-xxl-4">
                                    <label htmlFor="customerZip" className="form-label">ZIP / Postal Code</label>
                                    <input type="text" className="form-control" id="customerZip" placeholder="Enter ZIP code" />
                                </div>
                                <div className="col-md-6 col-xxl-4">
                                    <label htmlFor="customerCountry" className="form-label">Country</label>
                                    <div id="customerCountry"></div>
                                </div>
                                <div className="col-md-6 col-xxl-4">
                                    <label htmlFor="customerAddressType" className="form-label">Address Type</label>
                                    <div id="customerAddressType"></div>
                                </div>
                                <div className="col-xxl-8">
                                    <label htmlFor="customerLandmark" className="form-label">Landmark</label>
                                    <input type="text" className="form-control" id="customerLandmark" placeholder="Enter nearby landmark (optional)" />
                                </div>
                                <div className="col-12">
                                    <label htmlFor="customerNotes" className="form-label">Notes</label>
                                    <textarea className="form-control" id="customerNotes" rows="3" placeholder="Any additional address instructions or notes"></textarea>
                                </div>
                                <div className="col-12 text-end">
                                    <button type="submit" className="btn btn-outline-light border me-1"><i className="ri-arrow-left-line me-1"></i>Prev</button>
                                    <button type="submit" className="btn btn-primary">Next <i className="ri-arrow-right-line ms-1"></i></button>
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="membership" role="tabpanel" aria-labelledby="membership-tab">
                            <h5 className="card-title mb-2 fs-16">Customer Membership</h5>
                            <p className="text-muted mb-6">Manage the customer's membership plan, duration, benefits, and status for accurate tracking.</p>
                            <div className="row g-5">
                                <div className="col-md-6">
                                    <label htmlFor="membershipPlan" className="form-label">Membership Plan</label>
                                    <div id="membershipPlan"></div>
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="membershipStart" className="form-label">Start Date</label>
                                    <input type="text" className="form-control" data-datepicker data-date-format="dd-MM-yyyy" placeholder="Choose start date" />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="membershipEnd" className="form-label">End Date</label>
                                    <input type="text" className="form-control" data-datepicker data-date-format="dd-MM-yyyy" placeholder="Choose End date" />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label d-block">Status</label>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="membershipStatus" id="statusActive" defaultValue="active" defaultChecked />
                                        <label className="form-check-label" htmlFor="statusActive">Active</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="membershipStatus" id="statusInactive" defaultValue="inactive" />
                                        <label className="form-check-label" htmlFor="statusInactive">Inactive</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="membershipStatus" id="statusExpired" defaultValue="expired" />
                                        <label className="form-check-label" htmlFor="statusExpired">Expired</label>
                                    </div>
                                </div>
                                <div className="col-md-6 col-xxl-4">
                                    <label htmlFor="membershipFee" className="form-label">Membership Fee</label>
                                    <input type="number" className="form-control" id="membershipFee" placeholder="Enter fee amount" />
                                </div>
                                <div className="col-md-6 col-xxl-4">
                                    <label htmlFor="paymentMethod" className="form-label">Payment Method</label>
                                    <div id="paymentMethod"></div>
                                </div>
                                <div className="col-xxl-4">
                                    <label htmlFor="renewalReminder" className="form-label">Renewal Reminder</label>
                                    <input type="text" className="form-control" data-datepicker data-date-format="dd-MM-yyyy" placeholder="Choose renewal date" />
                                </div>
                                <div className="col-12">
                                    <label htmlFor="membershipBenefits" className="form-label">Membership Benefits</label>
                                    <textarea className="form-control" id="membershipBenefits" rows="3" placeholder="List any membership benefits"></textarea>
                                </div>
                                <div className="col-12">
                                    <label htmlFor="membershipNotes" className="form-label">Notes</label>
                                    <textarea className="form-control" id="membershipNotes" rows="3" placeholder="Additional notes about the membership"></textarea>
                                </div>
                                <div className="col-12 text-end">
                                    <button type="submit" className="btn btn-outline-light border me-1"><i className="ri-arrow-left-line me-1"></i>Prev</button>
                                    <button type="submit" className="btn btn-primary">Next <i className="ri-arrow-right-line ms-1"></i></button>
                                </div>
                            </div>
                        </div>
                        <div className="tab-pane fade" id="notes" role="tabpanel" aria-labelledby="notes-tab">
                            <h5 className="card-title mb-2 fs-16">Customer Notes & Remarks</h5>
                            <p className="text-muted mb-6">Add any additional information, follow-ups, or internal notes about the customer.</p>
                            <div className="row g-5">
                                <div className="col-12">
                                    <label htmlFor="customerNotes" className="form-label">Notes / Remarks</label>
                                    <textarea className="form-control" id="customerNotes" rows="5" placeholder="Additional information or remarks"></textarea>
                                </div>
                                <div className="col-12">
                                    <label htmlFor="internalNotes" className="form-label">Internal Notes</label>
                                    <textarea className="form-control" id="internalNotes" rows="3" placeholder="Private notes visible to staff only"></textarea>
                                </div>
                                <div className="col-md-6 col-xxl-4">
                                    <label htmlFor="followUpDate" className="form-label">Follow-up Date</label>
                                    <input type="text" className="form-control" data-datepicker data-date-format="dd-MM-yyyy" placeholder="Choose date" />
                                </div>
                                <div className="col-md-6 col-xxl-4">
                                    <label htmlFor="notePriority" className="form-label">Priority</label>
                                    <div id="notePriority"></div>
                                </div>
                                <div className="col-xxl-4">
                                    <label htmlFor="noteTags" className="form-label">Tags</label>
                                    <input type="text" className="form-control" id="noteTags" placeholder="Add tags" />
                                </div>
                                <div className="col-12">
                                    <label htmlFor="mainProductImage" className="avatar h-52 p-5 text-center border rounded cursor-pointer">
                                        <div>
                                            <i data-lucide="upload-cloud" className="text-muted"></i><br />
                                            <p className="mt-3 text-muted"><span className="fw-medium text-body">Drag & Drop</span> Documentes here or click to upload</p>
                                        </div>
                                    </label>
                                    <input type="file" id="mainProductImage" className="d-none" />
                                </div>
                                <div className="col-12 text-end">
                                    <button type="submit" className="btn btn-outline-light border">Cancel</button>
                                    <button type="submit" className="btn btn-primary">Add Customer</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="col-xl-5 col-xxl-4 order-1 order-xl-2">
            <div className="card">
                <div className="card-header">
                    <h5 className="card-title mb-0">Customer Settings</h5>
                </div>
                <div className="card-body">
                    <ul className="nav flex-column gap-4 nav-light mb-3" id="customerPillsTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link border text-start p-3 w-100 active" id="basic-info-tab" data-bs-toggle="pill" data-bs-target="#basic-info" type="button" role="tab" aria-controls="basic-info" aria-selected="true">
                                <span className="d-flex align-items-center gap-3">
                                    <span className="size-11 bg-body-secondary avatar border text-muted rounded">
                                        <i className="ri-user-line fs-xl"></i>
                                    </span>
                                    <span>
                                        <span className="d-block">Basic Info</span>
                                        <span className="text-muted fw-normal">Complete Customer Basic Information</span>
                                    </span>
                                </span>
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link border text-start p-3 w-100" id="address-tab" data-bs-toggle="pill" data-bs-target="#address" type="button" role="tab" aria-controls="address" aria-selected="false">
                                <span className="d-flex align-items-center gap-3">
                                    <span className="size-11 bg-body-secondary avatar border text-muted rounded">
                                        <i className="ri-map-pin-line fs-xl"></i>
                                    </span>
                                    <span>
                                        <span className="d-block">Address</span>
                                        <span className="text-muted fw-normal">Full Customer Address Details</span>
                                    </span>
                                </span>
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link border text-start p-3 w-100" id="membership-tab" data-bs-toggle="pill" data-bs-target="#membership" type="button" role="tab" aria-controls="membership" aria-selected="false">
                                <span className="d-flex align-items-center gap-3">
                                    <span className="size-11 bg-body-secondary avatar border text-muted rounded">
                                        <i className="ri-coupon-line fs-xl"></i>
                                    </span>
                                    <span>
                                        <span className="d-block">Membership</span>
                                        <span className="text-muted fw-normal">Detailed Customer Membership Information</span>
                                    </span>
                                </span>
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link border text-start p-3 w-100" id="notes-tab" data-bs-toggle="pill" data-bs-target="#notes" type="button" role="tab" aria-controls="notes" aria-selected="false">
                                <span className="d-flex align-items-center gap-3">
                                    <span className="size-11 bg-body-secondary avatar border text-muted rounded">
                                        <i className="ri-booklet-line fs-xl"></i>
                                    </span>
                                    <span>
                                        <span className="d-block">Notes</span>
                                        <span className="text-muted fw-normal">Important Customer Notes and Remarks</span>
                                    </span>
                                </span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    
</div>
    </>
  );
}
