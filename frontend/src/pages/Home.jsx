"use client"

import { Link } from "react-router-dom"
import { useGetProductsQuery } from "../api/apiSlice"
import BannerCarousel from "../components/carousel/BannerCarousel"
import CategoryNav from "../components/carousel/CategoryNav"
import PageTransition from "../components/common/PageTransition"
import { formatPrice } from "../utils/formatters"

// Product Card Component - Clean Flipkart Style
const ProductCard = ({ product }) => {
  const { id, name, price, imageUrl } = product
  const originalPrice = Math.round(Number(price) * 1.2)
  const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100)

  return (
    <Link to={`/products/${id}`} className="block group">
      <div className="bg-white p-3 rounded-sm hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="aspect-square mb-2 flex items-center justify-center">
          <img
            src={imageUrl || "https://via.placeholder.com/200"}
            alt={name}
            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
          />
        </div>
        <h3 className="text-sm text-gray-800 line-clamp-2 mb-1 flex-1">{name}</h3>
        <div className="flex items-center gap-1 mb-1">
          <span className="bg-green-600 text-white text-[10px] px-1 py-0.5 rounded flex items-center">
            4.2 ★
          </span>
          <span className="text-[10px] text-gray-400">(1,234)</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-gray-900">{formatPrice(price)}</span>
          <span className="text-xs text-gray-400 line-through">{formatPrice(originalPrice)}</span>
          <span className="text-xs text-green-600">{discountPercent}% off</span>
        </div>
      </div>
    </Link>
  )
}

// Small Product Card for 2-column grid sections
const SmallProductCard = ({ product }) => {
  const { id, name, price, imageUrl } = product
  const discountPercent = Math.floor(Math.random() * 30) + 20

  return (
    <Link to={`/products/${id}`} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
      <img
        src={imageUrl || "https://via.placeholder.com/80"}
        alt={name}
        className="w-16 h-16 object-contain shrink-0"
      />
      <div className="min-w-0">
        <h4 className="text-sm text-gray-800 line-clamp-1">{name}</h4>
        <p className="text-xs text-green-600 font-medium">Up to {discountPercent}% Off</p>
      </div>
    </Link>
  )
}

// Section Header Component
const SectionHeader = ({ title, viewAllLink }) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-100">
    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    {viewAllLink && (
      <Link
        to={viewAllLink}
        className="bg-[#2874f0] text-white text-sm px-4 py-1.5 rounded-sm hover:bg-[#1a5dc9] transition-colors"
      >
        VIEW ALL
      </Link>
    )}
  </div>
)

// Product Row Section (6 products in a row)
const ProductRowSection = ({ title, products, viewAllLink, bgColor = "bg-white" }) => {
  if (!products || products.length === 0) return null

  return (
    <section className={`${bgColor} rounded-sm shadow-sm overflow-hidden`}>
      <SectionHeader title={title} viewAllLink={viewAllLink} />
      <div className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

// Two Column Section (Top Offers / Best of Electronics style)
const TwoColumnSection = ({ leftTitle, rightTitle, leftProducts, rightProducts, leftLink, rightLink }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Left Column */}
      <section className="bg-white rounded-sm shadow-sm overflow-hidden">
        <SectionHeader title={leftTitle} viewAllLink={leftLink} />
        <div className="p-4 grid grid-cols-2 gap-2">
          {leftProducts?.slice(0, 4).map((product) => (
            <SmallProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Right Column */}
      <section className="bg-white rounded-sm shadow-sm overflow-hidden">
        <SectionHeader title={rightTitle} viewAllLink={rightLink} />
        <div className="p-4 grid grid-cols-2 gap-2">
          {rightProducts?.slice(0, 4).map((product) => (
            <SmallProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}

// Promotional Banner Component
const PromoBanner = ({ 
  title, 
  subtitle, 
  buttonText, 
  buttonLink, 
  bgColor = "bg-gradient-to-r from-orange-500 to-red-500",
  image
}) => (
  <section className={`${bgColor} rounded-sm shadow-sm overflow-hidden`}>
    <div className="flex items-center justify-between p-6">
      <div className="text-white">
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <p className="text-sm opacity-90 mb-3">{subtitle}</p>
        <Link
          to={buttonLink}
          className="inline-block bg-white text-gray-800 text-sm font-medium px-4 py-2 rounded-sm hover:bg-gray-100 transition-colors"
        >
          {buttonText}
        </Link>
      </div>
      {image && (
        <img src={image} alt={title} className="w-32 h-24 object-contain hidden sm:block" />
      )}
    </div>
  </section>
)

const Home = () => {
  // Fetch products by category
  const { data: allProducts } = useGetProductsQuery({})
  const { data: watchProducts } = useGetProductsQuery({ category: "34" }) // Mens Watches
  const { data: electronicsProducts } = useGetProductsQuery({ category: "31" }) // Laptops
  const { data: smartphoneProducts } = useGetProductsQuery({ category: "38" }) // Smartphones
  const { data: fashionProducts } = useGetProductsQuery({ category: "32" }) // Mens Shirts
  const { data: womenFashionProducts } = useGetProductsQuery({ category: "45" }) // Womens Dresses
  const { data: kitchenProducts } = useGetProductsQuery({ category: "30" }) // Kitchen
  const { data: beautyProducts } = useGetProductsQuery({ category: "25" }) // Beauty
  const { data: fragranceProducts } = useGetProductsQuery({ category: "26" }) // Fragrances
  const { data: groceryProducts } = useGetProductsQuery({ category: "28" }) // Groceries
  const { data: shoesProducts } = useGetProductsQuery({ category: "33" }) // Mens Shoes

  // Combine and filter products for different sections
  const watches = watchProducts?.data || []
  const electronics = electronicsProducts?.data || []
  const smartphones = smartphoneProducts?.data || []
  const fashion = [...(fashionProducts?.data || []), ...(womenFashionProducts?.data || [])]
  const kitchen = kitchenProducts?.data || []
  const beauty = [...(beautyProducts?.data || []), ...(fragranceProducts?.data || [])]
  const groceries = groceryProducts?.data || []
  const shoes = shoesProducts?.data || []
  
  // Gadgets = Electronics + Smartphones
  const gadgets = [...electronics, ...smartphones].slice(0, 6)
  
  // Top Offers = Watches + Fashion shoes
  const topOffers = [...watches, ...shoes].slice(0, 4)

  return (
    <PageTransition>
      {/* Category Navigation */}
      <CategoryNav />

      {/* Banner Carousel */}
      <BannerCarousel />

      {/* Main Content */}
      <div className="max-w-[1248px] mx-auto px-2 sm:px-4 py-4 space-y-4">
        
        {/* Two Column: Top Offers & Best of Electronics */}
        <TwoColumnSection
          leftTitle="Top Offers"
          rightTitle="Best of Electronics"
          leftProducts={topOffers}
          rightProducts={electronics}
          leftLink="/products"
          rightLink="/products?category=31"
        />

        {/* Big Savings on Gadgets */}
        <ProductRowSection
          title="Big Savings on Gadgets"
          products={gadgets}
          viewAllLink="/products?category=38"
        />

        {/* Promo Banner - Flash Sale */}
        <PromoBanner
          title="⚡ Flash Sale Live Now!"
          subtitle="Up to 70% off on Fashion, Electronics & More"
          buttonText="Shop Now"
          buttonLink="/products"
          bgColor="bg-gradient-to-r from-orange-500 to-red-500"
        />

        {/* Fashion Trends */}
        <ProductRowSection
          title="Fashion Trends"
          products={fashion.slice(0, 6)}
          viewAllLink="/products?category=32"
        />

        {/* Kitchen Essentials */}
        <ProductRowSection
          title="Kitchen Essentials"
          products={kitchen}
          viewAllLink="/products?category=30"
        />

        {/* Best of Decorations - Beauty & Fragrances */}
        <ProductRowSection
          title="Best of Beauty & Fragrances"
          products={beauty.slice(0, 6)}
          viewAllLink="/products?category=25"
        />

        {/* Promo Banner - Premium Membership */}
        <PromoBanner
          title="BuyKart Plus Members"
          subtitle="Get extra 10% off, Free Delivery & Early Access to Sales"
          buttonText="Join Now"
          buttonLink="/dashboard"
          bgColor="bg-gradient-to-r from-blue-600 to-blue-800"
        />

        {/* Groceries */}
        <ProductRowSection
          title="Daily Essentials & Groceries"
          products={groceries}
          viewAllLink="/products?category=28"
        />

        {/* Brand Partners Section */}
        <section className="bg-white rounded-sm shadow-sm p-6">
          <h3 className="text-center text-gray-500 text-sm mb-4">Our Brand Partners</h3>
          <div className="flex items-center justify-center gap-8 flex-wrap opacity-60">
            <img src="amazon-logo.png" alt="Amazon" className="h-6 grayscale hover:grayscale-0 transition" />
            <img src="samsung-logo.png" alt="Samsung" className="h-6 grayscale hover:grayscale-0 transition" />
            <img src="apple-logo.png" alt="Apple" className="h-6 grayscale hover:grayscale-0 transition" />
            <img src="google-logo.png" alt="Google" className="h-6 grayscale hover:grayscale-0 transition" />
            <img src="netflix-logo.png" alt="Netflix" className="h-5 grayscale hover:grayscale-0 transition" />
          </div>
        </section>

      </div>
    </PageTransition>
  )
}

export default Home
