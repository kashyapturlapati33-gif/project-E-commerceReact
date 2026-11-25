import { useState, useRef, useEffect } from 'react'
import './Home.css'

const photo = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=650&q=80`

const productImages = {
  1: photo('photo-1496181133206-80ce9b88a853'),
  2: photo('photo-1511707171634-5f897ff02aa9'),
  3: photo('photo-1505740420928-5e560c06d30e'),
  4: photo('photo-1523275335684-37898b6baf30'),
  5: photo('photo-1608043152269-423dbba4e7e1'),
  6: photo('photo-1606220945770-b5b6c2c55bf1'),
  7: photo('photo-1527814050087-3793815479db'),
  8: photo('photo-1587829741301-dc798b83add3'),
  9: photo('photo-1521572163474-6864f9cf17ab'),
  10: photo('photo-1542291026-7eec264c27ff'),
  11: photo('photo-1553062407-98eeb64c6a62'),
  12: photo('photo-1511499767150-a48a237f0083'),
  13: photo('photo-1517668808822-9ebb02f2a0e6'),
  14: photo('photo-1507473885765-e6ed057f782c'),
  15: photo('photo-1602143407151-7111542de6e8'),
  16: photo('photo-1563861826100-9cb868fdbe1c')
}

function ProductImage({ src, name, emoji }) {
  const [failed, setFailed] = useState(false)

  return src && !failed ? (
    <img
      src={src}
      alt={name}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  ) : (
    <span className="se-image-fallback">
      {emoji || '📦'}
    </span>
  )
}

function Home() {
  const initialProducts = [
    { id: 1, name: 'Laptop', price: 45000, category: 'Electronics', emoji: '💻' },
    { id: 2, name: 'Smartphone', price: 20000, category: 'Electronics', emoji: '📱' },
    { id: 3, name: 'Headphones', price: 1500, category: 'Electronics', emoji: '🎧' },
    { id: 4, name: 'Smart Watch', price: 3000, category: 'Electronics', emoji: '⌚' },
    { id: 5, name: 'Bluetooth Speaker', price: 2200, category: 'Electronics', emoji: '🔊' },
    { id: 6, name: 'Wireless Earbuds', price: 1800, category: 'Electronics', emoji: '🎵' },
    { id: 7, name: 'Gaming Mouse', price: 999, category: 'Electronics', emoji: '🖱️' },
    { id: 8, name: 'Mechanical Keyboard', price: 2500, category: 'Electronics', emoji: '⌨️' },
    { id: 9, name: 'Men T-Shirt', price: 599, category: 'Fashion', emoji: '👕' },
    { id: 10, name: 'Casual Shoes', price: 1999, category: 'Fashion', emoji: '👟' },
    { id: 11, name: 'Backpack', price: 1299, category: 'Fashion', emoji: '🎒' },
    { id: 12, name: 'Sunglasses', price: 799, category: 'Fashion', emoji: '🕶️' },
    { id: 13, name: 'Coffee Maker', price: 3500, category: 'Home', emoji: '☕' },
    { id: 14, name: 'Table Lamp', price: 899, category: 'Home', emoji: '💡' },
    { id: 15, name: 'Water Bottle', price: 499, category: 'Home', emoji: '🍶' },
    { id: 16, name: 'Digital Clock', price: 1199, category: 'Home', emoji: '⏰' }
  ]

  const [products] = useState(() => {
    const saved = localStorage.getItem('products')

    if (saved) {
      return JSON.parse(saved)
    }

    localStorage.setItem(
      'products',
      JSON.stringify(initialProducts)
    )

    return initialProducts
  })

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('default')
  const [message, setMessage] = useState('')

  const timer = useRef(null)

  const [wishlist, setWishlist] = useState(() => {
    return JSON.parse(
      localStorage.getItem('wishlist')
    ) || []
  })

  useEffect(() => {
    return () => clearTimeout(timer.current)
  }, [])

  // Toast Notification

  const showMessage = (text) => {
    clearTimeout(timer.current)

    setMessage(text)

    timer.current = setTimeout(() => {
      setMessage('')
    }, 2500)
  }

  // Add to Cart

  const addToCart = (product) => {
    const cart = JSON.parse(
      localStorage.getItem('cart')
    ) || []

    cart.push(product)

    localStorage.setItem(
      'cart',
      JSON.stringify(cart)
    )

    showMessage(`${product.name} added to cart!`)
  }

  // Wishlist

  const toggleWishlist = (product) => {
    const exists = wishlist.some(
      p => p.id === product.id
    )

    let updated

    if (exists) {
      updated = wishlist.filter(
        p => p.id !== product.id
      )

      showMessage(
        `${product.name} removed from wishlist!`
      )
    } else {
      updated = [...wishlist, product]

      showMessage(
        `${product.name} saved to wishlist!`
      )
    }

    setWishlist(updated)

    localStorage.setItem(
      'wishlist',
      JSON.stringify(updated)
    )
  }

  // Search and Category

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesCategory =
      category === 'All' ||
      product.category === category

    return matchesSearch && matchesCategory
  })

  if (sort === 'low') {
    filteredProducts.sort((a, b) => a.price - b.price)
  }

  if (sort === 'high') {
    filteredProducts.sort((a, b) => b.price - a.price)
  }

  const categories = [
    {
      name: 'Electronics',
      description: 'Discover smart technology',
      image: productImages[1]
    },
    {
      name: 'Fashion',
      description: 'Upgrade your everyday style',
      image: productImages[10]
    },
    {
      name: 'Home',
      description: 'Essentials for your space',
      image: productImages[14]
    }
  ]

  const selectCategory = (name) => {
    setCategory(name)
    setSearch('')

    document.getElementById('shop-products')
      ?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="se-home">

      {/* Premium Hero Banner */}

      <section className="se-hero">

        <div className="se-hero-content">

          <span className="se-eyebrow">
            DISCOVER THE COLLECTION
          </span>

          <h1>
            Everything you need.
            <span> All in one place.</span>
          </h1>

          <p>
            Explore a curated collection of technology,
            fashion and everyday essentials.
            Find something you love at ShopEasy.
          </p>

          <a
            href="#shop-products"
            className="se-hero-button"
            onClick={() => {
              setCategory('All')
              setSearch('')
            }}
          >
            Explore Collection →
          </a>

          <div className="se-hero-caption">
            Discover. Shop. Enjoy.
          </div>

        </div>

        <div className="se-hero-image">
          <ProductImage
            src={productImages[3]}
            name="Premium headphones"
            emoji="🎧"
          />
        </div>

      </section>

      {/* Shopping Highlights */}

      <section className="se-benefits">

        <div>
          <span>01</span>
          <section>
            <strong>Easy Shopping</strong>
            <small>Find your everyday essentials</small>
          </section>
        </div>

        <div>
          <span>02</span>
          <section>
            <strong>Great Selection</strong>
            <small>Explore multiple categories</small>
          </section>
        </div>

        <div>
          <span>03</span>
          <section>
            <strong>Personal Wishlist</strong>
            <small>Save your favourite products</small>
          </section>
        </div>

        <div>
          <span>04</span>
          <section>
            <strong>Simple Checkout</strong>
            <small>A convenient shopping experience</small>
          </section>
        </div>

      </section>

      {/* Shop by Category */}

      <section className="se-section">

        <div className="se-section-heading">
          <div>
            <span className="se-eyebrow">
              FIND YOUR FAVOURITES
            </span>

            <h2>Shop by Category</h2>
          </div>

          <button
            className="se-text-button"
            onClick={() => selectCategory('All')}
          >
            View All →
          </button>
        </div>

        <div className="se-categories">

          {categories.map(item => (

            <button
              key={item.name}
              className="se-category-card"
              onClick={() => selectCategory(item.name)}
            >

              <ProductImage
                src={item.image}
                name={item.name}
              />

              <div className="se-category-content">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <span>Explore →</span>
              </div>

            </button>

          ))}

        </div>

      </section>

      {/* Product Collection */}

      <section
        className="se-section"
        id="shop-products"
      >

        <div className="se-section-heading">

          <div>
            <span className="se-eyebrow">
              OUR COLLECTION
            </span>

            <h2>Explore Our Products</h2>

            <p>
              Find the perfect product for your lifestyle.
            </p>
          </div>

        </div>

        {/* Search and Sort */}

        <div className="se-toolbar">

          <div className="se-search">

            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 5 5" />
            </svg>

            <input
              type="text"
              placeholder="Search for products..."
              aria-label="Search products"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

          </div>

          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            aria-label="Sort products"
          >
            <option value="default">Sort by: Default</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>

        </div>

        {/* Category Filters */}

        <div className="se-filter-row">

          <div className="se-filters">

            {['All', 'Electronics', 'Fashion', 'Home'].map(item => (

              <button
                key={item}
                className={
                  category === item ? 'se-active' : ''
                }
                onClick={() => setCategory(item)}
              >
                {item}
              </button>

            ))}

          </div>

          <span className="se-count">
            {filteredProducts.length} products
          </span>

        </div>

        {/* Product Cards */}

        <div className="se-products">

          {filteredProducts.map(product => {

            const saved = wishlist.some(
              p => p.id === product.id
            )

            return (

              <article
                className="se-product"
                key={product.id}
              >

                <div className="se-product-image">

                  <ProductImage
                    src={productImages[product.id]}
                    name={product.name}
                    emoji={product.emoji}
                  />

                  <button
                    className={`se-bookmark ${
                      saved ? 'se-saved' : ''
                    }`}
                    onClick={() => toggleWishlist(product)}
                    aria-label={`Toggle wishlist for ${product.name}`}
                    aria-pressed={saved}
                    title={saved
                      ? 'Remove from Wishlist'
                      : 'Save to Wishlist'}
                  >

                    <svg
                      width="21"
                      height="21"
                      viewBox="0 0 24 24"
                      fill={saved ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    >
                      <path d="M6 3h12v18l-6-4-6 4z" />
                    </svg>

                  </button>

                </div>

                <div className="se-product-details">

                  <span className="se-product-category">
                    {product.category || 'General'}
                  </span>

                  <h3>{product.name}</h3>

                  <p className="se-price">
                    ₹{Number(product.price).toLocaleString('en-IN')}
                  </p>

                  <button
                    className="se-add-cart"
                    onClick={() => addToCart(product)}
                  >

                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 3h2l3 12h11l2-8H6" />
                      <circle cx="9" cy="20" r="1" />
                      <circle cx="18" cy="20" r="1" />
                    </svg>

                    Add to Cart

                  </button>

                </div>

              </article>

            )
          })}

        </div>

        {filteredProducts.length === 0 && (

          <div className="se-empty">
            <h2>No products found</h2>
            <p>Try another search or category.</p>

            <button
              className="se-text-button"
              onClick={() => {
                setSearch('')
                setCategory('All')
              }}
            >
              View All Products →
            </button>
          </div>

        )}

      </section>

      {/* Footer */}

      <footer className="se-footer">

        <div className="se-footer-grid">

          <div>
            <h2>Shop<span>Easy.</span></h2>

            <p>
              Your destination for technology,
              fashion and everyday essentials.
            </p>
          </div>

          <div>
            <h3>Shop</h3>

            {categories.map(item => (
              <button
                key={item.name}
                onClick={() => selectCategory(item.name)}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div>
            <h3>About ShopEasy</h3>
            <p>Discover more.</p>
            <p>Shop smarter.</p>
            <p>Enjoy every purchase.</p>
          </div>

        </div>

        <div className="se-footer-bottom">
          © 2026 ShopEasy. All rights reserved.
        </div>

      </footer>

      {message && (
        <div className="toast-message" role="status">
          ✓ {message}
        </div>
      )}

    </main>
  )
}

export default Home