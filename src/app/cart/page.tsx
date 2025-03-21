"use client";

import React from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useCart } from "../context/cartContext";
import Swal from "sweetalert2";
import Image from "next/image";
import { FaTruck, FaShareAlt, FaTrash, FaShoppingBag, FaGift } from "react-icons/fa";

// Align with cartContext's CartItem type
interface CartItem {
  _id: string;
  title: string;
  price: number;
  quantity: number;
  discountPercentage: number;
  image: string; // Added to match cartContext
  productImage: {
    asset: {
      url: string;
    };
  };
}

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const router = useRouter();

  const getDiscountedPrice = (price: number, discountPercentage: number) =>
    price - price * (discountPercentage / 100);

  const calculateSubtotal = () =>
    cart.reduce((total, item) => {
      const discountedPrice = getDiscountedPrice(item.price, item.discountPercentage);
      return total + discountedPrice * item.quantity;
    }, 0);

  const estimateShipping = () => {
    const originalTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    return originalTotal >= 30000 ? 0 : originalTotal >= 7000 ? 600 : 250;
  };

  const subtotal = calculateSubtotal();
  const shipping = estimateShipping();
  const total = subtotal + shipping;

  const surpriseGiftThreshold = 15000;
  const amountNeededForGift = Math.max(surpriseGiftThreshold - subtotal, 0);

  const handleCheckout = () => {
    Swal.fire({
      title: "Proceed to Checkout?",
      text: "Ready to complete your purchase?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#FBBF24",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, Checkout!",
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/Checkout");
      }
    });
  };

  const handleClearCart = () => {
    Swal.fire({
      title: "Clear Cart?",
      text: "Are you sure you want to remove all items?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#FBBF24",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, Clear!",
    }).then((result) => {
      if (result.isConfirmed) {
        clearCart();
        Swal.fire("Cart Cleared!", "All items have been removed.", "success");
      }
    });
  };

  const shareCart = () => {
    const cartUrl = window.location.href;
    const text = `Check out my MA Foods cart: ${cartUrl}`;
    const shareUrl = `https://twitter.com/share?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, "_blank");
  };

  const saveForLater = (item: CartItem) => {
    Swal.fire("Coming Soon!", "Save for Later will be available soon.", "info");
  };

  return (
    <div className="bg-navy-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Cart - MA Foods</title>
        <meta name="description" content="Your shopping cart" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-[1440px] mx-auto">
        <h1 className="text-3xl sm:text-4xl font-Montserrat font-extrabold text-navy-900 mb-8 text-center">
          Your Cart
        </h1>

        {cart.length === 0 ? (
          <div className="text-center text-navy-500">
            <p className="text-lg sm:text-xl font-Montserrat mb-4">Your cart is empty.</p>
            <button
              onClick={() => router.push("/shop")}
              className="bg-amber-400 text-navy-900 px-6 py-3 rounded-full font-Montserrat font-semibold hover:bg-amber-500 transition duration-300"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-navy-100">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                <h2 className="text-xl sm:text-2xl font-Montserrat font-semibold text-navy-900 mb-4 sm:mb-0">
                  Order Summary
                </h2>
                <button
                  onClick={handleClearCart}
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition duration-300"
                >
                  <FaTrash /> Clear Cart
                </button>
              </div>
              <div className="space-y-6">
                {cart.map((item) => {
                  const discountedPrice = getDiscountedPrice(item.price, item.discountPercentage);
                  return (
                    <div
                      key={item._id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-navy-200 pb-4 mb-4 gap-4"
                    >
                      <div className="flex items-center space-x-4">
                        {item.productImage?.asset?.url ? (
                          <Image
                            src={item.productImage.asset.url}
                            alt={item.title}
                            width={80}
                            height={80}
                            className="object-cover rounded-lg border border-navy-200 w-16 h-16 sm:w-20 sm:h-20"
                          />
                        ) : (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-navy-100 flex justify-center items-center rounded-lg">
                            <span className="text-navy-500 text-sm">No Image</span>
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-base sm:text-lg font-Montserrat font-medium text-navy-900">
                            {item.title}
                          </h3>
                          <p className="text-sm text-navy-500">Qty: {item.quantity}</p>
                          <p className="text-sm text-amber-400">
                            Discount: {item.discountPercentage}% Off
                          </p>
                        </div>
                      </div>
                      <div className="flex sm:flex-col sm:items-end gap-2 sm:gap-0">
                        <div className="text-right">
                          <p className="text-sm text-navy-400 line-through">
                            Rs. {(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-base sm:text-lg font-semibold text-amber-400">
                            Rs. {(discountedPrice * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex gap-2 mt-2 sm:mt-4">
                          <button
                            onClick={() => updateQuantity(item._id, "decrease")}
                            className="px-2 sm:px-3 py-1 bg-navy-200 text-navy-900 rounded-md hover:bg-navy-300"
                          >
                            -
                          </button>
                          <button
                            onClick={() => updateQuantity(item._id, "increase")}
                            className="px-2 sm:px-3 py-1 bg-navy-200 text-navy-900 rounded-md hover:bg-navy-300"
                          >
                            +
                          </button>
                          <button
                            onClick={() => saveForLater(item)}
                            className="px-2 sm:px-3 py-1 bg-amber-400 text-navy-900 rounded-md hover:bg-amber-500 text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="px-2 sm:px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 p-4 border border-navy-200 rounded-lg bg-navy-50">
                <h3 className="text-lg sm:text-xl font-Montserrat font-semibold text-navy-900 mb-4 flex items-center gap-2">
                  <FaGift className="text-amber-400" /> Free Surprise Gift!
                </h3>
                {amountNeededForGift === 0 ? (
                  <p className="text-amber-400 font-Montserrat">
                    Congrats! You’ve earned a free surprise gift with your order over Rs. 15,000!
                  </p>
                ) : (
                  <div className="space-y-2 text-navy-500">
                    <p className="font-Montserrat">
                      Add Rs. {amountNeededForGift.toFixed(2)} more for a free surprise gift!
                    </p>
                    <div className="flex justify-between">
                      <span>Current Amount:</span>
                      <span>Rs. {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-amber-400">
                      <span>Amount Needed:</span>
                      <span>Rs. {amountNeededForGift.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => router.push("/shop")}
                      className="mt-4 w-full py-2 bg-amber-400 text-navy-900 rounded-full font-Montserrat hover:bg-amber-500 transition duration-300"
                    >
                      Shop More
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 border border-navy-200 rounded-lg bg-navy-50">
                <h3 className="text-lg sm:text-xl font-Montserrat font-semibold text-navy-900 mb-4">
                  Cart Summary
                </h3>
                <div className="space-y-2 text-navy-500">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>Rs. {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <FaTruck className="text-amber-400" /> Shipping:
                    </span>
                    <span>{shipping === 0 ? "Free" : `Rs. ${shipping.toFixed(2)}`}</span>
                  </div>
                  <p className="text-sm text-navy-500">
                    {shipping === 0
                      ? "Free shipping on orders over Rs. 30,000!"
                      : shipping === 600
                      ? "Reduced shipping on orders over Rs. 7,000!"
                      : "Standard shipping rate."}
                  </p>
                  <div className="flex justify-between text-lg font-bold border-t border-navy-200 pt-4 text-amber-400">
                    <span>Total:</span>
                    <span>Rs. {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-amber-400 text-navy-900 rounded-full font-Montserrat font-semibold hover:bg-amber-500 transition duration-300"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={() => router.push("/shop")}
                  className="w-full py-3 bg-navy-900 text-amber-400 rounded-full font-Montserrat font-semibold hover:bg-navy-800 transition duration-300 flex items-center justify-center gap-2"
                >
                  <FaShoppingBag /> Continue Shopping
                </button>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={shareCart}
                  className="px-4 py-2 bg-navy-900 text-amber-400 rounded-full hover:bg-navy-800 flex items-center gap-2 transition duration-300"
                >
                  <FaShareAlt /> Share Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}