"use client";
import { useState, useEffect } from "react";
import { useCart } from "../context/cartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@sanity/client";
import Swal from "sweetalert2";
import { FaShoppingCart, FaTruck, FaCalendarAlt, FaGift } from "react-icons/fa";
import Image from "next/image";
import { urlFor } from "../../sanity/lib/client";

// Sanity client configuration
const sanityClient = createClient({
  projectId: "p72g6oqi",
  dataset: "production",
  apiVersion: "2025-03-20", // Matches your current date
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
});

interface CartItem {
  _id: string;
  title: string;
  price: number;
  quantity: number;
  discountPercentage: number;
  image?: { asset: { _ref: string } } | string;
}

interface OrderData {
  _type: string;
  orderNumber: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: {
      street1: string;
      street2?: string;
      city: string;
      country: string;
    };
    subscribe: boolean;
  };
  items: {
    _key: string;
    product: {
      _type: string;
      _ref: string;
    };
    quantity: number;
    price: number;
  }[];
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  orderDate: string;
  notes?: string;
}

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [paymentOption, setPaymentOption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    console.log("Cart Data in Checkout Page:", cart);
  }, [cart]);

  const calculateSubtotal = () =>
    cart.reduce((total, item) => {
      const discountedPrice = item.price - item.price * (item.discountPercentage / 100);
      return total + discountedPrice * item.quantity;
    }, 0);

  const subtotal = calculateSubtotal();
  const shipping = subtotal >= 30000 ? 0 : subtotal >= 7000 ? 600 : 250;
  const totalBeforeDiscount = subtotal + shipping;
  const total = Math.max(totalBeforeDiscount - discount, 0);

  const freeGiftThreshold = 15000;
  const discountCouponThreshold = 20000;
  const isEligibleForGift = subtotal >= freeGiftThreshold;
  const isEligibleForDiscountCoupon = subtotal >= discountCouponThreshold;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    country: "Pakistan",
    telephone: "",
    comment: "",
    subscribe: false,
  });

  const handleApplyDiscount = () => {
    if (promoCode.toUpperCase() === "DISCOUNT10" && isEligibleForDiscountCoupon) {
      setDiscount(subtotal * 0.1);
      setPromoError("");
      localStorage.setItem("appliedDiscount", "DISCOUNT10");
    } else {
      setPromoError(
        isEligibleForDiscountCoupon
          ? "Invalid promo code"
          : "Promo code requires a minimum order of Rs. 20,000"
      );
      setDiscount(0);
      localStorage.removeItem("appliedDiscount");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const requiredFields = ["firstName", "lastName", "email", "address1", "city", "telephone"];
    return requiredFields.every((field) => Boolean(formData[field as keyof typeof formData]));
  };

  const generateOrderNumber = () => `ORD-${Math.floor(Math.random() * 1000000)}`;

  const sendOrderConfirmationEmail = async (orderData: OrderData) => {
    const msg = {
      to: orderData.customer.email,
      from: "orders@mafoods.com",
      subject: `Order Confirmation - ${orderData.orderNumber}`,
      html: `
        <h1 style="color: #11142D;">Thank You for Your Order!</h1>
        <p>Dear ${orderData.customer.firstName} ${orderData.customer.lastName},</p>
        <p>Your order has been successfully placed with MA Foods. Here are the details:</p>
        <h2 style="color: #FBBF24;">Order Number: ${orderData.orderNumber}</h2>
        <p><strong>Order Date:</strong> ${new Date(orderData.orderDate).toLocaleDateString()}</p>
        <h3>Items:</h3>
        <ul>
          ${orderData.items
            .map(
              (item) =>
                `<li>${item.quantity}x Product ID: ${item.product._ref} - Rs. ${(
                  item.price * item.quantity
                ).toFixed(2)}</li>`
            )
            .join("")}
        </ul>
        <p><strong>Subtotal:</strong> Rs. ${orderData.subtotal.toFixed(2)}</p>
        <p><strong>Shipping:</strong> Rs. ${orderData.shipping.toFixed(2)}</p>
        <p><strong>Discount:</strong> Rs. ${orderData.discount.toFixed(2)}</p>
        <p><strong>Total:</strong> Rs. ${orderData.total.toFixed(2)}</p>
        <p><strong>Payment Method:</strong> ${
          orderData.paymentMethod === "cash_on_delivery"
            ? "Cash on Delivery"
            : orderData.paymentMethod === "credit_card"
            ? "Credit/Debit Card"
            : orderData.paymentMethod
        }</p>
        <p><strong>Shipping Address:</strong> ${orderData.customer.address.street1}${
          orderData.customer.address.street2
            ? ", " + orderData.customer.address.street2
            : ""
        }, ${orderData.customer.address.city}, ${orderData.customer.address.country}</p>
        <p>We'll notify you once your order ships. Happy eating!</p>
        <p style="color: #FBBF24;">— MA Foods Team</p>
      `,
    };
    // Email sending is commented out as per your original code
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (subtotal === 0) {
      Swal.fire("Error", "Your cart is empty. Add items to proceed.", "warning");
      setIsSubmitting(false);
      return;
    }

    if (!validateForm()) {
      Swal.fire("Error", "Please fill in all required fields.", "error");
      setIsSubmitting(false);
      return;
    }

    if (!paymentOption) {
      Swal.fire("Error", "Please select a payment method.", "error");
      setIsSubmitting(false);
      return;
    }

    if (!termsAccepted) {
      Swal.fire("Error", "Please accept the terms and conditions.", "error");
      setIsSubmitting(false);
      return;
    }

    const orderData: OrderData = {
      _type: "order",
      orderNumber: generateOrderNumber(),
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.telephone,
        address: {
          street1: formData.address1,
          street2: formData.address2 || undefined,
          city: formData.city,
          country: formData.country,
        },
        subscribe: formData.subscribe,
      },
      items: cart.map((item) => ({
        _key: item._id + Date.now().toString(),
        product: { _type: "reference", _ref: item._id },
        quantity: item.quantity,
        price: item.price,
      })),
      paymentMethod: paymentOption,
      subtotal,
      shipping,
      discount,
      total,
      orderDate: new Date().toISOString(),
      notes: formData.comment || undefined,
    };

    try {
      const validCartItems = await Promise.all(
        orderData.items.map(async (item) => {
          const product = await sanityClient.fetch(
            `*[_type == "product" && _id == $id][0]`,
            { id: item.product._ref }
          );
          if (!product) throw new Error(`Invalid product ID: ${item.product._ref}`);
          return item;
        })
      );
      orderData.items = validCartItems;

      const result = await sanityClient.create(orderData);

      await sendOrderConfirmationEmail({ ...orderData, orderNumber: result.orderNumber });

      await Swal.fire({
        title: "Order Placed!",
        text: `Your order (${result.orderNumber}) is confirmed!`,
        icon: "success",
        confirmButtonText: "View Order",
        confirmButtonColor: "#FBBF24",
      });

      clearCart();
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        address1: "",
        address2: "",
        city: "",
        country: "Pakistan",
        telephone: "",
        comment: "",
        subscribe: false,
      });
      setPromoCode("");
      setDiscount(0);
      localStorage.removeItem("appliedDiscount");

      router.push(`/order-confirmation?orderNumber=${result.orderNumber}`);
    } catch (error) {
      console.error("Order failed:", error);
      Swal.fire(
        "Error",
        `Failed to place order: ${error instanceof Error ? error.message : "Unknown error"}`,
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-navy-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto">
        <Link
          href="/cart"
          className="flex items-center text-navy-900 hover:text-amber-400 mb-6 font-Montserrat"
        >
          <FaShoppingCart size={20} className="mr-2" />
          Back to Cart
        </Link>

        <div className="mb-8">
          <div className="flex justify-between text-sm font-Montserrat font-medium text-navy-500">
            <span>1. Cart</span>
            <span className="text-amber-400">2. Checkout</span>
            <span>3. Confirmation</span>
          </div>
          <div className="w-full bg-navy-200 h-2 rounded-full mt-2">
            <div className="bg-amber-400 h-2 rounded-full transition-all duration-300 w-2/3" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Delivery Details */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-navy-100">
            <h2 className="text-xl sm:text-2xl font-Montserrat font-semibold text-navy-900 mb-6">
              Delivery Details
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className="p-3 border border-navy-200 rounded-lg bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className="p-3 border border-navy-200 rounded-lg bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full p-3 border border-navy-200 rounded-lg bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="address1"
                placeholder="Address Line 1"
                className="w-full p-3 border border-navy-200 rounded-lg bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={formData.address1}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="address2"
                placeholder="Address Line 2 (optional)"
                className="w-full p-3 border border-navy-200 rounded-lg bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={formData.address2}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                className="w-full p-3 border border-navy-200 rounded-lg bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="telephone"
                placeholder="Phone Number"
                className="w-full p-3 border border-navy-200 rounded-lg bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={formData.telephone}
                onChange={handleInputChange}
                required
              />
              <select
                name="country"
                className="w-full p-3 border border-navy-200 rounded-lg bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={formData.country}
                onChange={handleInputChange}
              >
                <option value="Pakistan">Pakistan</option>
                <option value="USA">United States</option>
                <option value="UK">United Kingdom</option>
              </select>
              <textarea
                name="comment"
                placeholder="Additional Comments (optional)"
                className="w-full p-3 border border-navy-200 rounded-lg bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={formData.comment}
                onChange={handleInputChange}
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="subscribe"
                  checked={formData.subscribe}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-amber-400 border-navy-200 rounded"
                />
                <label className="text-sm text-navy-500 font-Montserrat">
                  Subscribe to our newsletter
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="h-5 w-5 text-amber-400 border-navy-200 rounded"
                  required
                />
                <label className="text-sm text-navy-500 font-Montserrat">
                  I agree to the{" "}
                  <Link href="/terms" className="text-amber-400 hover:underline">
                    Terms and Conditions
                  </Link>
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="w-full py-3 bg-amber-400 text-navy-900 rounded-full font-Montserrat font-semibold hover:bg-amber-500 disabled:bg-navy-400 disabled:text-navy-200 transition duration-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Placing Order..." : "Place Order"}
                </button>
                <Link
                  href="/shop"
                  className="w-full text-center py-3 bg-navy-900 text-amber-400 rounded-full font-Montserrat font-semibold hover:bg-navy-800 transition duration-300"
                >
                  Continue Shopping
                </Link>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-navy-100">
            <h2 className="text-xl sm:text-2xl font-Montserrat font-semibold text-navy-900 mb-6">
              Order Summary
            </h2>
            <div className="space-y-4">
              {cart.map((item) => {
                const discountedPrice = item.price - item.price * (item.discountPercentage / 100);
                return (
                  <div
                    key={item._id}
                    className="flex items-center justify-between gap-4 border-b border-navy-200 pb-4"
                  >
                    <div className="flex items-center gap-4">
                      {item.image ? (
                        typeof item.image === "string" ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={48}
                            height={48}
                            className="w-12 h-12 object-cover rounded-lg border border-navy-200"
                          />
                        ) : (
                          <Image
                            src={urlFor(item.image).url()}
                            alt={item.title}
                            width={48}
                            height={48}
                            className="w-12 h-12 object-cover rounded-lg border border-navy-200"
                          />
                        )
                      ) : (
                        <div className="w-12 h-12 bg-navy-100 rounded-lg flex items-center justify-center text-navy-500 text-sm">
                          No Image
                        </div>
                      )}
                      <div>
                        <div className="text-sm sm:text-base text-navy-900 font-Montserrat">
                          {item.title}
                        </div>
                        <div className="text-sm text-navy-500">Qty: {item.quantity}</div>
                      </div>
                    </div>
                    <span className="text-sm sm:text-base text-amber-400 font-Montserrat">
                      Rs. {(discountedPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}

              <div className="flex justify-between text-sm sm:text-base text-navy-500 font-Montserrat">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>

              <div className="border-t border-navy-200 pt-4">
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Promo Code (e.g., DISCOUNT10)"
                    className="flex-1 p-3 border border-navy-200 rounded-lg bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleApplyDiscount}
                    className="bg-amber-400 text-navy-900 px-4 py-2 rounded-full font-Montserrat hover:bg-amber-500 transition duration-300"
                  >
                    Apply
                  </button>
                </div>
                {promoError && <p className="text-red-500 text-sm font-Montserrat">{promoError}</p>}
                {discount > 0 && (
                  <div className="flex justify-between text-amber-400 text-sm sm:text-base font-Montserrat">
                    <span>Discount</span>
                    <span>-Rs. {discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between text-sm sm:text-base text-navy-500 font-Montserrat">
                <span className="flex items-center gap-2">
                  <FaTruck className="text-amber-400" /> Shipping
                </span>
                <span>{shipping === 0 ? "Free" : `Rs. ${shipping.toFixed(2)}`}</span>
              </div>

              <div className="flex justify-between text-sm sm:text-base text-navy-500 font-Montserrat">
                <span className="flex items-center gap-2">
                  <FaCalendarAlt className="text-amber-400" /> Est. Delivery
                </span>
                <span>{new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
              </div>

              <div className="border-t border-navy-200 pt-4">
                <h3 className="text-sm sm:text-base font-Montserrat font-semibold text-navy-900 mb-2">
                  Billing Address
                </h3>
                <p className="text-navy-500 text-sm font-Montserrat">
                  {formData.address1}
                  {formData.address2 && `, ${formData.address2}`}, {formData.city},{" "}
                  {formData.country}
                </p>
              </div>

              <div className="border-t border-navy-200 pt-4">
                <h3 className="text-sm sm:text-base font-Montserrat font-semibold text-navy-900 mb-4 flex items-center gap-2">
                  <FaGift className="text-amber-400" /> Rewards
                </h3>
                <div className="space-y-4 text-navy-500">
                  {isEligibleForGift ? (
                    <div>
                      <p className="text-amber-400 font-Montserrat">
                        Free Gift: <strong>Custom Mug</strong>
                      </p>
                      <p className="text-sm">A special thank you for your order over Rs. 15,000!</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-Montserrat">
                        Add Rs. {(freeGiftThreshold - subtotal).toFixed(2)} for a free{" "}
                        <strong>Custom Mug</strong>
                      </p>
                    </div>
                  )}
                  {isEligibleForDiscountCoupon ? (
                    <div>
                      <p className="text-amber-400 font-Montserrat">
                        Coupon: <strong>10% Off Next Purchase</strong>
                      </p>
                      <p className="text-sm">Use this on your next order over Rs. 20,000!</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-Montserrat">
                        Add Rs. {(discountCouponThreshold - subtotal).toFixed(2)} for a{" "}
                        <strong>10% Off Coupon</strong>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between text-base sm:text-lg font-Montserrat font-bold border-t border-navy-200 pt-4 text-amber-400">
                <span>Total</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>

              <select
                value={paymentOption}
                onChange={(e) => setPaymentOption(e.target.value)}
                className="w-full p-3 mt-4 border border-navy-200 rounded-lg bg-white text-navy-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                required
              >
                <option value="">Select Payment Method</option>
                <option value="cash_on_delivery">Cash on Delivery</option>
                <option value="credit_card">Credit/Debit Card</option>
                <option value="easypaisa">EasyPaisa</option>
                <option value="jazzcash">JazzCash</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}