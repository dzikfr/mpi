import React, { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

type Asset = {
  id: string;
  name: string;
  type: string;
  description: string;
  quantity: number;
  available_quantity: number;
  notes: string;
  photo_url: string | null;
};

const AssetPage: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState<Omit<Asset, "id" | "photo_url">>({
    name: "",
    type: "",
    description: "",
    quantity: 0,
    available_quantity: 0,
    notes: "",
  });

  const fetchAssets = async () => {
    const res = await apiRequest("GET", "/api/asset");
    setAssets(res.data);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "number" ? +value : value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFile(file);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      formData.append(key, value.toString())
    );
    if (file) formData.append("photo_url", file);

    if (isEdit && selectedAsset) {
      await apiRequest("PUT", `/api/asset/${selectedAsset.id}`, formData);
    } else {
      await apiRequest("POST", "/api/asset", formData);
    }

    closeModal();
    fetchAssets();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin mau hapus asset ini?")) {
      await apiRequest("DELETE", `/api/asset/${id}`);
      fetchAssets();
    }
  };

  const openAddModal = () => {
    setIsEdit(false);
    setFile(null);
    setForm({
      name: "",
      type: "",
      description: "",
      quantity: 0,
      available_quantity: 0,
      notes: "",
    });
    setSelectedAsset(null);
    setIsModalOpen(true);
  };

  const openEditModal = (asset: Asset) => {
    setIsEdit(true);
    setSelectedAsset(asset);
    setFile(null); // not loading file dari asset lama
    setForm({
      name: asset.name,
      type: asset.type,
      description: asset.description,
      quantity: asset.quantity,
      available_quantity: asset.available_quantity,
      notes: asset.notes,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAsset(null);
    setFile(null);
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Assets List</h1>
        <button
          onClick={openAddModal}
          className="bg-white text-black px-4 py-2 rounded-md hover:bg-base-200 hover:text-white"
        >
          Add Asset
        </button>
      </div>

      <table className="min-w-full border text-sm text-left">
        <thead className="bg-base-600">
          <tr>
            <th className="px-4 py-2 border">No.</th>
            <th className="px-4 py-2 border">Image</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Type</th>
            <th className="px-4 py-2 border">Qty</th>
            <th className="px-4 py-2 border">Available</th>
            <th className="px-4 py-2 border">Notes</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset, i) => (
            <tr key={asset.id}>
              <td className="px-4 py-2 border">{i + 1}</td>
              <td className="px-4 py-2 border">
                {asset.photo_url && (
                  <img
                    src={`http://localhost:3000/${asset.photo_url}`}
                    alt="event"
                    className="w-16 h-16 object-cover"
                  />
                )}
              </td>
              <td className="px-4 py-2 border">{asset.name}</td>
              <td className="px-4 py-2 border">{asset.type}</td>
              <td className="px-4 py-2 border">{asset.quantity}</td>
              <td className="px-4 py-2 border">{asset.available_quantity}</td>
              <td className="px-4 py-2 border">{asset.notes}</td>
              <td className="px-4 py-2 border space-x-2">
                <button
                  onClick={() => openEditModal(asset)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-base-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(asset.id)}
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
              {isEdit ? "Edit Asset" : "Add Asset"}
            </h2>
            <div className="space-y-3">
              <input
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Name"
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
                name="description"
                value={form.description}
                onChange={handleInputChange}
                placeholder="Description"
                className="w-full border p-2 rounded"
              />
              <input
                name="quantity"
                type="number"
                value={form.quantity}
                onChange={handleInputChange}
                placeholder="Quantity"
                className="w-full border p-2 rounded"
              />
              <input
                name="available_quantity"
                type="number"
                value={form.available_quantity}
                onChange={handleInputChange}
                placeholder="Available Quantity"
                className="w-full border p-2 rounded"
              />
              <input
                name="notes"
                value={form.notes}
                onChange={handleInputChange}
                placeholder="Notes"
                className="w-full border p-2 rounded"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
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

export default AssetPage;
