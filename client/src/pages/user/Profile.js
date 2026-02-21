import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";
import axios from "axios";

const emptyAddressForm = () => ({
  label: "Home",
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  isDefault: false,
});

const Profile = () => {
  const [auth, setAuth] = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [deliveryAddresses, setDeliveryAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState(emptyAddressForm());
  const [savingAddress, setSavingAddress] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  useEffect(() => {
    if (auth?.user) {
      const { email: e, name: n, phone: ph } = auth.user;
      setName(n || "");
      setEmail(e || "");
      setPhone(ph || "");
      setPassword("");
    }
  }, [auth]);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!auth?.token) return;
      setAddressesLoading(true);
      try {
        const { data } = await axios.get("/api/v1/auth/addresses", {
          headers: { Authorization: auth.token },
        });
        if (data.success) {
          setDeliveryAddresses(data.deliveryAddresses || []);
          setAuth((prev) => ({
            ...prev,
            user: { ...prev.user, deliveryAddresses: data.deliveryAddresses || [] },
          }));
        }
      } catch (err) {
        toast.error("Could not load addresses");
      } finally {
        setAddressesLoading(false);
      }
    };
    fetchAddresses();
  }, [auth?.token]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "/api/v1/auth/profile",
        { name, email, password, phone },
        { headers: { Authorization: auth.token } }
      );
      if (res?.data?.success) {
        toast.success(res.data.message || "Profile updated");
        setAuth((prev) => ({
          ...prev,
          user: { ...prev.user, name, phone },
        }));
      } else {
        toast.error(res?.data?.message || "Update failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const openAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm(emptyAddressForm());
    setShowAddressForm(true);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            {
              headers: { "Accept-Language": "en", "User-Agent": "EcommerceApp/1.0" },
            }
          );
          const data = await res.json();
          if (!data?.address) {
            toast.error("Could not resolve address for this location");
            setGettingLocation(false);
            return;
          }
          const a = data.address;
          const street = [a.house_number, a.road, a.street, a.pedestrian, a.footway]
            .filter(Boolean)
            .join(" ") || a.suburb || a.neighbourhood || "Current location";
          const city = a.city || a.town || a.village || a.municipality || a.county || "";
          const state = a.state || "";
          const zip = a.postcode || "";
          const country = a.country || "";
          setEditingAddressId(null);
          setAddressForm({
            label: "Current location",
            street: street.trim() || "Current location",
            city,
            state,
            zip,
            country,
            isDefault: false,
          });
          setShowAddressForm(true);
          toast.success("Address filled from your location. You can edit and save.");
        } catch (err) {
          toast.error("Could not get address from location");
        } finally {
          setGettingLocation(false);
        }
      },
      (err) => {
        setGettingLocation(false);
        if (err.code === 1) toast.error("Location access denied");
        else if (err.code === 2) toast.error("Location unavailable");
        else toast.error("Could not get your location");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const openEditAddress = (addr) => {
    setEditingAddressId(addr._id);
    setAddressForm({
      label: addr.label || "Home",
      street: addr.street || "",
      city: addr.city || "",
      state: addr.state || "",
      zip: addr.zip || "",
      country: addr.country || "",
      isDefault: !!addr.isDefault,
    });
    setShowAddressForm(true);
  };

  const closeAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddressId(null);
    setAddressForm(emptyAddressForm());
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      const payload = {
        label: addressForm.label,
        street: addressForm.street,
        city: addressForm.city,
        state: addressForm.state,
        zip: addressForm.zip,
        country: addressForm.country,
        isDefault: addressForm.isDefault,
      };
      if (editingAddressId) {
        await axios.put(`/api/v1/auth/addresses/${editingAddressId}`, payload, {
          headers: { Authorization: auth.token },
        });
        toast.success("Address updated");
      } else {
        await axios.post("/api/v1/auth/addresses", payload, {
          headers: { Authorization: auth.token },
        });
        toast.success("Address added");
      }
      const { data } = await axios.get("/api/v1/auth/addresses", {
        headers: { Authorization: auth.token },
      });
      if (data.success) {
        setDeliveryAddresses(data.deliveryAddresses || []);
        setAuth((prev) => ({
          ...prev,
          user: { ...prev.user, deliveryAddresses: data.deliveryAddresses || [] },
        }));
      }
      closeAddressForm();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not save address");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Remove this address?")) return;
    try {
      const { data } = await axios.delete(`/api/v1/auth/addresses/${id}`, {
        headers: { Authorization: auth.token },
      });
      if (data.success) {
        setDeliveryAddresses(data.deliveryAddresses || []);
        setAuth((prev) => ({
          ...prev,
          user: { ...prev.user, deliveryAddresses: data.deliveryAddresses || [] },
        }));
        toast.success("Address removed");
      }
    } catch (err) {
      toast.error("Could not delete address");
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      const { data } = await axios.patch(
        `/api/v1/auth/addresses/${id}/default`,
        {},
        { headers: { Authorization: auth.token } }
      );
      if (data.success) {
        setDeliveryAddresses(data.deliveryAddresses || []);
        setAuth((prev) => ({
          ...prev,
          user: { ...prev.user, deliveryAddresses: data.deliveryAddresses || [] },
        }));
        toast.success("Default address updated");
      }
    } catch (err) {
      toast.error("Could not set default address");
    }
  };

  const formatAddress = (addr) => {
    const parts = [
      addr.street,
      addr.city,
      addr.state,
      addr.zip,
      addr.country,
    ].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <Layout title="Your Profile">
      <div className="container-fluid p-3 m-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            {/* Profile form - no address */}
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h4 className="card-title mb-4">Profile</h4>
                <form onSubmit={handleProfileSubmit}>
                  <div className="mb-3">
                    <label htmlFor="profileName" className="form-label">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="form-control"
                      id="profileName"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="profileEmail" className="form-label">Email</label>
                    <input
                      type="email"
                      value={email}
                      className="form-control"
                      id="profileEmail"
                      placeholder="Your email"
                      required
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="profilePassword" className="form-label">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control"
                      id="profilePassword"
                      placeholder="Leave blank to keep current"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="profilePhone" className="form-label">Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="form-control"
                      id="profilePhone"
                      placeholder="Your phone"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Update profile
                  </button>
                </form>
              </div>
            </div>

            {/* Delivery addresses - separate section */}
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                  <h4 className="card-title mb-0">Delivery addresses</h4>
                  {!showAddressForm && (
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={openAddAddress}
                      >
                        + Add address
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-success btn-sm"
                        onClick={handleUseCurrentLocation}
                        disabled={gettingLocation}
                        title="Use your current location to fill the address"
                      >
                        {gettingLocation ? "Getting location…" : "Use current location"}
                      </button>
                    </div>
                  )}
                </div>

                {showAddressForm && (
                  <form onSubmit={handleAddressSubmit} className="mb-4 p-3 border rounded bg-light">
                    <h6 className="mb-3">{editingAddressId ? "Edit address" : "New address"}</h6>
                    <div className="row g-2">
                      <div className="col-12 col-md-6">
                        <label className="form-label small">Label (e.g. Home, Office)</label>
                        <input
                          type="text"
                          value={addressForm.label}
                          onChange={(e) => setAddressForm((f) => ({ ...f, label: e.target.value }))}
                          className="form-control form-control-sm"
                          placeholder="Home"
                        />
                      </div>
                      <div className="col-12">
                        <label className="form-label small">Street address *</label>
                        <input
                          type="text"
                          value={addressForm.street}
                          onChange={(e) => setAddressForm((f) => ({ ...f, street: e.target.value }))}
                          className="form-control form-control-sm"
                          placeholder="Street, building, floor"
                          required
                        />
                      </div>
                      <div className="col-6 col-md-4">
                        <label className="form-label small">City *</label>
                        <input
                          type="text"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm((f) => ({ ...f, city: e.target.value }))}
                          className="form-control form-control-sm"
                          placeholder="City"
                          required
                        />
                      </div>
                      <div className="col-6 col-md-4">
                        <label className="form-label small">State / Province</label>
                        <input
                          type="text"
                          value={addressForm.state}
                          onChange={(e) => setAddressForm((f) => ({ ...f, state: e.target.value }))}
                          className="form-control form-control-sm"
                          placeholder="State"
                        />
                      </div>
                      <div className="col-6 col-md-4">
                        <label className="form-label small">ZIP / Postal code</label>
                        <input
                          type="text"
                          value={addressForm.zip}
                          onChange={(e) => setAddressForm((f) => ({ ...f, zip: e.target.value }))}
                          className="form-control form-control-sm"
                          placeholder="ZIP"
                        />
                      </div>
                      <div className="col-6 col-md-4">
                        <label className="form-label small">Country *</label>
                        <input
                          type="text"
                          value={addressForm.country}
                          onChange={(e) => setAddressForm((f) => ({ ...f, country: e.target.value }))}
                          className="form-control form-control-sm"
                          placeholder="Country"
                          required
                        />
                      </div>
                      <div className="col-12">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="addrDefault"
                            checked={addressForm.isDefault}
                            onChange={(e) => setAddressForm((f) => ({ ...f, isDefault: e.target.checked }))}
                          />
                          <label className="form-check-label small" htmlFor="addrDefault">
                            Use as default delivery address
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 d-flex gap-2">
                      <button type="submit" className="btn btn-primary btn-sm" disabled={savingAddress}>
                        {savingAddress ? "Saving…" : "Save address"}
                      </button>
                      <button type="button" className="btn btn-outline-secondary btn-sm" onClick={closeAddressForm}>
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {addressesLoading ? (
                  <p className="text-muted">Loading addresses…</p>
                ) : deliveryAddresses.length === 0 ? (
                  <p className="text-muted mb-0">
                    No delivery addresses yet. Add one to use at checkout.
                  </p>
                ) : (
                  <div className="row g-3">
                    {deliveryAddresses.map((addr) => (
                      <div className="col-12 col-md-6" key={addr._id}>
                        <div className="border rounded p-3 h-100">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <span className="fw-semibold">{addr.label}</span>
                              {addr.isDefault && (
                                <span className="badge bg-primary ms-2">Default</span>
                              )}
                            </div>
                            <div className="btn-group btn-group-sm">
                              <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => openEditAddress(addr)}
                                title="Edit"
                              >
                                Edit
                              </button>
                              {!addr.isDefault && (
                                <button
                                  type="button"
                                  className="btn btn-outline-secondary"
                                  onClick={() => handleSetDefaultAddress(addr._id)}
                                  title="Set as default"
                                >
                                  Set default
                                </button>
                              )}
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => handleDeleteAddress(addr._id)}
                                title="Remove"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                          <p className="text-muted small mb-0 mt-2">{formatAddress(addr)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
