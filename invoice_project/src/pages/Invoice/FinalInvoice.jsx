import React from 'react';
import logo from "../../assets/images/logo.png";

const FinalInvoice = () => {
  return (
    <div className="min-w-4xl mx-auto" style={{ fontFamily: "poppins, serif" }}>
      <div className="flex items-center justify-between mb-4">
        <img src={logo} alt="Invoice Logo" className="w-24 h-24 object-contain" />
        <h1 className="text-4xl font-extrabold uppercase">Invoice</h1>
      </div>

      <div className='flex items-center justify-center'>
        <div className=''>
          <p className='text-xs'>Invoice to:</p>
          <div>
            <span className='block'>Crossroads Career</span>
            <span>Consultations Pvt. Ltd</span>


            <h6 className='text-xs font-extrabold'>Address</h6>
            <p>Edappally, Kochi - 6820 42</p>
            <p>Kerala</p>
          </div>

          <div>
            <span>GSTIN: 3242232343434IZU</span>
            <p>P: +91 9633175758</p>
            <p>W: crossroads.com</p>
          </div>
        </div>

        <div className=''>
          <p className='text-xs'>Invoice from:</p>
          <div>
            <span>MarketBytes</span>
            <p>WebWorks Pvt. Ltd</p>
          </div>

          <div>
            <span>GSTIN: 3242232343434IZU</span>
            <p>P: +91 9633175758</p>
            <p>W: crossroads.com</p>
          </div>
        </div>
      </div>


      <div>

      </div>
    </div>
  );
};

export default FinalInvoice;
