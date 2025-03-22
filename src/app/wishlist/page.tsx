"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { client, urlFor } from "../../sanity/lib/client";
import { allProductsQuery } from "../../sanity/lib/queries";
import { Product, CartItem } from "../utils/types";
import { FaRegHeart, FaHeart, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/cartContext";

export default function Wishlist() {
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      const storedWishlist = localStorage.getItem("wishlist");
      const initialWishlist = storedWishlist ? new Set<string>(JSON.parse(storedWishlist)) : new Set<string>();
      return new Set(Array.from(initialWishlist).filter((id) => id !== "navbar-wishlist" && id.length > 0));
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
      setWishlist((prevWishlist) => {
        const validIds = new Set(fetchedProducts.map((p) => p._id));
        const filteredWishlist = new Set(Array.from(prevWishlist).filter((id) => validIds.has(id)));
        if (filteredWishlist.size !== prevWishlist.size) {
          localStorage.setItem("wishlist", JSON.stringify(Array.from(filteredWishlist)));
          window.dispatchEvent(new Event("wishlistUpdated"));
        }
        return filteredWishlist;
      });
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("wishlist", JSON.stringify(Array.from(wishlist)));
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
      totalPrice: product.discountPercentage
        ? getDiscountedPrice(product.price, product.discountPercentage)
        : product.price,
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
    <div className="min-h-screen bg-navy-50 py-12 px-4 sm:px-6 lg:px-8 mt-8">
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
          <div className="text-center">
            <p className="text-navy-500 text-lg font-Montserrat mb-6">
              Your wishlist is empty. Start adding your favorites!
            </p>
            <Link href="/shop">
              <button className="bg-amber-400 text-navy-900 px-6 py-2 rounded-full font-Montserrat font-semibold hover:bg-amber-500 transition-colors">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlistProducts.map((product) => {
                const discountedPrice = getDiscountedPrice(product.price, product.discountPercentage || 0);

                return (
                  <div
                    key={product._id}
                    className="relative bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-navy-100 hover:shadow-2xl hover:border-amber-300 transition-all duration-300"
                  >
                    {/* Add to Cart Icon on the Right */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="absolute bottom-14 right-6 bg-yellow-400 text-black p-2 rounded-full hover:bg-navy-800 transition-colors"
                      aria-label="Add to Cart"
                    >
                      <FaShoppingCart size={20} />
                    </button>

                    <Link href={`/products/${product.slug.current}`}>
                      <h2 className="text-base sm:text-lg font-Montserrat font-bold text-navy-900 mb-2 pr-10">
                        {product.title}
                      </h2>
                      {product.images && product.images.length > 0 ? (
                        <div className="relative">
                          <Image
                            src={urlFor(product.images[0]).url()}
                            alt={product.title}
                            width={300}
                            height={250}
                            style={{ objectFit: "cover" }}
                            className="w-full h-40 sm:h-48 rounded-lg mb-2 transition-transform hover:scale-105"
                          />
                          {product.discountPercentage > 0 && (
                            <div className="absolute top-2 left-2 bg-amber-400 text-navy-900 text-xs font-semibold py-1 px-2 rounded-full">
                              {product.discountPercentage}% OFF
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-navy-500">No image available</p>
                      )}
                      <p className="text-navy-900 font-bold mb-2">
                        {product.discountPercentage > 0 && (
                          <span className="line-through text-navy-400">PKR {product.price}</span>
                        )}
                        <span className="ml-2 text-amber-500">PKR {discountedPrice.toFixed(2)}</span>
                      </p>
                      <div className="flex items-center text-sm text-amber-400">
                        <span>★★★★☆</span>
                        <span className="ml-1 text-navy-500">
                          {product.customerReviews ? product.customerReviews.length : 0} reviews
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
                      {/* Keeping the bottom-right Add to Cart button as well */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-navy-900 text-white p-2 rounded-full hover:bg-navy-800 transition-colors"
                      >
                        <FaShoppingCart size={20} />
                      </button>
                    </div>
                    <div className="text-sm text-green-500 mt-2 text-center">
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
            <div className="text-center mt-8">
              <Link href="/shop">
                <button className="bg-amber-400 text-navy-900 px-6 py-2 rounded-full font-Montserrat font-semibold hover:bg-amber-500 transition-colors">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </>
        )}

        {/* Cart Icon */}
        <Link href="/cart" className="fixed bottom-6 right-6">
          <button className="bg-yellow-400 text-blue-600 rounded-full p-4 shadow-lg hover:bg-navy-800 transition-colors">
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