"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { client, urlFor } from "../../sanity/lib/client";
import { allProductsQuery } from "../../sanity/lib/queries";
import { Product } from "../utils/types";
import { FaRegHeart, FaHeart, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/cartContext";

export default function Wishlist() {
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      const storedWishlist = localStorage.getItem("wishlist");
      return storedWishlist ? new Set<string>(JSON.parse(storedWishlist)) : new Set<string>();
    }
    return new Set<string>();
  });
  const [notification, setNotification] = useState<string | null>(null);
  const [notificationType, setNotificationType] = useState<string>("");

  const { cart, addToCart } = useCart();
  const totalItemsInCart = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    async function fetchProducts() {
      const fetchedProducts: Product[] = await client.fetch(allProductsQuery);
      setProducts(fetchedProducts);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("wishlist", JSON.stringify([...Array.from(wishlist)]));
      // Dispatch a custom event to notify other components (e.g., Navbar) of the wishlist update
      window.dispatchEvent(new Event("wishlistUpdated"));
    }
  }, [wishlist]);

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
    // Transform Product to match cartContext's Product
    const cartProduct = {
      _id: product._id,
      title: product.productName,
      price: product.price,
      image: typeof product.image === 'string' ? product.image : product.image?.asset?.url || "/path/to/placeholder-image.png", // Use the resolved URL from Sanity
      discountPercentage: product.discountPercentage,
      productImage: {
        asset: {
          url: typeof product.image === 'string' ? product.image : product.image?.asset?.url || "/path/to/placeholder-image.png", // Match cartContext expectation
        },
      },
    };
    addToCart(cartProduct);
    setNotification("Item added to Cart");
    setNotificationType("cart");
    setTimeout(() => setNotification(null), 3000);
  };

  const getDiscountedPrice = (price: number, discountPercentage: number) =>
    price - price * (discountPercentage / 100);

  const wishlistProducts = products.filter((product) => wishlist.has(product._id));

  return (
    <div className="min-h-screen bg-navy-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-Montserrat font-extrabold text-navy-900 tracking-tight">
            Your Wishlist
          </h1>
          <div className="flex justify-center mt-2">
            <div className="w-16 h-1 rounded-full bg-amber-400" />
          </div>
        </div>

        {wishlistProducts.length === 0 ? (
          <p className="text-center text-navy-500 text-lg font-Montserrat">
            Your wishlist is empty. Start adding your favorites!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistProducts.map((product) => {
              const discountedPrice = getDiscountedPrice(product.price, product.discountPercentage);

              return (
                <div
                  key={product._id}
                  className="relative bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-navy-100 hover:shadow-2xl hover:border-amber-300 transition-all duration-300"
                >
                  <Link href={`/products/${product.slug.current}`}>
                    <h2 className="text-base sm:text-lg font-Montserrat font-bold text-navy-900 mb-2">
                      {product.productName}
                    </h2>
                    {product.image ? (
                      <div className="relative">
                        <Image
                          src={urlFor(product.image).url()}
                          alt={product.title}
                          width={300}
                          height={250}
                          style={{ objectFit: "cover" }}
                          className="w-full h-40 sm:h-48 rounded-lg mb-2 transition-transform hover:scale-105"
                        />
                        <div className="absolute top-2 left-2 bg-amber-400 text-navy-900 text-xs font-semibold py-1 px-2 rounded-full">
                          {product.discountPercentage}% OFF
                        </div>
                      </div>
                    ) : (
                      <p className="text-navy-500">No image available</p>
                    )}
                    <p className="text-navy-900 font-bold mb-2">
                      <span className="line-through text-navy-400">PKR {product.price}</span>
                      <span className="ml-2 text-amber-500">PKR {discountedPrice.toFixed(2)}</span>
                    </p>
                    <div className="flex items-center text-sm text-amber-400">
                      <span>★★★★☆</span>
                      <span className="ml-1 text-navy-500">
                        {product.reviews ? product.reviews.length : 0} reviews
                      </span>
                    </div>
                  </Link>

                  <div className="flex justify-between items-center mt-4">
                    <button
                      onClick={() => handleWishlistToggle(product._id)}
                      className="bg-amber-400 text-navy-900 p-2 rounded-full hover:bg-amber-500 transition-colors"
                    >
                      {wishlist.has(product._id) ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="bg-navy-900 text-white p-2 rounded-full hover:bg-navy-800 transition-colors"
                    >
                      <FaShoppingCart size={20} />
                    </button>
                  </div>
                  <div className="text-sm text-green-500 mt-2 text-center">In Stock</div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cart Icon */}
        <Link href="/cart" className="fixed bottom-6 right-6">
          <button className="bg-navy-900 text-white rounded-full p-4 shadow-lg hover:bg-navy-800 transition-colors">
            <FaShoppingCart size={24} />
            {totalItemsInCart > 0 && (
              <span className="absolute top-0 right-0 bg-amber-400 text-navy-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItemsInCart}
              </span>
            )}
          </button>
        </Link>

        {/* Notification */}
        {notification && (
          <div
            className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-md text-white ${
              notificationType === "cart"
                ? "bg-navy-900"
                : notificationType === "wishlist"
                ? "bg-amber-400"
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