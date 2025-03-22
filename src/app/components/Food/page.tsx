"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { client } from "../../../sanity/lib/client";
import { allProductsQuery } from "../../../sanity/lib/queries";
import { FaRegHeart, FaHeart, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../../app/context/cartContext";
import { Product, CartItem } from "../../../app/utils/types";

export default function BestSelling() {
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      const storedWishlist = localStorage.getItem("wishlist");
      return storedWishlist ? new Set<string>(JSON.parse(storedWishlist)) : new Set<string>();
    }
    return new Set<string>();
  });
  const [wishlistCount, setWishlistCount] = useState(0);
  const [notification, setNotification] = useState<string | null>(null);
  const [notificationType, setNotificationType] = useState<string>("");

  const { cart, addToCart } = useCart();
  const totalItemsInCart = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    async function fetchProduct() {
      const fetchedProducts: Product[] = await client.fetch(allProductsQuery);
      setProducts(fetchedProducts);
    }
    fetchProduct();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("wishlist", JSON.stringify(Array.from(wishlist)));
      window.dispatchEvent(new Event("wishlistUpdated"));
    }
  }, [wishlist]);

  useEffect(() => {
    const updateWishlistCount = () => {
      if (typeof window !== "undefined") {
        const storedWishlist = localStorage.getItem("wishlist");
        const wishlistSet = storedWishlist ? new Set<string>(JSON.parse(storedWishlist)) : new Set<string>();
        setWishlistCount(wishlistSet.size);
      }
    };
    updateWishlistCount();
    window.addEventListener("storage", updateWishlistCount);
    window.addEventListener("wishlistUpdated", updateWishlistCount);
    return () => {
      window.removeEventListener("storage", updateWishlistCount);
      window.removeEventListener("wishlistUpdated", updateWishlistCount);
    };
  }, []);

  const handleWishlistToggle = (productId: string) => {
    setWishlist((prevWishlist) => {
      const updatedWishlist = new Set(prevWishlist);
      if (updatedWishlist.has(productId)) {
        updatedWishlist.delete(productId);
        setNotification("Item removed from Wishlist");
        setNotificationType("remove");
      } else {
        updatedWishlist.add(productId);
        setNotification("Item added to Wishlist");
        setNotificationType("wishlist");
      }
      return updatedWishlist;
    });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddToCart = (product: Product) => {
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
      totalPrice: calculateTotalPrice(product),
    };
    addToCart(cartProduct);
    setNotification("Item added to Cart");
    setNotificationType("cart");
    setTimeout(() => setNotification(null), 3000);
  };

  const calculateTotalPrice = (product: Product): number => {
    let total = product.price;
    if (product.discountPercentage) {
      total -= (total * product.discountPercentage) / 100;
    }
    return total;
  };

  const getAverageRating = (reviews: Product["customerReviews"]): number => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  };

  return (
    <div className="py-12 sm:py-16 bg-ivoryWhite overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-Montserrat font-extrabold text-navyBlue tracking-tight">
            Best Selling Products
          </h1>
          <div className="flex justify-center mt-2">
            <div className="w-16 h-1 rounded-full bg-darkOrange" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const discountedPrice = calculateTotalPrice(product);
            const averageRating = getAverageRating(product.customerReviews);
            return (
              <div
                key={product._id}
                className="relative bg-softWhite rounded-xl shadow-lg p-4 sm:p-6 border border-charcoal hover:shadow-2xl hover:border-darkOrange transition-all duration-300"
              >
                <Link href={`/products/${product.slug.current}`}>
                  <h2 className="text-base sm:text-lg font-Montserrat font-bold text-navyBlue mb-2">
                    {product.title}
                  </h2>
                  {product.images && product.images.length > 0 && product.images[0]?.asset?.url ? (
                    <div className="relative">
                      <Image
                        src={product.images[0].asset.url}
                        alt={product.images[0].alt || product.title}
                        width={300}
                        height={250}
                        style={{ objectFit: "cover" }}
                        className="w-full h-40 sm:h-48 rounded-lg mb-2 transition-transform hover:scale-105"
                      />
                      {product.discountPercentage > 0 && (
                        <div className="absolute top-2 left-2 bg-darkOrange text-ivoryWhite text-xs font-semibold py-1 px-2 rounded-full">
                          {product.discountPercentage}% OFF
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-40 sm:h-48 bg-charcoal rounded-lg mb-2 flex items-center justify-center">
                      <p className="text-softWhite">No image available</p>
                    </div>
                  )}
                  <p className="text-navyBlue font-bold mb-2">
                    {product.discountPercentage > 0 && (
                      <span className="line-through text-charcoal">PKR {product.price}</span>
                    )}
                    <span className="ml-2 text-darkOrange">PKR {discountedPrice.toFixed(2)}</span>
                  </p>
                  <div className="flex items-center text-sm text-darkYellow">
                    <span>
                      {"★".repeat(Math.round(averageRating))}
                      {"☆".repeat(5 - Math.round(averageRating))}
                    </span>
                    <span className="ml-1 text-charcoal">
                      ({product.customerReviews?.length || 0} reviews)
                    </span>
                  </div>
                  <div className="text-sm text-charcoal mt-1">
                    {product.category === "ready_to_wear"
                      ? "Ready-to-Wear"
                      : product.category === "unstitched"
                      ? "Unstitched"
                      : "Custom-Stitched"}
                  </div>
                </Link>

                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => handleWishlistToggle(product._id)}
                    className="bg-darkOrange text-ivoryWhite p-2 rounded-full hover:bg-darkYellow transition-colors duration-300"
                  >
                    {wishlist.has(product._id) ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
                  </button>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-navyBlue text-softWhite p-2 rounded-full hover:bg-charcoal transition-colors duration-300"
                  >
                    <FaShoppingCart size={20} />
                  </button>
                </div>
                <div className="absolute top-2 right-2 bg-charcoal text-ivoryWhite text-xs font-semibold py-1 px-2 rounded-full">
                  Best Seller
                </div>
                <div
                  className={`text-sm mt-2 text-center ${
                    product.availability === "in_stock"
                      ? "text-green-500"
                      : product.availability === "out_of_stock"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }`}
                >
                  {product.availability === "in_stock"
                    ? "In Stock"
                    : product.availability === "out_of_stock"
                    ? "Out of Stock"
                    : "Pre-Order"}
                </div>
              </div>
            );
          })}
        </div>

        <div className="fixed bottom-6 right-6 flex space-x-4">
          <Link href="/wishlist" className="relative">
            <button className="bg-darkOrange text-ivoryWhite rounded-full p-4 shadow-lg hover:bg-darkYellow transition-colors duration-300">
              <FaHeart size={24} />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 bg-navyBlue text-softWhite text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>
          </Link>
          <Link href="/cart" className="relative">
            <button className="bg-darkOrange text-ivoryWhite rounded-full p-4 shadow-lg hover:bg-darkYellow transition-colors duration-300">
              <FaShoppingCart size={24} />
              {totalItemsInCart > 0 && (
                <span className="absolute top-0 right-0 bg-navyBlue text-softWhite text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItemsInCart}
                </span>
              )}
            </button>
          </Link>
        </div>

        {notification && (
          <div
            className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-md text-ivoryWhite ${
              notificationType === "cart"
                ? "bg-navyBlue"
                : notificationType === "wishlist"
                ? "bg-darkOrange"
                : "bg-red-500"
            }`}
          >
            {notification}
          </div>
        )}
      </div>
    </div>
  );
}