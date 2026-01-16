import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { selectWishlistItems, removeFromWishlist } from '../../features/wishlist/wishlistSlice';
import { addToCart } from '../../features/cart/cartSlice';
import { useGetUsersQuery, useGetOrdersByUserQuery } from '../../api/apiSlice';
import { formatPrice } from '../../utils/formatters';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabFromUrl || 'orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    if (tabFromUrl && ['orders', 'wishlist', 'account'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);

  const { data: usersData, isLoading: usersLoading } = useGetUsersQuery();
  const users = usersData?.data || [];
  const user = users[0] || null;

  const { data: ordersData, isLoading: ordersLoading } = useGetOrdersByUserQuery(user?.id, {
    skip: !user?.id,
  });
  const orders = ordersData?.data || [];

  // Filter orders based on search and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchQuery === '' || 
      order.items?.some(item => 
        item.product?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    let matchesTime = true;
    if (timeFilter !== 'all') {
      const orderDate = new Date(order.createdAt);
      const now = new Date();
      if (timeFilter === '30days') {
        matchesTime = (now - orderDate) / (1000 * 60 * 60 * 24) <= 30;
      } else if (timeFilter === '2025') {
        matchesTime = orderDate.getFullYear() === 2025;
      } else if (timeFilter === '2024') {
        matchesTime = orderDate.getFullYear() === 2024;
      }
    }
    return matchesSearch && matchesStatus && matchesTime;
  });

  const handleMoveToCart = (item) => {
    dispatch(addToCart({ ...item, quantity: 1 }));
    dispatch(removeFromWishlist(item.id));
  };

  const handleRemoveFromWishlist = (id) => {
    dispatch(removeFromWishlist(id));
  };

  const tabs = [
    { id: 'orders', label: 'My Orders', url: 'my-orders.png' },
    { id: 'wishlist', label: 'Wishlist', url: 'wishlist.png' },
    { id: 'account', label: 'Account', url: 'my-account.png' },
  ];

  const getStatusInfo = (status) => {
    switch (status) {
      case 'delivered': return { color: 'text-green-600', bg: 'bg-green-500', text: 'Delivered' };
      case 'shipped': return { color: 'text-blue-600', bg: 'bg-blue-500', text: 'Shipped' };
      case 'confirmed': return { color: 'text-purple-600', bg: 'bg-purple-500', text: 'Confirmed' };
      case 'pending': return { color: 'text-yellow-600', bg: 'bg-yellow-500', text: 'Pending' };
      case 'cancelled': return { color: 'text-red-600', bg: 'bg-red-500', text: 'Cancelled' };
      default: return { color: 'text-gray-600', bg: 'bg-gray-500', text: status };
    }
  };

  if (usersLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-sm shadow-sm p-8 text-center">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-xl font-medium text-gray-800 mb-2">No user found</h2>
          <p className="text-gray-500 mb-4">Please run the seed script to create users.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <nav className="text-sm mb-4">
          <Link to="/" className="text-gray-500 hover:text-[#2874f0]">Home</Link>
          <span className="mx-2 text-gray-400">›</span>
          <Link to="/dashboard?tab=account" className="text-gray-500 hover:text-[#2874f0]">My Account</Link>
          <span className="mx-2 text-gray-400">›</span>
          <span className="text-gray-800">{tabs.find(t => t.id === activeTab)?.label}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left Sidebar with Filters */}
          <aside className="lg:w-72 shrink-0 space-y-4">
            {/* User Card */}
            <div className="bg-white rounded-sm shadow-sm overflow-hidden">
              <div className="p-4 flex items-center gap-3 border-b border-gray-100">
                <img 
                  src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/profile-pic-male_4811a1.svg" 
                  alt="Profile" 
                  className="w-12 h-12"
                />
                <div>
                  <p className="text-xs text-gray-500">Hello,</p>
                  <p className="font-semibold text-gray-800">{user.name}</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="py-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-[#2874f0] border-l-4 border-[#2874f0]'
                        : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                  >
                    <img className="w-6 h-6" src={tab.url} alt={tab.label} />
                    <span className="font-medium text-sm">{tab.label}</span>
                    {tab.id === 'wishlist' && wishlistItems.length > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {wishlistItems.length}
                      </span>
                    )}
                    {tab.id === 'orders' && orders.length > 0 && (
                      <span className="ml-auto bg-[#2874f0] text-white text-xs px-2 py-0.5 rounded-full">
                        {orders.length}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Order Filters - Only show on orders tab (Desktop) */}
            {activeTab === 'orders' && (
              <div className="hidden lg:block bg-white rounded-sm shadow-sm">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Filters</h3>
                </div>

                {/* Order Status */}
                <div className="p-4 border-b border-gray-100">
                  <h4 className="font-medium text-gray-700 text-sm mb-3">ORDER STATUS</h4>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'All' },
                      { value: 'pending', label: 'On the way' },
                      { value: 'delivered', label: 'Delivered' },
                      { value: 'cancelled', label: 'Cancelled' },
                      { value: 'confirmed', label: 'Confirmed' },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          checked={statusFilter === option.value}
                          onChange={() => setStatusFilter(option.value)}
                          className="w-4 h-4 text-[#2874f0] focus:ring-[#2874f0]"
                        />
                        <span className="text-sm text-gray-600">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Order Time */}
                <div className="p-4">
                  <h4 className="font-medium text-gray-700 text-sm mb-3">ORDER TIME</h4>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'Anytime' },
                      { value: '30days', label: 'Last 30 days' },
                      { value: '2025', label: '2025' },
                      { value: '2024', label: '2024' },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="time"
                          checked={timeFilter === option.value}
                          onChange={() => setTimeFilter(option.value)}
                          className="w-4 h-4 text-[#2874f0] focus:ring-[#2874f0]"
                        />
                        <span className="text-sm text-gray-600">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* Mobile Filter Drawer */}
          <AnimatePresence>
            {showMobileFilters && (
              <>
                {/* Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowMobileFilters(false)}
                  className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                />
                {/* Drawer */}
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'tween', duration: 0.3 }}
                  className="fixed left-0 top-0 h-full w-72 bg-white z-50 shadow-xl lg:hidden overflow-y-auto"
                >
                  {/* Header */}
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-[#2874f0] text-white">
                    <h3 className="font-semibold">Filters</h3>
                    <button onClick={() => setShowMobileFilters(false)} className="p-1">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Order Status */}
                  <div className="p-4 border-b border-gray-100">
                    <h4 className="font-medium text-gray-700 text-sm mb-3">ORDER STATUS</h4>
                    <div className="space-y-2">
                      {[
                        { value: 'all', label: 'All' },
                        { value: 'pending', label: 'On the way' },
                        { value: 'delivered', label: 'Delivered' },
                        { value: 'cancelled', label: 'Cancelled' },
                        { value: 'confirmed', label: 'Confirmed' },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="mobile-status"
                            checked={statusFilter === option.value}
                            onChange={() => setStatusFilter(option.value)}
                            className="w-4 h-4 text-[#2874f0] focus:ring-[#2874f0]"
                          />
                          <span className="text-sm text-gray-600">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Order Time */}
                  <div className="p-4 border-b border-gray-100">
                    <h4 className="font-medium text-gray-700 text-sm mb-3">ORDER TIME</h4>
                    <div className="space-y-2">
                      {[
                        { value: 'all', label: 'Anytime' },
                        { value: '30days', label: 'Last 30 days' },
                        { value: '2025', label: '2025' },
                        { value: '2024', label: '2024' },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="mobile-time"
                            checked={timeFilter === option.value}
                            onChange={() => setTimeFilter(option.value)}
                            className="w-4 h-4 text-[#2874f0] focus:ring-[#2874f0]"
                          />
                          <span className="text-sm text-gray-600">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Apply Button */}
                  <div className="p-4">
                    <Button fullWidth onClick={() => setShowMobileFilters(false)}>
                      Apply Filters
                    </Button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <main className="flex-1">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-3">
                {/* Search Bar with Mobile Filter Button */}
                <div className="bg-white rounded-sm shadow-sm p-3">
                  <div className="flex gap-2">
                    {/* Mobile Filter Button */}
                    <button
                      onClick={() => setShowMobileFilters(true)}
                      className="lg:hidden px-3 py-2 border border-gray-200 rounded-sm flex items-center gap-2 text-sm text-gray-600 hover:bg-gray-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                      </svg>
                      Filters
                    </button>
                    <div className="relative flex-1">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search your orders here"
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-[#2874f0] text-sm"
                      />
                    </div>
                  </div>
                </div>

                {ordersLoading ? (
                  <div className="bg-white rounded-sm shadow-sm p-8 flex justify-center">
                    <Spinner />
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <div className="bg-white rounded-sm shadow-sm p-8 text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No orders found</h3>
                    <p className="text-gray-500 mb-4">
                      {orders.length === 0 ? 'Start shopping to see your orders here!' : 'No orders match your filters.'}
                    </p>
                    <Link to="/products">
                      <Button>Browse Products</Button>
                    </Link>
                  </div>
                ) : (
                  /* Orders List - Flipkart Style */
                  <>
                    {filteredOrders.flatMap((order) => {
                      if (!order.items || order.items.length === 0) return [];
                      return order.items.map((item, idx) => {
                        const statusInfo = getStatusInfo(order.status);
                        return (
                          <div key={`${order.id}-${idx}`} className="bg-white rounded-sm shadow-sm hover:shadow-md transition-shadow">
                          <div className="p-4 flex gap-4">
                            {/* Product Image */}
                            <Link to={`/products/${item.productId}`} className="shrink-0">
                              <img
                                src={item.product?.imageUrl || 'https://via.placeholder.com/100x100'}
                                alt={item.product?.name}
                                className="w-20 h-20 object-contain"
                              />
                            </Link>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <Link 
                                to={`/products/${item.productId}`}
                                className="text-sm text-gray-800 hover:text-[#2874f0] line-clamp-1 font-medium"
                              >
                                {item.product?.name || `Product #${item.productId}`}
                              </Link>
                              <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                              <p className="text-sm font-semibold text-gray-900 mt-1">
                                {formatPrice(item.priceAtPurchase)}
                              </p>
                            </div>

                            {/* Status */}
                            <div className="shrink-0 text-right min-w-[140px]">
                              <div className="flex items-center gap-2 justify-end">
                                <span className={`w-2 h-2 rounded-full ${statusInfo.bg}`}></span>
                                <span className={`text-sm font-medium ${statusInfo.color}`}>
                                  {statusInfo.text}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="shrink-0 flex flex-col gap-2 items-center justify-center">
                              <Link to={`/order-confirmation/${order.id}`}>
                                <button className="p-2 text-gray-400 hover:text-[#2874f0] transition-colors" title="View Details">
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>
                              </Link>
                            </div>
                          </div>
                        </div>
                        );
                      });
                    })}
                  </>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-sm shadow-sm">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800">
                    My Wishlist ({wishlistItems.length})
                  </h2>
                </div>

                {wishlistItems.length === 0 ? (
                  <div className="p-8 text-center">
                    <img src="/empty-wishlist.png" alt="Empty Wishlist" className="w-40 h-40 mx-auto mb-4 object-contain" />
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-500 mb-4">Save items you love to buy later!</p>
                    <Link to="/products">
                      <Button>Explore Products</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {wishlistItems.map((item) => (
                      <div key={item.id} className="p-4 flex gap-4">
                        <Link to={`/products/${item.id}`} className="shrink-0">
                          <img
                            src={item.imageUrl || 'https://via.placeholder.com/100x100'}
                            alt={item.name}
                            className="w-20 h-20 object-contain rounded"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/products/${item.id}`}
                            className="text-gray-800 font-medium hover:text-[#2874f0] line-clamp-2"
                          >
                            {item.name}
                          </Link>
                          <p className="text-lg font-semibold text-gray-900 mt-1">
                            {formatPrice(item.price)}
                          </p>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" onClick={() => handleMoveToCart(item)}>
                              Move to Cart
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveFromWishlist(item.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="bg-white rounded-sm shadow-sm">
                <div className="p-4 border-b border-gray-100 flex items-center gap-4">
                  <img 
                    src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/profile-pic-male_4811a1.svg" 
                    alt="Profile" 
                    className="w-14 h-14"
                  />
                  <div>
                    <p className="text-xs text-gray-500">Hello,</p>
                    <h2 className="text-lg font-semibold text-gray-800">{user.name}</h2>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setActiveTab('orders')}
                      className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-sm hover:bg-gray-100 transition-colors flex-1"
                    >
                      <img src="my-orders.png" alt="Orders" className="w-6 h-6" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-800">My Orders</p>
                        <p className="text-xs text-gray-500">{orders.length} orders</p>
                      </div>
                    </button>
                    <button 
                      onClick={() => setActiveTab('wishlist')}
                      className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-sm hover:bg-gray-100 transition-colors flex-1"
                    >
                      <img src="wishlist.png" alt="Wishlist" className="w-6 h-6" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-800">Wishlist</p>
                        <p className="text-xs text-gray-500">{wishlistItems.length} items</p>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm text-gray-500">Full Name</label>
                      <p className="text-gray-900 font-medium mt-1">{user.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Email Address</label>
                      <p className="text-gray-900 font-medium mt-1">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Phone Number</label>
                      <p className="text-gray-900 font-medium mt-1">{user.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Member Since</label>
                      <p className="text-gray-900 font-medium mt-1">
                        {new Date(user.createdAt).toLocaleDateString('en-IN', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">Default Address</label>
                    <p className="text-gray-900 font-medium mt-1">{user.address || 'Not provided'}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <Button variant="outline" size="sm">
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
