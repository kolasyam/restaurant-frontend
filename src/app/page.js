"use client";
import React, { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { MdFormatListBulletedAdd } from "react-icons/md";
import Link from "next/link";
import { useProductStore } from "./store/product";
const Page = () => {
  const { fetchProducts, deleteBooking, products } = useProductStore();
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  console.log("products", products);
  const handleDelete = async (id) => {
    const { success, message } = await deleteBooking(id);
    if (!success) {
      toast.error(message);
    } else {
      toast.success(message);
    }
  };
  return (
    <div className="p-4 relative">
      {/* Title Section (Visible on large screens only) */}
      <div className="hidden md:block text-center mb-6">
        <h1 className="text-2xl md:text-4xl font-bold">
          Restaurant Table Booking System
        </h1>
      </div>

      {/* Icon at top-right corner */}
      <div className="absolute top-4 right-4">
        <Link href="/reservation">
          <MdFormatListBulletedAdd
            className="cursor-pointer"
            style={{ width: "40px", height: "50px" }}
          />
        </Link>
      </div>

      {/* Products List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-12">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className="p-4 border rounded-lg shadow-md flex flex-col justify-between bg-white hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <div>
                <p className="font-semibold">User Name: {product.user.name}</p>
                {/* <p>Date: {product.reservationDate}</p> */}
                <p>
                  Date:{" "}
                  {
                    new Date(product.reservationDate)
                      .toISOString()
                      .split("T")[0]
                  }
                </p>
                <p>Time: {product.reservationTime}</p>
                <p>No. of Guests: {product.numberOfGuests}</p>
              </div>

              <button
                onClick={() => handleDelete(product._id)}
                className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center">
            <p className="text-xl text-gray-500 mb-4">
              🚫 No Reservation found
            </p>
            <Link
              href="/reservation"
              className="text-blue-500 font-semibold hover:underline"
            >
              Create a new restaurant table
            </Link>
          </div>
        )}
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
      />
    </div>
  );
};
export default Page;
