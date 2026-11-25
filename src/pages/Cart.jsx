import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Cart.css'

const imageIds = {
  1: 'photo-1496181133206-80ce9b88a853',
  2: 'photo-1511707171634-5f897ff02aa9',
  3: 'photo-1505740420928-5e560c06d30e',
  4: 'photo-1523275335684-37898b6baf30',
  5: 'photo-1608043152269-423dbba4e7e1',
  6: 'photo-1606220945770-b5b6c2c55bf1',
  7: 'photo-1527814050087-3793815479db',
  8: 'photo-1587829741301-dc798b83add3',
  9: 'photo-1521572163474-6864f9cf17ab',
  10: 'photo-1542291026-7eec264c27ff',
  11: 'photo-1553062407-98eeb64c6a62',
  12: 'photo-1511499767150-a48a237f0083',
  13: 'photo-1517668808822-9ebb02f2a0e6',
  14: 'photo-1507473885765-e6ed057f782c',
  15: 'photo-1602143407151-7111542de6e8',
  16: 'photo-1563861826100-9cb868fdbe1c'
}

function CartImage({ product }) {
  const [failed, setFailed] = useState(false)

  return imageIds[product.id] && !failed ? (
    <img
      src={`https://images.unsplash.com/${imageIds[product.id]}?auto=format&fit=crop&w=350&q=80`}
      alt={product.name}
      onError={() => setFailed(true)}
    />
  ) : (
    <span>{product.emoji || '📦'}</span>
  )
}

function Cart() {
  const [cart, setCart] = useState([])
  const [coupon, setCoupon] = useState('')
  const [discount, setDiscount] = useState(false)
  const [message, setMessage] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart')) || [])

    const applied =
      localStorage.getItem('coupon') === 'SHOP10'

    setDiscount(applied)

    if (applied) {
      setCoupon('SHOP10')
    }
  }, [])

  // Save Cart

  const saveCart = (updated) => {
    setCart(updated)
    localStorage.setItem('cart', JSON.stringify(updated))

    if (updated.length === 0) {
      localStorage.removeItem('coupon')
      setDiscount(false)
      setCoupon('')
      setMessage('')
    }
  }

  // Increase Quantity

  const increaseQuantity = (product) => {
    saveCart([...cart, product])
  }

  // Decrease Quantity

  const decreaseQuantity = (id) => {
    const index = cart.findIndex(p => p.id === id)

    saveCart(cart.filter((_, i) => i !== index))
  }

  // Remove Product

  const removeItem = (id) => {
    saveCart(cart.filter(p => p.id !== id))
  }

  // Group Duplicate Products

  const groupedProducts = []

  cart.forEach(product => {
    const existing = groupedProducts.find(
      p => p.id === product.id
    )

    if (existing) {
      existing.quantity += 1
    } else {
      groupedProducts.push({
        ...product,
        quantity: 1
      })
    }
  })

  // Calculate Price

  const subtotal = cart.reduce(
    (sum, product) => sum + Number(product.price), 0
  )

  const discountAmount = discount
    ? Math.round(subtotal * 0.10)
    : 0

  const total = subtotal - discountAmount

  const formatPrice = (price) =>
    Number(price).toLocaleString('en-IN')

  // Apply Coupon

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'SHOP10') {
      setDiscount(true)
      setMessage('Coupon applied! You saved 10%.')
      localStorage.setItem('coupon', 'SHOP10')
    } else {
      setMessage('Invalid coupon code.')
    }
  }

  const removeCoupon = () => {
    setDiscount(false)
    setCoupon('')
    setMessage('')
    localStorage.removeItem('coupon')
  }

  return (
    <main className="sc-cart">

      {/* Breadcrumb */}

      <div className="sc-breadcrumb">
        <button onClick={() => navigate('/')}>
          Home
        </button>
        <span>/</span>
        <span>Shopping Cart</span>
      </div>

      {/* Page Heading */}

      <header className="sc-heading">

        <span className="sc-label">
          YOUR SHOPPING BAG
        </span>

        <h1>Shopping Cart</h1>

        <p>
          Review your selected products before checkout.
        </p>

      </header>

      {cart.length === 0 ? (

        <section className="sc-empty">

          <div className="sc-empty-icon">

            <svg
              width="65"
              height="65"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            >
              <path d="M3 3h2l3 12h11l2-8H6" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>

          </div>

          <h2>Your cart is empty</h2>

          <p>
            Discover something you love in our collection.
          </p>

          <button
            className="sc-primary"
            onClick={() => navigate('/')}
          >
            Explore Products →
          </button>

        </section>

      ) : (

        <div className="sc-layout">

          {/* Shopping Items */}

          <section className="sc-items">

            <div className="sc-items-heading">

              <h2>Your Items</h2>

              <span>{cart.length} items</span>

            </div>

            {groupedProducts.map(product => (

              <article
                className="sc-item"
                key={product.id}
              >

                <div className="sc-image">
                  <CartImage product={product} />
                </div>

                <div className="sc-details">

                  <span className="sc-category">
                    {product.category || 'General'}
                  </span>

                  <h3>{product.name}</h3>

                  <p className="sc-unit-price">
                    ₹{formatPrice(product.price)}
                  </p>

                  <div className="sc-item-actions">

                    <div className="sc-quantity">

                      <button
                        aria-label={`Decrease ${product.name} quantity`}
                        onClick={() =>
                          decreaseQuantity(product.id)
                        }
                      >
                        −
                      </button>

                      <span>{product.quantity}</span>

                      <button
                        aria-label={`Increase ${product.name} quantity`}
                        onClick={() => {
                          const original = cart.find(
                            p => p.id === product.id
                          )

                          increaseQuantity(original)
                        }}
                      >
                        +
                      </button>

                    </div>

                    <button
                      className="sc-remove"
                      onClick={() => removeItem(product.id)}
                    >
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" />
                      </svg>

                      Remove
                    </button>

                  </div>

                </div>

                <div className="sc-item-total">

                  <small>Item total</small>

                  <strong>
                    ₹{formatPrice(
                      product.price * product.quantity
                    )}
                  </strong>

                </div>

              </article>

            ))}

            <button
              className="sc-continue"
              onClick={() => navigate('/')}
            >
              ← Continue Shopping
            </button>

          </section>

          {/* Order Summary */}

          <aside className="sc-summary">

            <h2>Order Summary</h2>

            <p className="sc-summary-subtitle">
              Review your order details
            </p>

            <div className="sc-divider" />

            <div className="sc-summary-row">
              <span>Subtotal ({cart.length} items)</span>
              <strong>₹{formatPrice(subtotal)}</strong>
            </div>

            <div className="sc-summary-row">
              <span>Delivery</span>
              <strong className="sc-green">Free</strong>
            </div>

            <div className="sc-summary-row">
              <span>Discount</span>
              <strong className="sc-green">
                − ₹{formatPrice(discountAmount)}
              </strong>
            </div>

            {/* Coupon Section */}

            <div className="sc-coupon">

              <h3>Have a coupon?</h3>

              <div className="sc-coupon-input">

                <input
                  placeholder="Enter coupon code"
                  aria-label="Coupon code"
                  value={coupon}
                  disabled={discount}
                  onChange={e => setCoupon(e.target.value)}
                />

                <button
                  onClick={applyCoupon}
                  disabled={discount}
                >
                  {discount ? 'Applied' : 'Apply'}
                </button>

              </div>

              <p>
                Use <strong>SHOP10</strong> for 10% off.
              </p>

              {message && (
                <p
                  className={
                    message === 'Invalid coupon code.'
                      ? 'sc-error'
                      : 'sc-green'
                  }
                  role="status"
                >
                  {message}
                </p>
              )}

              {discount && (
                <button
                  className="sc-remove"
                  onClick={removeCoupon}
                >
                  Remove Coupon
                </button>
              )}

            </div>

            <div className="sc-divider" />

            <div className="sc-total">
              <span>Total Amount</span>
              <strong>₹{formatPrice(total)}</strong>
            </div>

            {discount && (
              <div className="sc-savings">
                You saved ₹{formatPrice(discountAmount)}
                {' '}on this order!
              </div>
            )}

            <button
              className="sc-primary"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout →
            </button>

            <div className="sc-checkout-note">
              Simple and convenient checkout
            </div>

          </aside>

        </div>

      )}

    </main>
  )
}

export default Cart