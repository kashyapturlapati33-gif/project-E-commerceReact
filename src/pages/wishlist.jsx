
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Wishlist() {
  const navigate = useNavigate()

  const [wishlist, setWishlist] = useState(() => {
    return JSON.parse(
      localStorage.getItem('wishlist')
    ) || []
  })

  const [message, setMessage] = useState('')

  const showMessage = (text) => {
    setMessage(text)

    setTimeout(() => {
      setMessage('')
    }, 2500)
  }

  // Remove from Wishlist

  const removeItem = (id) => {
    const updated = wishlist.filter(
      product => product.id !== id
    )

    setWishlist(updated)

    localStorage.setItem(
      'wishlist',
      JSON.stringify(updated)
    )

    showMessage('Product removed from wishlist!')
  }

  // Add to Cart

  const addToCart = (product) => {
    const cart = JSON.parse(
      localStorage.getItem('cart')
    ) || []

    const products = JSON.parse(
      localStorage.getItem('products')
    ) || []

    const currentProduct = products.find(
      p => p.id === product.id
    )

    if (!currentProduct) {
      showMessage('This product is no longer available.')
      return
    }

    cart.push(currentProduct)

    localStorage.setItem(
      'cart',
      JSON.stringify(cart)
    )

    showMessage(`${product.name} added to cart!`)
  }

  // Clear Wishlist

  const clearWishlist = () => {
    if (window.confirm('Clear your entire wishlist?')) {
      setWishlist([])
      localStorage.removeItem('wishlist')
      showMessage('Wishlist cleared!')
    }
  }

  return (
    <div className="wishlist-page">

      <div className="wishlist-header">

        <div>
          <h1>My Wishlist</h1>

          <p>
            {wishlist.length} saved products
          </p>
        </div>

        {wishlist.length > 0 && (
          <button
            className="clear-wishlist"
            onClick={clearWishlist}
          >
            Clear Wishlist
          </button>
        )}

      </div>

      {wishlist.length === 0 ? (

        <div className="empty-wishlist">

          <span>🔖</span>

          <h2>Your wishlist is empty</h2>

          <p>
            Save your favourite products and
            find them here anytime.
          </p>

          <button
            className="shop-primary"
            onClick={() => navigate('/')}
          >
            Explore Products →
          </button>

        </div>

      ) : (

        <div className="products">

          {wishlist.map(product => (

            <div className="product-card" key={product.id}>

              {/* Professional Bookmark Icon */}

              <button
                className="wishlist-btn wish-active"
                onClick={() => removeItem(product.id)}
                aria-label={`Remove ${product.name} from wishlist`}
              >
               <svg
  width="20"
  height="20"
  viewBox="0 0 24 24"
  fill="currentColor"
>
  <path d="M6 3h12v18l-6-4-6 4z" />
</svg>
              </button>

              <div className="product-emoji">
                {product.emoji || '🛍️'}
              </div>

              <span className="product-category">
                {product.category || 'General'}
              </span>

              <h3>{product.name}</h3>

              <p className="product-price">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </p>

              <button onClick={() => addToCart(product)}>
                🛒 Add to Cart
              </button>

              <button
                className="wishlist-remove"
                onClick={() => removeItem(product.id)}
              >
                Remove
              </button>

            </div>

          ))}

        </div>

      )}

      {wishlist.length > 0 && (
        <button
          className="continue-shopping"
          onClick={() => navigate('/')}
        >
          ← Continue Shopping
        </button>
      )}

      {message && (
        <div className="toast-message" role="status">
          {message}
        </div>
      )}

    </div>
  )
}

export default Wishlist
