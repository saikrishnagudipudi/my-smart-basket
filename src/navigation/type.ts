export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrls: string[];
  barcode: string;
  qty?: number;
  brand?: string
}

export interface RootStackParamList {
  ProductDetails: { product: Product };
  Cart: undefined;
  Scanner: undefined;
  Products: undefined;
  Login: undefined;
  [key: string]: object | undefined;
}
