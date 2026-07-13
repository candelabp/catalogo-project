export type ProductOption = {
  name: string;
  values: string[];
};

export type Product = {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  options?: ProductOption[];
};

export type CartItem = Product & {
  quantity: number;
};
