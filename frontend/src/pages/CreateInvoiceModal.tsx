import { useEffect, useState } from "react";
import axios from "axios";

type Company = {
  id_company: string;
  company_name: string;
};

type Customer = {
  id_customer: string;
  customer_name: string;
};

type Product = {
  id_product: string;
  product_name: string;
  price: number;
};

export default function CreateInvoiceModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [qty, setQty] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [details, setDetails] = useState<
    { id_product: number; qty: number; price: number }[]
  >([]);

  const [form, setForm] = useState({
    date: "",
    payment_method: "transfer",
    ppn: 0,
    dp: 0,
    user: "admin123",
    id_customer: "",
    id_company: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const [resCompanies, resCustomers, resProducts] = await Promise.all([
        axios.get("http://localhost:3000/api/companies"),
        axios.get("http://localhost:3000/api/customers"),
        axios.get("http://localhost:3000/api/products"),
      ]);
      setCompanies(resCompanies.data.data);
      setCustomers(resCustomers.data.data);
      setProducts(resProducts.data.data);
    };

    fetchData();
  }, []);

  const handleAddProduct = () => {
    if (!selectedProduct) return;

    const parsedId = parseInt(selectedProduct);
    if (isNaN(parsedId)) return;

    setDetails((prev) => [
      ...prev,
      {
        id_product: parsedId,
        qty,
        price,
      },
    ]);

    // Reset
    setSelectedProduct("");
    setQty(1);
    setPrice(0);
  };

  const handleSubmit = async () => {
    const payload = {
      ...form,
      id_customer: parseInt(form.id_customer),
      id_company: parseInt(form.id_company),
      ppn: Number(form.ppn),
      dp: Number(form.dp),
      details,
    };

    console.log("PAYLOAD =>", payload); // debug

    try {
      window.confirm(
        "Apakah anda yakin ingin membuat invoice ini?"
      ) && (await axios.post("http://localhost:3000/api/invoices", payload));
      
      alert("Invoice created!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Gagal create invoice.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-base-600 p-6 rounded-lg w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          ✖
        </button>
        <h2 className="text-lg font-bold mb-4">Create Invoice</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="p-2 border rounded"
          />
          <select
            value={form.payment_method}
            onChange={(e) =>
              setForm({ ...form, payment_method: e.target.value })
            }
            className="p-2 border rounded"
          >
            <option value="transfer">Transfer</option>
            <option value="cash">Cash</option>
          </select>

          <select
            value={form.id_customer}
            onChange={(e) => setForm({ ...form, id_customer: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="">Pilih Customer</option>
            {customers.map((c) => (
              <option key={c.id_customer} value={c.id_customer}>
                {c.customer_name}
              </option>
            ))}
          </select>

          <select
            value={form.id_company}
            onChange={(e) => setForm({ ...form, id_company: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="">Pilih Company</option>
            {companies.map((c) => (
              <option key={c.id_company} value={c.id_company}>
                {c.company_name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="PPN"
            value={form.ppn}
            onChange={(e) => setForm({ ...form, ppn: Number(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="DP"
            value={form.dp}
            onChange={(e) => setForm({ ...form, dp: Number(e.target.value) })}
            className="p-2 border rounded"
          />
        </div>

        {/* details */}

        <div className="border-t pt-4 mt-4">
          <h3 className="font-semibold mb-2">Produk</h3>
          <div className="flex items-center gap-2 mb-2">
            <select
              value={selectedProduct}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedProduct(val);
                const found = products.find((p) => p.id_product === val);
                setPrice(found ? found.price : 0);
              }}
              className="p-2 border rounded w-full"
            >
              <option value="">Pilih Produk</option>
              {products.map((p) => (
                <option key={p.id_product} value={p.id_product}>
                  {p.product_name}
                </option>
              ))}
            </select>

            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="p-2 border rounded w-20"
              placeholder="Qty"
            />
            <input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="p-2 border rounded w-32"
              placeholder="Harga"
            />
            <button
              onClick={handleAddProduct}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              + Produk
            </button>
          </div>

          <ul className="text-sm mb-4">
            {details.map((d, i) => {
              const product = products.find(
                (p) => parseInt(p.id_product) === d.id_product
              );
              return (
                <li key={i}>
                  {product?.product_name} - {d.qty} x Rp{" "}
                  {d.price.toLocaleString()}
                </li>
              );
            })}
          </ul>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit Invoice
        </button>
      </div>
    </div>
  );
}
