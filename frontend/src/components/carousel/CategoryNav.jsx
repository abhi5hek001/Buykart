import { Link } from "react-router-dom"
import { ChevronDown } from "lucide-react"

// Fixed categories matching Flipkart layout exactly
const categories = [
  {
    id: 'minutes',
    name: 'Minutes',
    image: 'category-minutes.webp',
    hasNew: true,
    link: '/products?category=Groceries' // Mapped to Groceries
  },
  {
    id: 'mobiles',
    name: 'Mobiles & Tablets',
    image: 'category-mobiles.webp',
    link: '/products?category=Smartphones' // Mapped to Smartphones
  },
  {
    id: 'fashion',
    name: 'Fashion',
    image: 'category-fashion.webp',
    hasDropdown: true,
    link: '/products?category=Mens Shirts' // Mapped to Mens Shirts
  },
  {
    id: 'electronics',
    name: 'Electronics',
    image: 'category-electronics.webp',
    hasDropdown: true,
    link: '/products?category=Laptops' // Mapped to Laptops
  },
  {
    id: 'jewelry',
    name: 'Jewelry',
    image: 'category-jewelry.webp',
    link: '/products?category=Womens Jewellery' // Mapped to Womens Jewellery
  },
  {
    id: 'home',
    name: 'Home & Furniture',
    image: 'category-home.webp',
    hasDropdown: true,
    link: '/products?category=Furniture' // Mapped to Furniture
  },
  {
    id: 'flights',
    name: 'Flights',
    image: 'category-flight.webp',
    link: '/products'
  },
  {
    id: 'beauty',
    name: 'Beauty, Food..',
    image: 'category-beauty.webp',
    hasDropdown: true,
    link: '/products?category=Beauty' // Mapped to Beauty
  },
  {
    id: 'grocery',
    name: 'Grocery',
    image: 'category-grocery.webp',
    link: '/products?category=Groceries' // Mapped to Groceries
  },
]

const CategoryNav = () => {
  return (
    <nav className="bg-white shadow-md overflow-x-auto no-scrollbar w-full">
      <div className="max-w-[1248px] mx-auto md:min-w-0">
        <div className="flex items-center justify-between md:justify-between px-1 md:px-2">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={category.link}
              className={`flex-col items-center justify-start py-2 md:py-3 px-2 md:px-3 lg:px-6 group cursor-pointer hover:no-underline relative min-w-[64px] md:min-w-[80px] ${index < 4 ? 'flex' : index < 6 ? 'hidden md:flex' : 'hidden lg:flex'}`}
            >

              {/* Category Image */}
              <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-1">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'https://rukminim2.flixcart.com/fk-p-flap/80/80/image/69c6589653afdb9a.png'
                  }}
                />
              </div>

              {/* Category Name with Dropdown */}
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] md:text-[13px] font-medium text-gray-800 group-hover:text-[#2874f0] transition-colors whitespace-nowrap text-center">
                  {category.name}
                </span>
                {category.hasDropdown && (
                  <ChevronDown className="w-3 h-3 text-gray-500 hidden sm:block" />
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default CategoryNav
