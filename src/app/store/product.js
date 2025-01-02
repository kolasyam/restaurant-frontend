import { create } from "zustand";
export const useProductStore = create((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  createBooking: async (newBooking) => {
    if (
      !newBooking.reservationDate ||
      !newBooking.reservationTime ||
      !newBooking.numberOfGuests ||
      !newBooking.user.name ||
      !newBooking.user.contact.email ||
      !newBooking.user.contact.phone
    ) {
      return { success: false, message: "Please fill in all fields." };
    }
    const res = await fetch("http://localhost:5000/api/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBooking),
    });
    const data = await res.json();
    set((state) => ({ products: [...state.products, data.data] }));
    return { success: true, message: "Booking Successfull" };
  },
  fetchProducts: async () => {
    const res = await fetch("http://localhost:5000/api/bookings");
    const data = await res.json();
    set({ products: data.data });
  },
  deleteBooking: async (id) => {
    const res = await fetch(`http://localhost:5000/api/booking/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };
    set((state) => ({
      products: state.products.filter((product) => product._id !== id),
    }));
    return { success: true, message: data.message };
  },
}));