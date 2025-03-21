import { defineType } from "sanity"

export default defineType({
    name: "order",
    title: "Order",
    type: "document",
    fields: [
      { name: "orderNumber", title: "Order Number", type: "string" },
      {
        name: "customer",
        title: "Customer Details",
        type: "object",
        fields: [
          { name: "firstName", title: "First Name", type: "string" },
          { name: "lastName", title: "Last Name", type: "string" },
          { name: "email", title: "Email", type: "string" },
          { name: "phone", title: "Phone Number", type: "string" },
          { name: "address", title: "Address", type: "text" },
        ],
      },
      {
        name: "items",
        title: "Order Items",
        type: "array",
        of: [
          {
            type: "object",
            fields: [
              { name: "product", title: "Product", type: "reference", to: [{ type: "product" }] },
              { name: "title", title: "Title", type: "string" },
              { name: "price", title: "Price", type: "number" },
              { name: "quantity", title: "Quantity", type: "number" },
              { name: "discount", title: "Discount", type: "number" },
            ],
          },
        ],
      },
      { name: "subtotal", title: "Subtotal", type: "number" },
      { name: "shipping", title: "Shipping Cost", type: "number" },
      { name: "total", title: "Total Amount", type: "number" },
      { name: "paymentMethod", title: "Payment Method", type: "string" },
      { name: "notes", title: "Notes", type: "text" },
      { name: "status", title: "Order Status", type: "string", options: { list: ["pending", "shipped", "delivered", "cancelled"] } },
      { name: "createdAt", title: "Order Date", type: "datetime" },
    ],
});
