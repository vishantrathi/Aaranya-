import api from '../api/axios';

export interface LiveProduct {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  mrp: number;
  unit: string;
  description: string;
  tags: string[];
  quantityOptions: number[];
  stock: number;
  isFeaturedMango: boolean;
  isOrganic: boolean;
  isInSeason: boolean;
}

export const mapApiProduct = (item: any): LiveProduct => ({
  id: item._id,
  name: item.name,
  category: item.category,
  image: item.image,
  price: Number(item.price) || 0,
  mrp: Math.round((Number(item.price) || 0) * 1.18),
  unit: item.unit || 'kg',
  description: item.description || 'Fresh farm product',
  tags: Array.isArray(item.tags) ? item.tags : [],
  quantityOptions: [1, 2, 5],
  stock: Number(item.stock) || 0,
  isFeaturedMango: Boolean(item.isFeaturedMango),
  isOrganic: Boolean(item.isOrganic),
  isInSeason: Boolean(item.isInSeason),
});

export const fetchLiveProducts = async (): Promise<LiveProduct[]> => {
  const { data } = await api.get('/products');
  return (Array.isArray(data) ? data : []).map(mapApiProduct);
};
