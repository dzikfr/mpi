import React, { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

type Product = {
  id_product: number;
  product_name: string;
  price: number;
  type: string;
  stock: number;
};

const ProductTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id_product">>({
    product_name: "",
    price: 0,
    type: "",
    stock: 0,
  });

  const fetchProducts = async () => {
    const res = await apiRequest("GET", "/api/event");
    setProducts(res.data);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "number" ? +e.target.value : e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (isEdit && selectedProduct) {
      await apiRequest("PUT", `/api/event/${selectedProduct.id_product}`, form);
    } else {
      await apiRequest("POST", "/api/event", form);
    }
  };

  const handleDelete = async (id: number) => {
    await apiRequest("DELETE", `/api/event/${id}`);
  };

  const openAddModal = () => {
    setIsEdit(false);
    setForm({ product_name: "", price: 0, type: "", stock: 0 });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setIsEdit(true);
    setSelectedProduct(product);
    setForm({
      product_name: product.product_name,
      price: product.price,
      type: product.type,
      stock: product.stock,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Product List</h1>
        <button
          onClick={openAddModal}
          className="bg-white text-black px-4 py-2 rounded-md hover:bg-base-200 hover:text-white transition"
        >
          Add Product
        </button>
      </div>

      <table className="min-w-full border text-sm text-left">
        <thead className="bg-base-600">
          <tr>
            <th className="px-4 py-2 border">No.</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Price</th>
            <th className="px-4 py-2 border">Type</th>
            <th className="px-4 py-2 border">Stock</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod, i) => (
            <tr key={prod.id_product} className="">
              <td className="px-4 py-2 border">{i + 1}</td>
              <td className="px-4 py-2 border">{prod.product_name}</td>
              <td className="px-4 py-2 border">Rp {prod.price}</td>
              <td className="px-4 py-2 border">{prod.type}</td>
              <td className="px-4 py-2 border">{prod.stock}</td>
              <td className="px-4 py-2 border space-x-2">
                <button
                  onClick={() => openEditModal(prod)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-base-200 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(prod.id_product)}
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-base-200"
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
              {isEdit ? "Edit Product" : "Add Product"}
            </h2>
            <div className="space-y-3">
              <input
                name="product_name"
                value={form.product_name}
                onChange={handleInputChange}
                placeholder="Product Name"
                className="w-full border p-2 rounded"
              />
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleInputChange}
                placeholder="Price"
                className="w-full border p-2 rounded"
              />
              <input
                name="type"
                value={form.type}
                onChange={handleInputChange}
                placeholder="Type"
                className="w-full border p-2 rounded"
              />
              <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleInputChange}
                placeholder="Stock"
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

export default ProductTable;
