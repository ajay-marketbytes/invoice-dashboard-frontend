import React from 'react';
import logo from "../../assets/images/logo.png";

const FinalInvoice = () => {
  return (
    <>
      <div className='mt-8'></div>
      <div className="w-[600px] h-[800px] mx-auto bg-white pl-10" style={{ fontFamily: "Poppins, serif" }}>
        <div className="flex items-center justify-between">
          <img src={logo} alt="Invoice Logo" className="w-24 h-24 object-contain" />
          <h1 className="text-xl font-extrabold uppercase text-gray-800 pr-12">Invoice</h1>
        </div>

        <div className="flex flex-row items-center justify-center relative bottom-4">
          <div className="mb-4 md:mb-0 relative left-24">
            <p className="text-[8px] text-gray-600">Invoice to:</p>
            <div>
              <span className="block text-xs font-semibold w-[80%]">Crossroads Career Consultations Pvt. Ltd</span>
              <h6 className="text-[8px] font-extrabold mt-2">Address</h6>
              <p className='text-[8px]'>Edappally, Kochi - 682042</p>
              <p className='text-[8px]'>Kerala</p>
            </div>
            <div className="mt-2">
              <span className="block text-[8px]"><span className='font-bold'>GSTIN: </span><span>3242232343434IZU</span></span>
              <p className='text-[8px]'><span className='font-bold'>P: </span><span>+91 9633175758</span></p>
              <p className='text-[8px]'><span className='font-bold'>W: </span><span>crossroads.com</span></p>
            </div>
          </div>

          <div className='relative left-6'>
            <p className="text-[8px] text-gray-600">Invoice from:</p>
            <div>
              <span className="block text-xs font-semibold w-[80%]">Crossroads Career Consultations Pvt. Ltd</span>
              <h6 className="text-[8px] font-extrabold mt-2">Address</h6>
              <p className='text-[8px]'>Edappally, Kochi - 682042</p>
              <p className='text-[8px]'>Kerala</p>
            </div>
            <div className="mt-2">
              <span className="block text-[8px]"><span className='font-bold'>GSTIN: </span><span>3242232343434IZU</span></span>
              <p className='text-[8px]'><span className='font-bold'>P: </span><span>+91 9633175758</span></p>
              <p className='text-[8px]'><span className='font-bold'>W: </span><span>crossroads.com</span></p>
            </div>
          </div>
        </div>

        <div>
          <div class="mx-auto">
            <table class="min-w-full h-[400px] border-collapse border border-zinc-300">
              <thead>
                <tr className='bg-black'>
                  <th class="p-2 text-white text-xs font-semibold uppercase">Item Description</th>
                  <th class="p-2 text-white text-xs font-semibold uppercase">Quantity</th>
                  <th class="p-2 text-white text-xs font-semibold uppercase">Price</th>
                  <th class="p-2 text-white text-xs font-semibold uppercase">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-[8px] font-extrabold border-l border-0 border-zinc-300 p-2">Social Media Management and Advertising Campaign Oversight</td>
                  <td class="text-[8px] font-extrabold border-l border-0 border-zinc-300 p-2">01</td>
                  <td class="text-[8px] font-extrabold border-l border-0 border-zinc-300 p-2">XXXX</td>
                  <td class="text-[8px] font-extrabold border-l border-0 border-zinc-300 p-2">XXXX</td>
                </tr>
                <tr>
                  <td class="text-[8px] font-extrabold border-l border-0 border-zinc-300 p-2">GST</td>
                  <td class="text-[8px] font-extrabold border-l border-0 border-zinc-300 p-2">18%</td>
                  <td class="text-[8px] font-extrabold border-l border-0 border-zinc-300 p-2">XXXX</td>
                  <td class="text-[8px] font-extrabold border-l border-0 border-zinc-300 p-2">XXXX</td>
                </tr>
              </tbody>
            </table>

            <div class="bg-black px-8 py-4">
              <p class="text-white text-[8px] font-extrabold flex items-center justify-between"><span>Grand Total:</span><span>XXXX.00 INR</span></p>
              <p class="text-white text-[8px] font-extrabold flex items-center justify-between"><span>Total In Words:</span><span>XXXXXXXXXXXXXXXXXXXXXXXX</span></p>
            </div>
          </div>
        </div>
        <div class="p-4">
          <p class="font-semibold text-[8px]">Note:</p>
          <p class="text-[8px] mt-2 text-zinc-700">
            Please make the payment of <strong>XXXXXX.XX</strong> to the bank account details provided above. Upon receiving the payment, we will proceed with the services/products as agreed and provide a
            receipt for the payment received.
          </p>
          <p class="text-[8px] mt-2 text-zinc-700">
            Thank you for choosing <strong>Noteworthy WebWorks Ltd.</strong> If you have any questions or require further assistance, please don't hesitate to contact us at
            <a href="tel:+917978272727" class="text-blue-500 underline">+91 7978 272727</a> or <a href="mailto:account@noteworthy.com" class="text-blue-500 underline">account@noteworthy.com</a>.
          </p>
        </div>
      </div>
    </>
  );
};

export default FinalInvoice;
