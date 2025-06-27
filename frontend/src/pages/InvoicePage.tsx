import { useEffect, useState } from "react";
import axios from "axios";
import CreateInvoiceModal from "./CreateInvoiceModal";

type Invoice = {
  invoice_number: number;
  date: string;
  payment_method: string;
  ppn: number;
  dp: number;
  grand_total: number;
  username: string;
  id_customer: number;
  id_company: number;
  company_name: string;
  address: string;
  customer_name: string;
  details: {
    id_product: number;
    product_name: string;
    product_type: string;
    invoice_number: number;
    qty: number;
    price: number;
  }[];
};

export default function InvoiceTable() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/invoices");
        setInvoices(res.data.data);
      } catch (err) {
        console.error("Gagal fetch invoice:", err);
      }
    };

    fetchInvoices();
  }, []);

  return (
    <div className="p-4">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Invoice</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-white text-black px-4 py-2 rounded-md hover:bg-base-200 hover:text-white transition"
          >
            Add Invoice
          </button>
        </div>

        <table className="min-w-full bg-base-600 rounded shadow text-sm">
          <thead>
            <tr className="bg-base-600 text-left">
              <th className="p-3">No</th>
              <th className="p-3">Invoice Number</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Company</th>
              <th className="p-3">Tanggal</th>
              <th className="p-3">Total</th>
              <th className="p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, i) => (
              <tr key={inv.invoice_number} className="border-t">
                <td className="p-3">{i + 1}</td>
                <td className="p-3">{inv.invoice_number}</td>
                <td className="p-3">{inv.customer_name}</td>
                <td className="p-3">{inv.company_name}</td>
                <td className="p-3">
                  {new Date(inv.date).toLocaleDateString()}
                </td>
                <td className="p-3">Rp {inv.grand_total.toLocaleString()}</td>
                <td className="p-3">
                  <button
                    onClick={() => setSelectedInvoice(inv)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center p-4 text-gray-500">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-base-600 rounded-lg shadow-lg w-full max-w-3xl p-6 relative">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              ✖
            </button>
            <h2 className="text-xl font-semibold mb-4">
              Invoice #{selectedInvoice.invoice_number}
            </h2>
            <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Customer:</strong> {selectedInvoice.customer_name}
              </div>
              <div>
                <strong>Company:</strong> {selectedInvoice.company_name}
              </div>
              <div>
                <strong>Alamat:</strong> {selectedInvoice.address}
              </div>
              <div>
                <strong>User:</strong> {selectedInvoice.username}
              </div>
              <div>
                <strong>Date:</strong>{" "}
                {new Date(selectedInvoice.date).toLocaleDateString()}
              </div>
              <div>
                <strong>Metode Bayar:</strong> {selectedInvoice.payment_method}
              </div>
              <div>
                <strong>PPN:</strong> Rp {selectedInvoice.ppn.toLocaleString()}
              </div>
              <div>
                <strong>DP:</strong> Rp {selectedInvoice.dp.toLocaleString()}
              </div>
              <div>
                <strong>Total:</strong> Rp{" "}
                {selectedInvoice.grand_total.toLocaleString()}
              </div>
            </div>
            <h3 className="font-semibold mt-4 mb-2">Detail Produk</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-2">Produk</th>
                  <th className="p-2">Tipe</th>
                  <th className="p-2">Qty</th>
                  <th className="p-2">Harga</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.details.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{item.product_name}</td>
                    <td className="p-2">{item.product_type}</td>
                    <td className="p-2">{item.qty}</td>
                    <td className="p-2">Rp {item.price.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showCreateModal && (
        <CreateInvoiceModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
