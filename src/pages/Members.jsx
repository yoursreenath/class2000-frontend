import { useEffect, useState, useRef } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  Mail,
  Plus,
  X,
  Upload,
  User,
  Loader2,
} from "lucide-react";
import { memberApi, uploadPhoto } from "../api";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    currentCity: "",
    currentJob: "",
    bio: "",
    email: "",
    photoUrl: "",
  });

  // Photo upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  const load = async () => {
    setLoading(true);
    const res = query
      ? await memberApi.search(query)
      : await memberApi.getAll();
    setMembers(res.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [query]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size must be less than 10MB.");
      return;
    }
    setUploadError("");
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setShowForm(false);
    setForm({
      firstName: "",
      lastName: "",
      currentCity: "",
      currentJob: "",
      bio: "",
      email: "",
      photoUrl: "",
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let photoUrl = "";
      if (selectedFile) {
        photoUrl = await uploadPhoto(selectedFile);
      }
      await memberApi.create({ ...form, photoUrl });
      resetForm();
      load();
    } catch (err) {
      setUploadError("Failed to save profile. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="font-display text-3xl font-bold"
            style={{ color: "var(--ink)" }}
          >
            Member Directory
          </h1>
          <p style={{ color: "var(--ink-muted)" }} className="mt-1">
            {members.length} classmates registered
          </p>
        </div>
        <button
          className="btn-primary flex items-center gap-2"
          onClick={() => setShowForm(true)}
        >
          <Plus size={16} /> Add Profile
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: "var(--ink-muted)" }}
        />
        <input
          className="input-field pl-9"
          placeholder="Search by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Add Member Form */}
      {showForm && (
        <div className="card p-6 mb-6 relative">
          <button
            className="absolute top-4 right-4"
            onClick={resetForm}
            style={{ color: "var(--ink-muted)" }}
          >
            <X size={18} />
          </button>
          <h3
            className="font-display text-xl font-bold mb-5"
            style={{ color: "var(--ink)" }}
          >
            Add Your Profile
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Photo Upload */}
            <div className="flex items-center gap-5">
              {/* Avatar preview */}
              <div
                className="w-20 h-20 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden cursor-pointer border-2 border-dashed transition-all"
                style={{
                  borderColor: previewUrl ? "var(--amber)" : "#e8d9b5",
                  background: "#fdf8f0",
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={28} style={{ color: "#e8d9b5" }} />
                )}
              </div>

              {/* Upload button and hint */}
              <div>
                <button
                  type="button"
                  className="btn-outline flex items-center gap-2 text-sm py-2 px-4"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={14} />
                  {previewUrl ? "Change Photo" : "Upload Photo"}
                </button>
                <p
                  className="text-xs mt-1.5"
                  style={{ color: "var(--ink-muted)" }}
                >
                  JPG, PNG, GIF — max 10MB (optional)
                </p>
                {previewUrl && (
                  <button
                    type="button"
                    className="text-xs mt-1"
                    style={{ color: "#dc2626" }}
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                  >
                    Remove photo
                  </button>
                )}
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {uploadError && (
              <p
                className="text-sm px-3 py-2 rounded-lg"
                style={{ color: "#dc2626", background: "#fef2f2" }}
              >
                {uploadError}
              </p>
            )}

            {/* Profile fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                required
                className="input-field"
                placeholder="First Name *"
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
              />
              <input
                required
                className="input-field"
                placeholder="Last Name *"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
              <input
                className="input-field"
                placeholder="Current City"
                value={form.currentCity}
                onChange={(e) =>
                  setForm({ ...form, currentCity: e.target.value })
                }
              />
              <input
                className="input-field"
                placeholder="Job / Profession"
                value={form.currentJob}
                onChange={(e) =>
                  setForm({ ...form, currentJob: e.target.value })
                }
              />
              <input
                type="email"
                className="input-field md:col-span-2"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <textarea
                className="input-field md:col-span-2 h-20 resize-none"
                placeholder="A short bio..."
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
              />
            </div>

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                className="btn-primary flex items-center gap-2"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Profile"
                )}
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={resetForm}
                disabled={uploading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Members grid */}
      {loading ? (
        <div
          className="text-center py-16"
          style={{ color: "var(--ink-muted)" }}
        >
          Loading classmates...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {members.map((m) => (
            <div key={m.id} className="card p-5">
              <div className="flex items-start gap-3 mb-3">
                {/* Profile photo or initials fallback */}
                <div
                  className="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden"
                  style={{ background: "var(--amber)" }}
                >
                  {m.photoUrl ? (
                    <img
                      src={m.photoUrl}
                      alt={`${m.firstName} ${m.lastName}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // If image fails to load, hide it and show initials fallback
                        e.target.style.display = "none";
                        e.target.parentNode.classList.add("show-initials");
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-display text-lg font-bold text-white">
                      {m.firstName[0]}
                      {m.lastName[0]}
                    </div>
                  )}
                </div>

                <div>
                  <h3
                    className="font-display text-lg font-bold leading-tight"
                    style={{ color: "var(--ink)" }}
                  >
                    {m.firstName} {m.lastName}
                  </h3>
                  {m.currentCity && (
                    <span
                      className="flex items-center gap-1 text-xs mt-0.5"
                      style={{ color: "var(--ink-muted)" }}
                    >
                      <MapPin size={11} /> {m.currentCity}
                    </span>
                  )}
                </div>
              </div>

              {m.currentJob && (
                <p
                  className="flex items-center gap-1.5 text-sm mb-2"
                  style={{ color: "var(--ink-muted)" }}
                >
                  <Briefcase size={13} /> {m.currentJob}
                </p>
              )}
              {m.bio && (
                <p
                  className="text-sm leading-relaxed mb-3"
                  style={{ color: "var(--ink)" }}
                >
                  {m.bio}
                </p>
              )}
              {m.email && (
                <a
                  href={`mailto:${m.email}`}
                  className="flex items-center gap-1.5 text-xs"
                  style={{ color: "var(--amber)" }}
                >
                  <Mail size={12} /> {m.email}
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && members.length === 0 && (
        <div
          className="text-center py-16"
          style={{ color: "var(--ink-muted)" }}
        >
          No members found.
        </div>
      )}
    </div>
  );
}
