import React, { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../utils/api";

type Volunteer = {
  id: string;
  ref_user_id: string;
  nik: string;
  full_name: string;
  address: string;
  age: string;
  email: string;
  phone: string;
  url_photo: string | null;
};

const VolunteerPage: React.FC = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [form, setForm] = useState<any>({
    username: "",
    password: "",
    nik: "",
    full_name: "",
    address: "",
    age: "",
    email: "",
    phone: "",
    url_photo: null,
  });
  const [isEdit, setIsEdit] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchVolunteers = async () => {
    const res = await apiRequest("GET", "/api/volunteer");
    setVolunteers(res.data);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    setForm({
      ...form,
      [name]: type === "file" ? files?.[0] : value,
    });
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (val instanceof Blob || typeof val === "string") {
        formData.append(key, val);
      }
    });

    if (isEdit && selectedVolunteer) {
      await apiRequest("PUT", `/api/volunteer/${selectedVolunteer.id}`, formData);
    } else {
      await apiRequest("POST", "/api/volunteer", formData);
    }

    fetchVolunteers();
    closeModal();
  };

  const handleDelete = async (id: string) => {
    await apiRequest("DELETE", `/api/volunteer/${id}`);
    fetchVolunteers();
  };

  const openAddModal = () => {
    setForm({
      username: "",
      password: "",
      nik: "",
      full_name: "",
      address: "",
      age: "",
      email: "",
      phone: "",
      url_photo: null,
    });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const openEditModal = (vol: Volunteer) => {
    setIsEdit(true);
    setSelectedVolunteer(vol);
    setForm({
      nik: vol.nik,
      full_name: vol.full_name,
      address: vol.address,
      age: vol.age,
      email: vol.email,
      phone: vol.phone,
      username: "",
      password: "",
      url_photo: null,
    });
    setIsModalOpen(true);
  };

  const openDetailModal = (vol: Volunteer) => {
    setSelectedVolunteer(vol);
    setIsDetailOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsDetailOpen(false);
    setSelectedVolunteer(null);
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const filteredVolunteers = useMemo(() => {
    return volunteers.filter((volunteer) =>
      volunteer.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      volunteer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      volunteer.nik.toLowerCase().includes(searchQuery.toLowerCase()) ||
      volunteer.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [volunteers, searchQuery]);

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold mb-2">Volunteers List</h1>

          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="Search volunteers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 border rounded-md text-white w-1/4"
            />
            <button
              onClick={openAddModal}
              className="bg-white text-black px-4 py-2 rounded-md hover:bg-base-200 hover:text-white"
            >
              Add Asset
            </button>
          </div>
      </div>

      <table className="min-w-full border text-sm text-left">
        <thead className="bg-base-300">
          <tr>
            <th className="border px-3 py-2">No.</th>
            <th className="border px-3 py-2">Name</th>
            <th className="border px-3 py-2">NIK</th>
            <th className="border px-3 py-2">Email</th>
            <th className="border px-3 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredVolunteers.map((v, i) => (
            <tr key={v.id}>
              <td className="border px-3 py-2">{i + 1}</td>
              <td className="border px-3 py-2">{v.full_name}</td>
              <td className="border px-3 py-2">{v.nik}</td>
              <td className="border px-3 py-2">{v.email}</td>
              <td className="border px-3 py-2 space-x-2">
                <button onClick={() => openDetailModal(v)} className="bg-green-500 text-white px-2 py-1 rounded">Detail</button>
                <button onClick={() => openEditModal(v)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(v.id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base-200 p-6 rounded w-full max-w-md space-y-3">
            <h2 className="text-xl font-bold">{isEdit ? "Edit" : "Add"} Volunteer</h2>
            {!isEdit && (
              <>
                <input name="username" value={form.username} onChange={handleInputChange} placeholder="Username" className="w-full p-2 border rounded" />
                <input type="password" name="password" value={form.password} onChange={handleInputChange} placeholder="Password" className="w-full p-2 border rounded" />
              </>
            )}
            <input name="nik" value={form.nik} onChange={handleInputChange} placeholder="NIK" className="w-full p-2 border rounded" />
            <input name="full_name" value={form.full_name} onChange={handleInputChange} placeholder="Full Name" className="w-full p-2 border rounded" />
            <input name="email" value={form.email} onChange={handleInputChange} placeholder="Email" className="w-full p-2 border rounded" />
            <input name="phone" value={form.phone} onChange={handleInputChange} placeholder="Phone" className="w-full p-2 border rounded" />
            <input name="age" value={form.age} onChange={handleInputChange} placeholder="Age" className="w-full p-2 border rounded" />
            <input name="address" value={form.address} onChange={handleInputChange} placeholder="Address" className="w-full p-2 border rounded" />
            <input type="file" name="url_photo" onChange={handleInputChange} className="w-full" />
            <div className="flex justify-end space-x-2">
              <button onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">{isEdit ? "Update" : "Create"}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Detail */}
      {isDetailOpen && selectedVolunteer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base-200 p-6 rounded w-full max-w-md space-y-2">
            <h2 className="text-xl font-bold mb-2">Volunteer Details</h2>
            <img src={`http://localhost:3000/${selectedVolunteer.url_photo}`} alt="photo" className="w-32 h-32 object-cover rounded" />
            <p><strong>Name:</strong> {selectedVolunteer.full_name}</p>
            <p><strong>NIK:</strong> {selectedVolunteer.nik}</p>
            <p><strong>Email:</strong> {selectedVolunteer.email}</p>
            <p><strong>Phone:</strong> {selectedVolunteer.phone}</p>
            <p><strong>Age:</strong> {selectedVolunteer.age}</p>
            <p><strong>Address:</strong> {selectedVolunteer.address}</p>
            <div className="flex justify-end">
              <button onClick={closeModal} className="bg-gray-400 text-white px-4 py-2 rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerPage;
