import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, Package, CheckCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/bookstoreService';
import Navbar from '../../components/layout/Navbar';
import toast from 'react-hot-toast';

const STEPS = ['Shipping', 'Payment', 'Confirm'];

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [form, setForm] = useState({
    shippingAddress: user?.address || '', shippingCity: '', shippingState: '', shippingZip: '',
    paymentMethod: 'CARD', notes: ''
  });

  const tax = cartTotal * 0.08;
  const shipping = cartTotal > 50 ? 0 : 4.99;
  const total = cartTotal + tax + shipping;

  const handleOrder = async () => {
    setLoading(true);
    try {
      const res = await orderService.placeOrder({
        items: cart.map(item => ({ bookId: item.book.id, quantity: item.quantity })),
        ...form
      });
      setOrderId(res.data.orderNumber);
      clearCart();
      setStep(3);
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <Navbar />
      <div className="card p-10 text-center max-w-md w-full mx-4 mt-16">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Confirmed!</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">Your order <strong className="text-primary-600">#{orderId}</strong> has been placed.</p>
        <div className="space-y-3">
          <button onClick={() => navigate('/orders')} className="btn-primary w-full py-3">Track My Order</button>
          <button onClick={() => navigate('/dashboard')} className="btn-secondary w-full py-3">Continue Shopping</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

        {/* Step indicator */}
        <div className="flex items-center gap-4 mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 ${i <= step ? 'text-primary-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors
                  ${i < step ? 'bg-primary-600 border-primary-600 text-white' : i === step ? 'border-primary-600 text-primary-600' : 'border-gray-300 text-gray-400'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className="text-sm font-medium hidden sm:block">{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${i < step ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Step 0: Shipping */}
            {step === 0 && (
              <div className="card p-6 space-y-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><MapPin className="w-5 h-5 text-primary-600" /> Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Street Address</label>
                    <input className="input-field" placeholder="123 Main Street" value={form.shippingAddress}
                      onChange={e => setForm({ ...form, shippingAddress: e.target.value })} />
                  </div>
                  {[['City', 'shippingCity', 'New York'], ['State', 'shippingState', 'NY'], ['ZIP Code', 'shippingZip', '10001']].map(([label, key, placeholder]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                      <input className="input-field" placeholder={placeholder} value={form[key]}
                        onChange={e => setForm({ ...form, [key]: e.target.value })} />
                    </div>
                  ))}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Order Notes (optional)</label>
                    <textarea className="input-field resize-none" rows={2} placeholder="Any special instructions..."
                      value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                  </div>
                </div>
                <button onClick={() => setStep(1)} className="btn-primary w-full py-3">Continue to Payment →</button>
              </div>
            )}

            {/* Step 1: Payment */}
            {step === 1 && (
              <div className="card p-6 space-y-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary-600" /> Payment Method</h2>
                <div className="space-y-3">
                  {[['CARD', '💳', 'Credit / Debit Card'], ['COD', '💵', 'Cash on Delivery'], ['UPI', '📱', 'UPI Payment']].map(([val, emoji, label]) => (
                    <button key={val} onClick={() => setForm({ ...form, paymentMethod: val })}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-colors
                        ${form.paymentMethod === val ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'}`}>
                      <span className="text-2xl">{emoji}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{label}</span>
                      <div className={`ml-auto w-5 h-5 rounded-full border-2 ${form.paymentMethod === val ? 'border-primary-600 bg-primary-600' : 'border-gray-300'}`}>
                        {form.paymentMethod === val && <div className="w-full h-full rounded-full bg-white scale-50 transform" />}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(0)} className="btn-secondary flex-1 py-3">← Back</button>
                  <button onClick={() => setStep(2)} className="btn-primary flex-1 py-3">Review Order →</button>
                </div>
              </div>
            )}

            {/* Step 2: Confirm */}
            {step === 2 && (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-5"><Package className="w-5 h-5 text-primary-600" /> Order Review</h2>
                <div className="space-y-3 mb-5">
                  {cart.map(({ book, quantity }) => (
                    <div key={book.id} className="flex items-center gap-3">
                      <img src={book.imageUrl || `https://placehold.co/50x65`} alt={book.title}
                        onError={e => { e.target.src = `https://placehold.co/50x65`; }}
                        className="w-12 h-16 object-cover rounded-lg" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{book.title}</p>
                        <p className="text-xs text-gray-500">Qty: {quantity}</p>
                      </div>
                      <span className="font-semibold">${(parseFloat(book.price) * quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="text-sm space-y-1.5 pt-4 border-t border-gray-100 dark:border-gray-700 mb-5">
                  <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>Ship to:</span><span>{form.shippingCity}, {form.shippingState}</span></div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-300"><span>Payment:</span><span>{form.paymentMethod}</span></div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="btn-secondary flex-1 py-3">← Back</button>
                  <button onClick={handleOrder} disabled={loading} className="btn-primary flex-1 py-3">
                    {loading ? 'Placing Order...' : '🎉 Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="card p-6 h-fit sticky top-24">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm mb-4">
              {[['Subtotal', `$${cartTotal.toFixed(2)}`], ['Tax (8%)', `$${tax.toFixed(2)}`], ['Shipping', shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`]].map(([l, v]) => (
                <div key={l} className="flex justify-between text-gray-600 dark:text-gray-300"><span>{l}</span><span>{v}</span></div>
              ))}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between font-bold text-base text-gray-900 dark:text-white">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
