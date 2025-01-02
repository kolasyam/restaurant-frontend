"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import { useProductStore } from "../store/product";
import Link from "next/link";

const Reservationpage = () => {
  const [formData, setFormData] = useState({
    reservationDate: "",
    reservationTime: "",
    numberOfGuests: 1,
    user: {
      name: "",
      contact: {
        email: "",
        phone: "",
      },
    },
  });

  const [availableTimes, setAvailableTimes] = useState([
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "email" || name === "phone") {
      setFormData({
        ...formData,
        user: {
          ...formData.user,
          contact: {
            ...formData.user.contact,
            [name]: value,
          },
        },
      });
    } else if (name === "name") {
      setFormData({
        ...formData,
        user: {
          ...formData.user,
          name: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const { fetchProducts, products, createBooking } = useProductStore();
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  //   console.log("products", products);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { reservationDate, reservationTime, numberOfGuests, user } = formData;
    const { name, contact } = user;
    const { email, phone } = contact;

    if (!email || !phone || !reservationDate || !reservationTime) {
      alert("Please fill out all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    // Submit form data (mock implementation)
    // console.log(formData);
    // alert("Your booking has been successfully submitted!");
    const { success, message } = await createBooking(formData);
    if (!success) {
      toast.error(message);
    } else {
      toast.success(message);
    }
    setFormData({
      reservationDate: "",
      reservationTime: "",
      numberOfGuests: 1,
      user: {
        name: "",
        contact: {
          email: "",
          phone: "",
        },
      },
    });
    setTimeout(() => {
      window.location.href = "/";
    }, 3000);
  };
  const getAvailableTimesForDate = (date) => {
    return products
      .filter((product) => {
        const productDate = new Date(product.reservationDate);
        return productDate.toISOString().split("T")[0] === date; // Matching only the date part
      })
      .map((product) => product.reservationTime); // Extracting reservationTime from products
  };

  return (
    <div className="flex flex-col justify-center items-start gap-8 p-4 ">
      <div className="absolute top-3 left-2 mr-4 bg-slate-400 rounded-md">
        <Link href="/">
          <IoIosArrowBack
            className="cursor-pointer"
            style={{ width: "40px", height: "50px" }}
          />
        </Link>
      </div>
      <h1 className="hidden md:block text-3xl font-bold mb-6 text-center w-full">
        Restaurant Table Booking
      </h1>

      <div className="flex flex-col w-full md:w-full gap-8 p-4">
        <div className="w-full bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Select Date & Time</h2>

          {/* Date Picker */}
          <input
            type="date"
            name="reservationDate"
            value={formData.reservationDate}
            onChange={handleInputChange}
            className="w-full mb-4 border p-2 rounded-lg"
          />

          {/* Available Time Slots */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Available Time Slots</h3>
            <div className="grid grid-cols-3 gap-2">
              {availableTimes.map((time) => {
                const availableTimesForDate = getAvailableTimesForDate(
                  formData.reservationDate
                );
                const isDisabled = availableTimesForDate.includes(time);
                return (
                  <button
                    key={time}
                    type="button"
                    className={`p-2 rounded-lg border ${
                      formData.reservationTime === time
                        ? "bg-black text-white"
                        : isDisabled
                        ? "bg-gray-100 cursor-not-allowed"
                        : "bg-gray-100"
                    }`}
                    onClick={() => {
                      if (!isDisabled) {
                        setFormData({ ...formData, reservationTime: time });
                      }
                    }}
                    disabled={isDisabled}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="w-full bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Booking Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block font-semibold mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.user.name}
                onChange={handleInputChange}
                className="w-full border p-2 rounded-lg"
                placeholder="Enter your name"
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.user.contact.email}
                onChange={handleInputChange}
                className="w-full border p-2 rounded-lg"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.user.contact.phone}
                onChange={handleInputChange}
                className="w-full border p-2 rounded-lg"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="mb-4">
              <label className="block font-semibold mb-2">
                Number of Guests
              </label>
              <input
                type="number"
                name="numberOfGuests"
                value={formData.numberOfGuests}
                onChange={handleInputChange}
                className="w-full border p-2 rounded-lg"
                min="1"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white p-2 rounded-lg hover:bg-gray-800"
            >
              Confirm Booking
            </button>
          </form>
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
      />
    </div>
  );
};

export default Reservationpage;
