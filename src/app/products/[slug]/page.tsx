"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { client } from "../../../sanity/lib/client";
import { groq } from "next-sanity";
import { Product, CartItem } from "../../../app/utils/types";
import { FaShoppingCart } from "react-icons/fa";
import Link from "next/link";
import { useCart } from "../../../app/context/cartContext";

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      const query = groq`*[_type == "product" && slug.current == $slug][0] {
        _id,
        title,
        description,
        "slug": slug.current,
        category,
        productType,
        fabricType,
        materials,
        colors,
        embroideryDetails,
        pattern,
        "images": images[] { _key, _type, "asset": asset-> { url }, alt, caption },
        sizes[] { size, priceAdjustment },
        measurements { shirtLength, dupattaLength, trouserLength },
        customizationOptions[] { optionName, choices, additionalCost },
        price,
        discountPercentage,
        inventory,
        availability,
        shippingInformation,
        careInstructions,
        specialOffers,
        customerReviews[] { rating, comment, reviewerName, reviewDate },
        tags,
        dateAdded,
        isFeatured,
        "relatedProducts": relatedProducts[]-> { _id, title, "slug": slug.current, "images": images[] { _key, _type, "asset": asset-> { url }, alt, caption } }
      }`;
      try {
        const fetchedProduct: Product = await client.fetch(query, { slug });
        if (fetchedProduct) {
          setProduct(fetchedProduct);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    const imageUrl = product.images[0]?.asset.url || "/path/to/placeholder-image.png";
    const cartProduct: CartItem = {
      id: product._id,
      title: product.title,
      image: imageUrl,
      slug: product.slug.current,
      price: product.price,
      category: product.category,
      productType: product.productType,
      selectedSize: product.sizes?.[0]?.size || "",
      selectedCustomizations: {},
      quantity: 1,
      discountPercentage: product.discountPercentage || 0,
      totalPrice: discountedPrice,
    };
    addToCart(cartProduct);
    setNotification("Item added to Cart");
    setTimeout(() => setNotification(null), 3000);
  };

  if (loading) {
    return <div className="text-center py-20 text-navyBlue">Loading...</div>;
  }

  if (!product) {
    return <div className="text-center py-20 text-navyBlue">Product not found</div>;
  }

  const discountedPrice = product.discountPercentage
    ? product.price - (product.price * product.discountPercentage) / 100
    : product.price;

  return (
    <div className="bg-ivoryWhite min-h-screen py-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            {product.images && product.images.length > 0 ? (
              product.images.map((image) => (
                <div key={image._key} className="relative">
                  <Image
                    src={image.asset.url}
                    alt={image.alt || product.title}
                    width={500}
                    height={400}
                    style={{ objectFit: "cover" }}
                    className="w-full rounded-lg shadow-md"
                  />
                  {image.caption && (
                    <p className="text-sm text-charcoal mt-2">{image.caption}</p>
                  )}
                </div>
              ))
            ) : (
              <div className="w-full h-64 bg-charcoal rounded-lg flex items-center justify-center">
                <p className="text-softWhite">No image available</p>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <h1 className="text-3xl font-Montserrat font-extrabold text-navyBlue">
              {product.title}
            </h1>
            <p className="text-lg text-charcoal">{product.description}</p>
            <p className="text-2xl font-bold text-navyBlue">
              {product.discountPercentage > 0 && (
                <span className="line-through text-charcoal">PKR {product.price}</span>
              )}
              <span className="ml-2 text-darkOrange">PKR {discountedPrice.toFixed(2)}</span>
            </p>
            {product.discountPercentage > 0 && (
              <p className="text-sm text-darkOrange">{product.discountPercentage}% OFF</p>
            )}
            <p className="text-sm text-charcoal">
              <strong>Category:</strong>{" "}
              {product.category === "ready_to_wear"
                ? "Ready-to-Wear"
                : product.category === "unstitched"
                ? "Unstitched"
                : "Custom-Stitched"}
            </p>
            <p className="text-sm text-charcoal">
              <strong>Product Type:</strong>{" "}
              {product.productType === "stitched"
                ? "Stitched"
                : product.productType === "unstitched"
                ? "Unstitched"
                : "Custom-Stitched"}
            </p>
            <p className="text-sm text-charcoal">
              <strong>Fabric Type:</strong> {product.fabricType || "N/A"}
            </p>
            <p className="text-sm text-charcoal">
              <strong>Materials:</strong>{" "}
              {product.materials?.join(", ") || "Not specified"}
            </p>
            <p className="text-sm text-charcoal">
              <strong>Colors:</strong> {product.colors?.join(", ") || "Not specified"}
            </p>
            {product.embroideryDetails && (
              <p className="text-sm text-charcoal">
                <strong>Embroidery Details:</strong> {product.embroideryDetails}
              </p>
            )}
            <p className="text-sm text-charcoal">
              <strong>Pattern:</strong> {product.pattern || "N/A"}
            </p>
            {product.sizes && (
              <p className="text-sm text-charcoal">
                <strong>Sizes:</strong>{" "}
                {product.sizes.map((size) => (
                  <span key={size.size}>
                    {size.size} {size.priceAdjustment ? `(+PKR ${size.priceAdjustment})` : ""}
                    ,{" "}
                  </span>
                ))}
              </p>
            )}
            {product.measurements && (
              <p className="text-sm text-charcoal">
                <strong>Measurements:</strong>{" "}
                {product.measurements.shirtLength && `${product.measurements.shirtLength}m Shirt, `}
                {product.measurements.dupattaLength && `${product.measurements.dupattaLength}m Dupatta, `}
                {product.measurements.trouserLength && `${product.measurements.trouserLength}m Trouser`}
              </p>
            )}
            {product.customizationOptions && (
              <div className="text-sm text-charcoal">
                <strong>Customization Options:</strong>
                <ul className="list-disc pl-5">
                  {product.customizationOptions.map((option, index) => (
                    <li key={index}>
                      {option.optionName}: {option.choices.join(", ")}{" "}
                      {option.additionalCost ? `(+PKR ${option.additionalCost})` : ""}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-sm text-charcoal">
              <strong>Availability:</strong>{" "}
              <span
                className={
                  product.availability === "in_stock"
                    ? "text-green-500"
                    : product.availability === "out_of_stock"
                    ? "text-red-500"
                    : "text-yellow-500"
                }
              >
                {product.availability === "in_stock"
                  ? "In Stock"
                  : product.availability === "out_of_stock"
                  ? "Out of Stock"
                  : "Pre-Order"}
              </span>
            </p>
            {product.inventory !== undefined && (
              <p className="text-sm text-charcoal">
                <strong>Inventory:</strong> {product.inventory} units
              </p>
            )}
            {product.shippingInformation && (
              <p className="text-sm text-charcoal">
                <strong>Shipping Information:</strong> {product.shippingInformation}
              </p>
            )}
            {product.careInstructions && (
              <p className="text-sm text-charcoal">
                <strong>Care Instructions:</strong> {product.careInstructions}
              </p>
            )}
            {product.specialOffers && (
              <p className="text-sm text-darkOrange">
                <strong>Special Offers:</strong> {product.specialOffers}
              </p>
            )}
            {product.customerReviews && product.customerReviews.length > 0 && (
              <div className="text-sm text-charcoal">
                <strong>Customer Reviews:</strong>
                <ul className="list-disc pl-5">
                  {product.customerReviews.map((review, index) => (
                    <li key={index}>
                      {review.rating}/5 - "{review.comment}" by {review.reviewerName} (
                      {new Date(review.reviewDate).toLocaleDateString()})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {product.tags && (
              <p className="text-sm text-charcoal">
                <strong>Tags:</strong> {product.tags.join(", ")}
              </p>
            )}
            <p className="text-sm text-charcoal">
              <strong>Date Added:</strong> {new Date(product.dateAdded).toLocaleDateString()}
            </p>
            <p className="text-sm text-charcoal">
              <strong>Featured:</strong> {product.isFeatured ? "Yes" : "No"}
            </p>
            {product.relatedProducts && product.relatedProducts.length > 0 && (
              <div className="text-sm text-charcoal">
                <strong>Related Products:</strong>
                <ul className="list-disc pl-5">
                  {product.relatedProducts.map((related) => (
                    <li key={related._id}>
                      <Link href={`/products/${related.slug}`} className="text-darkOrange hover:text-darkYellow">
                        {related.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              className="mt-4 bg-navyBlue text-softWhite px-6 py-3 rounded-full flex items-center justify-center gap-2 hover:bg-darkYellow transition-colors duration-300"
              onClick={handleAddToCart}
            >
              <FaShoppingCart size={20} /> Add to Cart
            </button>
          </div>
        </div>

        {notification && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-md text-ivoryWhite bg-navyBlue">
            {notification}
          </div>
        )}
      </div>
    </div>
  );
}