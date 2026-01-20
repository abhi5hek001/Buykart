import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetOrderByIdQuery } from '../../api/apiSlice';
import { formatPrice } from '../../utils/formatters';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const OrderConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetOrderByIdQuery(id);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showCelebration, setShowCelebration] = useState(true);

  const order = data?.data;
  
  // Calculate supercoins earned (1 coin per 100 spent)
  const supercoinsEarned = order ? Math.floor(Number(order.totalAmount) / 100) : 0;
  
  // Hide celebration after 4 seconds
  useEffect(() => {
    if (showCelebration && order) {
      const timer = setTimeout(() => setShowCelebration(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showCelebration, order]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-sm shadow-sm p-8 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Order not found</h2>
          <p className="text-gray-500 mb-4">We couldn't find the order you're looking for.</p>
          <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  const getStatusSteps = () => {
    const steps = [
      { id: 'confirmed', label: 'Order Confirmed', icon: '✓' },
      { id: 'shipped', label: 'Shipped', icon: '📦' },
      { id: 'delivered', label: 'Delivered', icon: '🏠' },
    ];

    const statusOrder = ['pending', 'confirmed', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(order.status);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex - 1,
      current: statusOrder[index + 1] === order.status,
    }));
  };

  const statusSteps = getStatusSteps();

  // Calculate prices for display
  const subtotal = order.items?.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity), 0) || 0;
  const listingPrice = Math.round(subtotal * 1.2);
  const discount = listingPrice - subtotal;

  return (
    <div className="bg-gray-100 min-h-screen relative overflow-hidden">
      {/* SuperCoin Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCelebration(false)}
          >
            {/* Confetti particles */}
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  x: 0, 
                  y: 0, 
                  scale: 0,
                  rotate: 0
                }}
                animate={{ 
                  x: (Math.random() - 0.5) * 400,
                  y: (Math.random() - 0.5) * 400,
                  scale: [0, 1, 0.5],
                  rotate: Math.random() * 720 - 360
                }}
                transition={{ 
                  duration: 2,
                  delay: Math.random() * 0.5,
                  ease: "easeOut"
                }}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'][i % 6]
                }}
              />
            ))}
            
            {/* Main celebration card */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-2xl p-1 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-xl p-8 text-center min-w-[320px]">
                {/* Coin animation */}
                <motion.div
                  animate={{ 
                    rotateY: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    rotateY: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1, repeat: Infinity }
                  }}
                  className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full flex items-center justify-center shadow-lg"
                >
                  <span className="text-3xl font-bold text-yellow-800">S</span>
                </motion.div>
                
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-gray-800 mb-2"
                >
                  🎉 Order Placed!
                </motion.h2>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mb-4"
                >
                  <p className="text-gray-600 text-sm mb-2">You earned</p>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                      {supercoinsEarned}
                    </span>
                    <span className="text-lg font-semibold text-yellow-600">SuperCoins</span>
                  </div>
                </motion.div>
                
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-sm text-gray-500"
                >
                  Use them for exclusive rewards!
                </motion.p>
                
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  onClick={() => setShowCelebration(false)}
                  className="mt-6 px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-full hover:from-yellow-500 hover:to-orange-600 transition-all shadow-md"
                >
                  View Order
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <nav className="text-sm mb-4">
          <Link to="/" className="text-gray-500 hover:text-[#2874f0]">Home</Link>
          <span className="mx-2 text-gray-400">›</span>
          <Link to="/dashboard?tab=account" className="text-gray-500 hover:text-[#2874f0]">My Account</Link>
          <span className="mx-2 text-gray-400">›</span>
          <Link to="/dashboard?tab=orders" className="text-gray-500 hover:text-[#2874f0]">My Orders</Link>
          <span className="mx-2 text-gray-400">›</span>
          <span className="text-gray-800">OD{order.id.toString().padStart(12, '0')}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Main Content */}
          <div className="flex-1 space-y-4">
            {/* Product Details */}
            {order.items?.map((item, idx) => (
              <div key={idx} className="bg-white rounded-sm shadow-sm">
                <div className="p-4 flex gap-4">
                  {/* Product Image */}
                  <Link to={`/products/${item.productId}`} className="shrink-0">
                    <img
                      src={item.product?.imageUrl || 'https://via.placeholder.com/100x100'}
                      alt={item.product?.name}
                      className="w-24 h-24 object-contain"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1">
                    <Link 
                      to={`/products/${item.productId}`}
                      className="text-gray-800 hover:text-[#2874f0] font-medium"
                    >
                      {item.product?.name || `Product #${item.productId}`}
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">Seller: BuyKart</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-semibold">{formatPrice(item.priceAtPurchase)}</span>
                      <span className="text-sm text-gray-400 line-through">{formatPrice(Math.round(item.priceAtPurchase * 1.2))}</span>
                      <span className="text-xs text-green-600 font-medium">17% off</span>
                    </div>
                  </div>
                </div>

                {/* Order Timeline */}
                <div className="px-4 py-6 border-t border-gray-100">
                  <div className="flex items-start">
                    <div className="flex flex-col items-center">
                      {statusSteps.map((step, index) => (
                        <div key={step.id} className="flex flex-col items-center">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                            step.completed || step.current
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-400'
                          }`}>
                            {step.completed || step.current ? '✓' : ''}
                          </div>
                          {index < statusSteps.length - 1 && (
                            <div className={`w-0.5 h-12 ${
                              step.completed ? 'bg-green-500' : 'bg-gray-200'
                            }`}></div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="ml-4 flex-1">
                      {statusSteps.map((step, index) => (
                        <div key={step.id} className={`${index < statusSteps.length - 1 ? 'pb-8' : ''}`}>
                          <p className={`font-medium text-sm ${
                            step.completed || step.current ? 'text-gray-800' : 'text-gray-400'
                          }`}>
                            {step.label}
                            {step.current && (
                              <span className="ml-2 text-xs text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>  
                </div>

                {/* See All Updates Link */}
                <div className="px-4 pb-4">
                  <button className="text-[#2874f0] text-sm font-medium hover:underline flex items-center gap-1">
                    See All Updates
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Chat with us */}
                <div className="px-4 py-3 border-t border-gray-100 text-center">
                  <button className="inline-flex items-center gap-2 text-gray-600 hover:text-[#2874f0] text-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Chat with us
                  </button>
                </div>
              </div>
            ))}

            {/* Rate your experience */}
            <div className="bg-white rounded-sm shadow-sm p-4">
              <h3 className="font-medium text-gray-800 mb-4">Rate your experience</h3>
              <div className="flex items-center gap-2 mb-3">
                <input type="checkbox" id="rateProduct" className="w-4 h-4 text-[#2874f0]" />
                <label htmlFor="rateProduct" className="text-sm text-gray-600">Rate the product</label>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setUserRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-3xl transition-colors"
                  >
                    <span className={`${
                      star <= (hoverRating || userRating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}>
                      ★
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Order ID */}
            <div className="bg-white rounded-sm shadow-sm p-4">
              <p className="text-sm text-gray-500">
                Order #{' '}
                <span className="text-gray-800 font-medium">OD{order.id.toString().padStart(12, '0')}</span>
                <button className="ml-2 text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </p>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="lg:w-80 shrink-0 space-y-4">
            {/* Delivery Details */}
            <div className="bg-white rounded-sm shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-medium text-gray-800">Delivery details</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-xs text-gray-500">Home</p>
                    <p className="text-sm text-gray-800">{order.shippingAddress || 'Boys Hostel 2 IIT Sri City, Indian Institute of Information...'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="text-sm text-gray-800">Abhishek Sahay <span className="text-gray-500">9896786599</span></p>
                </div>
              </div>
            </div>

            {/* Price Details */}
            <div className="bg-white rounded-sm shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-medium text-gray-800">Price details</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Listing price</span>
                  <span className="text-gray-400 line-through">{formatPrice(listingPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Special price <span className="text-gray-400 text-xs">ⓘ</span></span>
                  <span className="text-gray-800">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm cursor-pointer hover:bg-gray-50 -mx-4 px-4 py-1">
                  <span className="text-gray-600">Total fees <span className="text-gray-400">▼</span></span>
                  <span className="text-gray-800">{formatPrice(4)}</span>
                </div>
                <div className="flex justify-between text-sm cursor-pointer hover:bg-gray-50 -mx-4 px-4 py-1">
                  <span className="text-gray-600">Other discount <span className="text-gray-400">▼</span></span>
                  <span className="text-green-600">-{formatPrice(Math.min(discount, 95))}</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-800 pt-2 border-t border-gray-100">
                  <span>Total amount</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm pt-2">
                  <span className="text-gray-600">Payment method</span>
                  <span className="text-gray-800">UPI, SuperCoins</span>
                </div>
              </div>

              {/* Download Invoice */}
              <div className="p-4 border-t border-gray-100">
                <button className="w-full py-2.5 border border-[#2874f0] rounded-sm text-[#2874f0] font-medium text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Invoice
                </button>
              </div>
            </div>

            {/* Offers Earned */}
            <div className="bg-white rounded-sm shadow-sm">
              <button className="w-full p-4 flex items-center justify-between text-left">
                <div className="flex items-center gap-2">
                  <span className="text-pink-500">♥</span>
                  <span className="text-sm text-gray-800">Offers earned</span>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
