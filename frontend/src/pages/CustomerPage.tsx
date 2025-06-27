// src/components/CustomerTable.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

type Customer = {
  id_customer: number;
  customer_name: string;
  company_name: string;
  address: string;
  company?: string;
};

type Company = {
  id_company: number;
  company_name: string;
};

const API_URL = "http://localhost:3000/api/customers";
const COMPANY_API = "http://localhost:3000/api/companies";

const CustomerTable: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [form, setForm] = useState<Omit<Customer, "id_customer">>({
    customer_name: "",
    company_name: "",
    address: "",
  });

  const fetchCustomers = async () => {
    const res = await axios.get(API_URL);
    setCustomers(res.data.data);
  };

  const fetchCompanies = async () => {
    const res = await axios.get(COMPANY_API);
    setCompanies(res.data.data);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (isEdit && selectedCustomer) {
      await axios.put(`${API_URL}/${selectedCustomer.id_customer}`, form);
    } else {
      await axios.post(API_URL, form);
    }
    closeModal();
    fetchCustomers();
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure want to delete this customer?")) {
      await axios.delete(`${API_URL}/${id}`);
      fetchCustomers();
    }
  };

  const openAddModal = () => {
    setIsEdit(false);
    setForm({ customer_name: "", company_name: "", address: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (cust: Customer) => {
    setIsEdit(true);
    setSelectedCustomer(cust);
    setForm({
      customer_name: cust.customer_name,
      company_name: cust.company_name,
      address: cust.address,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  useEffect(() => {
    fetchCustomers();
    fetchCompanies();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Customer List</h1>
        <button
          onClick={openAddModal}
          className="bg-white text-black px-4 py-2 rounded-md hover:bg-base-200 hover:text-white transition"
        >
          Add Customer
        </button>
      </div>

      <table className="min-w-full border text-sm text-left">
        <thead className="bg-base-600">
          <tr>
            <th className="px-4 py-2 border">No.</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Company</th>
            <th className="px-4 py-2 border">Address</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((cust, i) => (
            <tr key={cust.id_customer}>
              <td className="px-4 py-2 border">{i + 1}</td>
              <td className="px-4 py-2 border">{cust.customer_name}</td>
              <td className="px-4 py-2 border">{cust.company}</td>
              <td className="px-4 py-2 border">{cust.address}</td>
              <td className="px-4 py-2 border space-x-2">
                <button
                  onClick={() => openEditModal(cust)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-base-200 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cust.id_customer)}
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-base-200 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black p-6 rounded-lg w-[90%] max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              {isEdit ? "Edit Customer" : "Add Customer"}
            </h2>
            <div className="space-y-3">
              <input
                name="customer_name"
                value={form.customer_name}
                onChange={handleInputChange}
                placeholder="Customer Name"
                className="w-full border p-2 rounded"
              />
              <select
                name="company_name"
                value={form.company_name}
                onChange={handleInputChange}
                className="w-full border p-2 rounded"
              >
                <option value="">Select Company</option>
                {companies.map((comp) => (
                  <option key={comp.id_company} value={comp.company_name}>
                    {comp.company_name}
                  </option>
                ))}
              </select>
              <input
                name="address"
                value={form.address}
                onChange={handleInputChange}
                placeholder="Address"
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {isEdit ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerTable;
