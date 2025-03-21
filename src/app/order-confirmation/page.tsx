"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@sanity/client";
import { FaDownload, FaHome } from "react-icons/fa";
import { jsPDF } from "jspdf";

// Sanity client configuration
const sanityClient = createClient({
  projectId: "p72g6oqi",
  dataset: "production",
  apiVersion: "2023-05-03",
  useCdn: true,
});

// Define OrderData interface
interface OrderData {
  _id: string;
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
      title: string; // Updated to include title instead of just _ref
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
  donation?: number;
}

const OrderConfirmationContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderNumber = searchParams.get("orderNumber");
    if (orderNumber) {
      // Fetch order details from Sanity with product title
      sanityClient
        .fetch(
          `*[_type == "order" && orderNumber == $orderNumber][0] {
            _id,
            orderNumber,
            customer {
              firstName,
              lastName,
              email,
              phone,
              address {
                street1,
                street2,
                city,
                country
              },
              subscribe
            },
            items[] {
              _key,
              "product": product->{
                title
              },
              quantity,
              price
            },
            paymentMethod,
            subtotal,
            shipping,
            discount,
            total,
            orderDate,
            notes,
            donation
          }`,
          { orderNumber }
        )
        .then((data) => {
          setOrderDetails(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch order details:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const handleDownloadPDF = () => {
    if (!orderDetails) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Order Confirmation", 20, 20);
    doc.setFontSize(12);
    doc.text(`Order Number: ${orderDetails.orderNumber}`, 20, 30);
    doc.text(`Order Date: ${new Date(orderDetails.orderDate).toLocaleDateString()}`, 20, 40);
    doc.text(`Customer Name: ${orderDetails.customer.firstName} ${orderDetails.customer.lastName}`, 20, 50);
    doc.text(`Email: ${orderDetails.customer.email}`, 20, 60);
    doc.text(`Phone: ${orderDetails.customer.phone}`, 20, 70);
    doc.text(
      `Address: ${orderDetails.customer.address.street1}, ${orderDetails.customer.address.street2 || ""}, ${
        orderDetails.customer.address.city
      }, ${orderDetails.customer.address.country}`,
      20,
      80
    );
    doc.text("Items:", 20, 100);
    orderDetails.items.forEach((item, index) => {
      doc.text(
        `${index + 1}. Product: ${item.product.title}, Quantity: ${item.quantity}, Price: Rs. ${item.price.toFixed(2)}`,
        30,
        110 + index * 10
      );
    });
    doc.text(`Subtotal: Rs. ${orderDetails.subtotal.toFixed(2)}`, 20, 110 + orderDetails.items.length * 10 + 10);
    doc.text(`Shipping: Rs. ${orderDetails.shipping.toFixed(2)}`, 20, 110 + orderDetails.items.length * 10 + 20);
    doc.text(`Discount: Rs. ${orderDetails.discount.toFixed(2)}`, 20, 110 + orderDetails.items.length * 10 + 30);
    doc.text(`Total: Rs. ${orderDetails.total.toFixed(2)}`, 20, 110 + orderDetails.items.length * 10 + 40);
    doc.text(`Payment Method: ${orderDetails.paymentMethod}`, 20, 110 + orderDetails.items.length * 10 + 50);
    if (orderDetails.notes) {
      doc.text(`Notes: ${orderDetails.notes}`, 20, 110 + orderDetails.items.length * 10 + 60);
    }
    doc.save(`Order_${orderDetails.orderNumber}.pdf`);
  };

  if (loading) {
    return (
      <div className="bg-navy-900 min-h-screen py-12 flex items-center justify-center">
        <div className="text-amber-400 text-2xl">Loading...</div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="bg-navy-900 min-h-screen py-12 flex items-center justify-center">
        <div className="text-amber-400 text-2xl">Order not found.</div>
      </div>
    );
  }

  return (
    <div className="bg-navy-900 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-amber-400 mb-8 text-center">Order Confirmation</h1>
        <div className="bg-navy-800 p-8 rounded-lg shadow-lg border border-navy-600">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-amber-400">Thank You for Your Order!</h2>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 bg-amber-500 text-navy-900 px-4 py-2 rounded-lg hover:bg-amber-600 transition duration-300"
            >
              <FaDownload /> Download PDF
            </button>
          </div>

          {/* Customer Details Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-amber-400 mb-4 border-b border-navy-500 pb-2">
              Customer Details
            </h3>
            <div className="space-y-2 text-navy-200">
              <p>
                <strong>Name:</strong> {orderDetails.customer.firstName} {orderDetails.customer.lastName}
              </p>
              <p>
                <strong>Email:</strong> {orderDetails.customer.email}
              </p>
              <p>
                <strong>Phone:</strong> {orderDetails.customer.phone}
              </p>
              <p>
                <strong>Address:</strong> {orderDetails.customer.address.street1},{" "}
                {orderDetails.customer.address.street2 && `${orderDetails.customer.address.street2}, `}
                {orderDetails.customer.address.city}, {orderDetails.customer.address.country}
              </p>
              <p>
                <strong>Subscribed to Newsletter:</strong> {orderDetails.customer.subscribe ? "Yes" : "No"}
              </p>
            </div>
          </div>

          {/* Order Details Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-amber-400 mb-4 border-b border-navy-500 pb-2">
              Order Details
            </h3>
            <div className="space-y-2 text-navy-200">
              <p>
                <strong>Order Number:</strong> {orderDetails.orderNumber}
              </p>
              <p>
                <strong>Order Date:</strong> {new Date(orderDetails.orderDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Estimated Delivery:</strong>{" "}
                {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </p>
              <h4 className="text-lg font-medium text-amber-400 mt-4">Items Ordered:</h4>
              <ul className="list-disc pl-5">
                {orderDetails.items.map((item, index) => (
                  <li key={index}>
                    Product: {item.product.title}, Quantity: {item.quantity}, Price: Rs. {item.price.toFixed(2)}
                  </li>
                ))}
              </ul>
              <p>
                <strong>Subtotal:</strong> Rs. {orderDetails.subtotal.toFixed(2)}
              </p>
              <p>
                <strong>Shipping:</strong> Rs. {orderDetails.shipping.toFixed(2)}
              </p>
              <p>
                <strong>Discount:</strong> Rs. {orderDetails.discount.toFixed(2)}
              </p>
              <p>
                <strong>Total:</strong> Rs. {orderDetails.total.toFixed(2)}
              </p>
              <p>
                <strong>Payment Method:</strong>{" "}
                {orderDetails.paymentMethod === "cash_on_delivery"
                  ? "Cash on Delivery"
                  : orderDetails.paymentMethod === "credit_card"
                  ? "Credit/Debit Card"
                  : orderDetails.paymentMethod}
              </p>
              {orderDetails.notes && (
                <p>
                  <strong>Notes:</strong> {orderDetails.notes}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 w-full justify-center bg-navy-600 text-amber-400 py-2 rounded-lg shadow-lg hover:bg-navy-700 transition duration-300"
            >
              <FaHome /> Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function OrderConfirmation() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  );
}