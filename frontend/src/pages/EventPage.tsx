import React, { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../utils/api";

type Event = {
	id: string;
	name: string;
	description: string;
	notes: string;
	date_start: string;
	date_end: string;
	photo_url: string | null;
};

const EventPage: React.FC = () => {
	const [events, setEvents] = useState<Event[]>([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [form, setForm] = useState<Omit<Event, "id" | "photo_url">>({
		name: "",
		description: "",
		notes: "",
		date_start: "",
		date_end: "",
	});
	const [file, setFile] = useState<File | null>(null);

	const fetchEvents = async () => {
		const res = await apiRequest("GET", "/api/event");
		setEvents(res.data);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.[0]) setFile(e.target.files[0]);
	};

	const handleSubmit = async () => {
		const formData = new FormData();
		for (const key in form) {
			formData.append(key, form[key as keyof typeof form]);
		}
		if (file) formData.append("photo_url", file);

		if (isEdit && selectedEvent) {
			await apiRequest("PUT", `/api/event/${selectedEvent.id}`, formData);
		} else {
			await apiRequest("POST", "/api/event", formData);
		}

		closeModal();
		fetchEvents();
	};

	const handleDelete = async (id: string) => {
		if (confirm("Yakin mau hapus event ini?")) {
			await apiRequest("DELETE", `/api/event/${id}`);
			fetchEvents();
		}
	};

	const openAddModal = () => {
		setIsEdit(false);
		setForm({
			name: "",
			description: "",
			notes: "",
			date_start: "",
			date_end: "",
		});
		setFile(null);
		setIsModalOpen(true);
	};

	const openEditModal = (event: Event) => {
		setIsEdit(true);
		setSelectedEvent(event);
		setForm({
			name: event.name,
			description: event.description,
			notes: event.notes,
			date_start: event.date_start.split("T")[0],
			date_end: event.date_end.split("T")[0],
		});
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedEvent(null);
		setFile(null);
	};

	useEffect(() => {
		fetchEvents();
	}, []);

  const filteredEvents = useMemo(() => {
    return events.filter((event) =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.notes.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [events, searchQuery]);

	return (
	<div className="p-6">
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-semibold">Event List</h1>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search event..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 border rounded-md text-black"
        />
        <button
          onClick={openAddModal}
          className="bg-white text-black px-4 py-2 rounded-md hover:bg-base-200 hover:text-white"
        >
          Add Event
        </button>
      </div>
    </div>


	<table className="min-w-full border text-sm text-left">
		<thead className="bg-base-600">
			<tr>
				<th className="px-4 py-2 border">No.</th>
				<th className="px-4 py-2 border">Name</th>
				<th className="px-4 py-2 border">Start</th>
				<th className="px-4 py-2 border">End</th>
				<th className="px-4 py-2 border">Notes</th>
				<th className="px-4 py-2 border">Image</th>
				<th className="px-4 py-2 border">Actions</th>
			</tr>
		</thead>
		<tbody>
			{filteredEvents.map((ev, i) => (
				<tr key={ev.id}>
					<td className="px-4 py-2 border">{i + 1}</td>
					<td className="px-4 py-2 border">{ev.name}</td>
					<td className="px-4 py-2 border">{ev.date_start.slice(0, 10)}</td>
					<td className="px-4 py-2 border">{ev.date_end.slice(0, 10)}</td>
					<td className="px-4 py-2 border">{ev.notes}</td>
					<td className="px-4 py-2 border">
						{ev.photo_url && (
							<img
								src={`http://localhost:3000/${ev.photo_url}`}
								alt="event"
								className="w-16 h-16 object-cover"
							/>
						)}
					</td>
					<td className="px-4 py-2 border space-x-2">
						<button
							onClick={() => openEditModal(ev)}
							className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-base-200 transition"
						>
							Edit
						</button>
						<button
							onClick={() => handleDelete(ev.id)}
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
					{isEdit ? "Edit Event" : "Add Event"}
				</h2>
				<div className="space-y-3">
					<input name="name" value={form.name} onChange={handleInputChange} placeholder="Event Name" className="w-full border p-2 rounded" />
					<textarea name="description" value={form.description} onChange={handleInputChange} placeholder="Description" className="w-full border p-2 rounded" />
					<textarea name="notes" value={form.notes} onChange={handleInputChange} placeholder="Notes" className="w-full border p-2 rounded" />
					<input name="date_start" type="date" value={form.date_start} onChange={handleInputChange} className="w-full border p-2 rounded" />
					<input name="date_end" type="date" value={form.date_end} onChange={handleInputChange} className="w-full border p-2 rounded" />
					<input type="file" onChange={handleFileChange} accept="image/*" className="w-full border p-2 rounded" />
				</div>
				<div className="mt-6 flex justify-end space-x-2">
					<button onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
					<button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
						{isEdit ? "Update" : "Create"}
					</button>
				</div>
			</div>
		</div>
	)}
	</div>
	);
};

export default EventPage;
