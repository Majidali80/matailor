export interface Product {
    _id: string;
    productName: string;
    title: string;
    image: {
      length: number;
      map(arg0: (image: import("@sanity/image-url/lib/types/types").SanityImageSource, index: import("react").Key | null | undefined) => import("react").JSX.Element): import("react").ReactNode | Iterable<import("react").ReactNode>;
      slice(arg0: number, arg1: number): unknown;
      asset: {
        url: string;
      };
    };
    price: number;
    description: string;
    fabricType: string;
    materials: string[];
    dimensions: string;
    sizes: { size: string; price: number }[];  // This will allow sizes with prices
    tags: string[];
    category: string;
    inventory: number;
    colors: string[];
    discountPercentage: number;
    careInstructions: string;
    availability: string;
    customerReviews: string[];
    dateAdded: string;
    shippingInformation: string;
    specialOffers: string;
    slug: {
      _type: "slug";
      current: string;
    };
    reviews: { rating: number; comment: string }[];
    productImage?: string;
    // Adding optional fields for the cart context
    selectedSize: string; // This is added to store selected size
    quantity: number;     // This is added to store quantity
    
  }
  
  export type CartItem = {
    id: number;
    title: string;
    image?: { asset: { _ref: string } } | string; // Allowing for both object and string types
    slug: string;
    price: number;
    category: string;
    selectedSize:string;
    quantity: number;
    discountPercentage: number;
    discount?: (price: number, discount: number) => number; // This is optional and can be a function to apply discount
  };