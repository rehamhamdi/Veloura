import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { removeFromWishlist, addToCart } from '../../features/cart/cartSlice';

export default function Wishlist() {
  const wishlistItems = useAppSelector((state) => state.cart.wishlistItems);
  const dispatch = useAppDispatch();

  if (wishlistItems.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6">
        <h2 className="mb-4 text-2xl font-['Playfair_Display'] font-semibold text-[#79504b]">Your Wishlist is empty</h2>
        <p className="mb-8 text-[#735d58]">Save items you love to your wishlist.</p>
        <Link to="/products" className="rounded-lg bg-[#79504b] px-8 py-3 text-white transition hover:bg-[#624943]">
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1320px] px-6 py-10 lg:px-10">
      <h1 className="mb-8 text-3xl font-semibold font-['Playfair_Display'] text-[#79504b]">My Wishlist</h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {wishlistItems.map((item) => (
          <div key={item.id} className="flex flex-col rounded-xl border border-[#eadcd2] bg-white p-4 shadow-sm">
            <div className="mb-4 h-48 w-full rounded-md bg-[#f8f3ed] grid place-items-center text-[10px] text-[#b5a09a]">Product Image</div>
            <h2 className="text-lg font-medium text-[#422f2c]">{item.name}</h2>
            <p className="mt-auto font-bold text-[#a86f6b] mb-4">${item.price}</p>
            
            <div className="flex gap-2">
              <button 
                onClick={() => dispatch(addToCart(item))}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#79504b] py-2 text-white transition hover:bg-[#624943] text-sm"
              >
                <ShoppingBag size={16} /> Add to Cart
              </button>
              <button 
                onClick={() => dispatch(removeFromWishlist(item.id as number))}
                className="p-2 rounded-lg border border-[#eadcd2] text-[#a86f6b] hover:bg-red-50 transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}