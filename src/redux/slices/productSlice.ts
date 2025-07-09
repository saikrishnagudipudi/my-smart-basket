import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrls: string[];
  barcode: string;
  qty: number;
  brand?: string;
}

interface ProductState {
  products: Product[];
}

const initialState: ProductState = {
  products: [],
};

export const fetchProducts = createAsyncThunk<
  Product[],
  { page: number; pageSize?: number }
>('products/fetch', async ({ page, pageSize = 10 }) => {
  const response = await axios.post(
    'https://catalog-management-system-dev-872387259014.us-central1.run.app/cms/v2/filter/product',
    {
      page: page.toString(),
      pageSize: pageSize.toString(),
      supportedStore: ['RLC_83'],
      sort: { creationDateSortOption: 'DESC' },
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }
  );

  const items = response.data?.data?.response || [];
  const dummyImage = 'https://static.wikia.nocookie.net/otonari-no-tenshi/images/c/c9/No_images_available.jpg/revision/latest?cb=20220104141308';
  const defaultPrice = 50;

  return items.map((entry: any) => {
    const p = entry.product;
    const image =
      p.images?.front ||
      p.images?.top ||
      p.images?.back ||
      p.image ||
      dummyImage;
    const price = p.mrp?.mrp ?? defaultPrice;

    return {
      id: Number(p.id),
      name: p.name || 'Unnamed Product',
      description: p.description || '',
      price: Math.round(price),
      originalPrice: Math.round(price * 1.2),
      imageUrls: [image],
      barcode: p.gtin || `RLC${p.id}`,
      qty: 1,
      brand: p.brand || 'Brand',
    };
  });
});

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.products = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
      const existingIds = new Set(state.products.map(p => p.id));
      const newUniqueProducts = action.payload.filter(p => !existingIds.has(p.id));
      state.products.push(...newUniqueProducts);
    });
  },
});

export const { clearProducts } = productSlice.actions;
export default productSlice.reducer;
