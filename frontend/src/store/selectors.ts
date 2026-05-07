import { CartItem } from "./cartStore";

export const getCartCount = (items: CartItem[]) => items.reduce((sum, item) => sum + item.qty, 0);
export const getCartSubtotal = (items: CartItem[]) => items.reduce((sum, item) => sum + item.qty * item.price, 0);
