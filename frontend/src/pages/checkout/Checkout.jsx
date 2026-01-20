import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCartItems, selectCartSubtotal, clearCart } from '../../features/cart/cartSlice';
import { selectCurrentUser } from '../../features/user/userSlice';
import { useCreateOrderMutation } from '../../api/apiSlice';
import { formatPrice } from '../../utils/formatters';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const currentUser = useSelector(selectCurrentUser);
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
  });

  const [errors, setErrors] = useState({});

  const deliveryCharge = subtotal > 500 ? 0 : 40;
  const total = subtotal + deliveryCharge;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Enter valid 10-digit phone number';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter valid email';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Enter valid 6-digit pincode';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Check if user is selected
    if (!currentUser?.id) {
      alert('Please select a user from the header dropdown before placing an order.');
      return;
    }

    const shippingAddress = `${formData.name}, ${formData.address}, ${formData.city} - ${formData.pincode}, Phone: ${formData.phone}`;

    try {
      const orderData = {
        user_id: currentUser.id, // Use selected user from Redux
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
        shipping_address: shippingAddress,
      };

      const result = await createOrder(orderData).unwrap();
      
      // Clear cart on success
      dispatch(clearCart());
      
      // Navigate to confirmation
      navigate(`/order-confirmation/${result.data.id}`);
    } catch (error) {
      console.error('Order failed:', error);
      alert(error?.data?.error || 'Failed to place order. Please try again.');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-sm shadow-sm p-8 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-medium text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some products to checkout.</p>
          <Button onClick={() => navigate('/products')}>Browse Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Checkout Form */}
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            {/* Delivery Address */}
            <div className="bg-white rounded-sm shadow-sm mb-4">
              <div className="p-4 bg-[#2874f0] rounded-t-sm">
                <h2 className="text-white font-medium flex items-center gap-2">
                  <span className="w-6 h-6 bg-white text-[#2874f0] rounded-sm flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  Delivery Address
                </h2>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  error={errors.name}
                  required
                />

                <Input
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  error={errors.phone}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  error={errors.email}
                  required
                />

                <Input
                  label="Pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="6-digit pincode"
                  error={errors.pincode}
                  required
                />

                <div className="md:col-span-2">
                  <Input
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House No., Building, Street, Area"
                    error={errors.address}
                    required
                  />
                </div>

                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  error={errors.city}
                  required
                />
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="bg-white rounded-sm shadow-sm mb-4">
              <div className="p-4 bg-[#2874f0] rounded-t-sm">
                <h2 className="text-white font-medium flex items-center gap-2">
                  <span className="w-6 h-6 bg-white text-[#2874f0] rounded-sm flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  Order Summary
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-4 flex gap-4">
                    <img
                      src={item.imageUrl || 'https://via.placeholder.com/80x80'}
                      alt={item.name}
                      className="w-16 h-16 object-contain"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Place Order - Mobile */}
            <div className="lg:hidden">
              <Button type="submit" fullWidth size="lg" loading={isLoading}>
                Place Order • {formatPrice(total)}
              </Button>
            </div>
          </form>
        </div>

        {/* Price Summary */}
        <div className="lg:w-96 shrink-0">
          <div className="bg-white rounded-sm shadow-sm sticky top-20">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-gray-500 font-medium uppercase text-sm">Price Details</h2>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Price ({cartItems.length} items)</span>
                <span className="text-gray-900">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Charges</span>
                {deliveryCharge === 0 ? (
                  <span className="text-green-600">FREE</span>
                ) : (
                  <span className="text-gray-900">{formatPrice(deliveryCharge)}</span>
                )}
              </div>

              <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between font-semibold text-lg">
                <span>Total Amount</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Place Order - Desktop */}
            <div className="p-4 border-t border-gray-100 hidden lg:block">
              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={isLoading}
                onClick={handleSubmit}
              >
                Place Order
              </Button>
            </div>

            <div className="p-4 pt-0">
              <p className="text-xs text-gray-500 flex items-start gap-2">
                <svg className="w-4 h-4 shrink-0 text-gray-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Safe and Secure Payments. Easy returns. 100% Authentic products.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
