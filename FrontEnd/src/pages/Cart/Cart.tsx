import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { removeFromCart, updateQuantity } from '../../features/cart/cartSlice';

export default function Cart() {
  const cartItems = useAppSelector((state) => state.cart.cartItems);
  const dispatch = useAppDispatch();

  // حساب الإجمالي
  const subtotal = cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  const shipping = subtotal > 0 ? 50 : 0; // مصاريف شحن افتراضية
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6">
        <h2 className="mb-4 text-2xl font-['Playfair_Display'] font-semibold text-[#79504b]">Your cart is empty</h2>
        <p className="mb-8 text-[#735d58]">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/products" className="rounded-lg bg-[#79504b] px-8 py-3 text-white transition hover:bg-[#624943]">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1320px] px-6 py-10 lg:px-10">
      <h1 className="mb-8 text-3xl font-semibold font-['Playfair_Display'] text-[#79504b]">Shopping Cart</h1>
      
      <div className="grid gap-10 lg:grid-cols-3">
        {/* تفاصيل المنتجات */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-xl border border-[#eadcd2] bg-white p-4 shadow-sm sm:gap-6">
              <div className="h-24 w-24 shrink-0 rounded-md bg-[#f8f3ed] grid place-items-center text-[10px] text-[#b5a09a]">Product Image</div>
              
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between">
                  <h3 className="font-medium text-[#422f2c]">{item.name}</h3>
                  <p className="font-bold text-[#a86f6b]">${item.price * (item.quantity || 1)}</p>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 rounded-lg border border-[#eadcd2] px-3 py-1">
                    <button onClick={() => dispatch(updateQuantity({ id: item.id as number, amount: -1 }))} className="text-[#735d58] hover:text-[#422f2c]">
                      <Minus size={16} />
                    </button>
                    <span className="w-4 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => dispatch(updateQuantity({ id: item.id as number, amount: 1 }))} className="text-[#735d58] hover:text-[#422f2c]">
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <button onClick={() => dispatch(removeFromCart(item.id as number))} className="text-[#a86f6b] hover:text-red-700 transition flex items-center gap-1 text-sm">
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ملخص الدفع (Order Summary) */}
        <div className="rounded-xl border border-[#eadcd2] bg-white p-6 shadow-sm h-fit">
          <h2 className="mb-6 text-xl font-semibold font-['Playfair_Display'] text-[#422f2c]">Order Summary</h2>
          
          <div className="space-y-4 text-sm text-[#735d58]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-[#422f2c]">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-medium text-[#422f2c]">${shipping.toFixed(2)}</span>
            </div>
            <div className="border-t border-[#eadcd2] pt-4 flex justify-between text-base font-bold text-[#422f2c]">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          
          <button className="mt-8 w-full rounded-lg bg-[#79504b] py-3 text-white transition hover:bg-[#624943] font-medium tracking-wide">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}