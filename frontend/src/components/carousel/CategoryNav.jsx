import { Link } from "react-router-dom"
import { ChevronDown } from "lucide-react"

// Fixed categories matching Flipkart layout exactly
const categories = [
  { 
    id: 'minutes', 
    name: 'Minutes', 
    image: 'category-minutes.webp',
    hasNew: true,
    link: '/products'
  },
  { 
    id: 'mobiles', 
    name: 'Mobiles & Tablets', 
    image: 'category-mobiles.webp',
    link: '/products?category=14'
  },
  { 
    id: 'fashion', 
    name: 'Fashion', 
    image: 'category-fashion.webp',
    hasDropdown: true,
    link: '/products?category=8'
  },
  { 
    id: 'electronics', 
    name: 'Electronics', 
    image: 'category-electronics.webp',
    hasDropdown: true,
    link: '/products?category=17'
  },
  { 
    id: 'jewelry', 
    name: 'Jewelry', 
    image: 'category-jewelry.webp',
    link: '/products?category=22'
  },
  { 
    id: 'home', 
    name: 'Home & Furniture', 
    image: 'category-home.webp',
    hasDropdown: true,
    link: '/products?category=5'
  },
  { 
    id: 'flights', 
    name: 'Flight Bookings', 
    image: 'category-flight.webp',
    link: '#'
  },
  { 
    id: 'beauty', 
    name: 'Beauty, Food..', 
    image: 'category-beauty.webp',
    hasDropdown: true,
    link: '/products?category=1'
  },
  { 
    id: 'grocery', 
    name: 'Grocery', 
    image: 'category-grocery.webp',
    link: '/products?category=4'
  },
]

const CategoryNav = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-[1248px] mx-auto">
        <div className="flex items-center justify-between">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.link}
              className="flex flex-col items-center justify-start py-3 px-2 lg:px-4 group cursor-pointer hover:no-underline relative flex-1"
            >
              
              {/* Category Image */}
              <div className="w-16 h-16 flex items-center justify-center mb-1">
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
                <span className="text-[13px] font-medium text-gray-800 group-hover:text-[#2874f0] transition-colors whitespace-nowrap text-center">
                  {category.name}
                </span>
                {category.hasDropdown && (
                  <ChevronDown className="w-3 h-3 text-gray-500" />
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
