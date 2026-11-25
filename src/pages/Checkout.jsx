
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Checkout() {
  const navigate = useNavigate()

  const user = JSON.parse(
    localStorage.getItem('loggedInUser')
  )

  const cart = JSON.parse(
    localStorage.getItem('cart')
  ) || []

  const users = JSON.parse(
    localStorage.getItem('users')
  ) || []

  const customer = users.find(
    u => u.email === user?.email
  )

  const [name, setName] = useState(customer?.name || '')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [pincode, setPincode] = useState('')
  const [payment, setPayment] = useState('Cash on Delivery')
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState(null)

  // Calculate Order Total

  const subtotal = cart.reduce(
    (sum, p) => sum + Number(p.price), 0
  )

  const discount = localStorage.getItem('coupon') === 'SHOP10'
    ? Math.round(subtotal * 0.10)
    : 0

  const total = subtotal - discount

  const formatPrice = (price) =>
    Number(price).toLocaleString('en-IN')

  // Place Order

  const placeOrder = (e) => {
    e.preventDefault()

    if (!user || user.role !== 'user') {
      alert('Please login as a user!')
      navigate('/login')
      return
    }

    if (cart.length === 0) {
      alert('Your cart is empty!')
      navigate('/cart')
      return
    }

    if (!name.trim() || !address.trim() || !city.trim()) {
      alert('Please enter valid delivery details.')
      return
    }

    const orders = JSON.parse(
      localStorage.getItem('orders')
    ) || []

    const newOrder = {
      id: Date.now(),
      customer: name,
      email: user.email,
      phone,
      address,
      city,
      pincode,
      payment,
      products: cart,
      subtotal,
      discount,
      amount: total,
      status: 'Pending',
      date: new Date().toLocaleDateString()
    }

    orders.push(newOrder)

    localStorage.setItem(
      'orders',
      JSON.stringify(orders)
    )

    localStorage.removeItem('cart')
    localStorage.removeItem('coupon')

    setOrderId(newOrder.id)
    setSuccess(true)
  }

  // Order Success Screen

  if (success) {
    return (
      <div className="order-success">

        <div className="success-icon">✓</div>

        <h1>Order Placed Successfully!</h1>

        <p>Thank you for shopping with ShopEasy.</p>

        <p>Order ID: #{orderId}</p>

        <p>Your order is now being processed.</p>

        <button
          className="shop-primary"
          onClick={() => navigate('/')}
        >
          Continue Shopping
        </button>

      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty.</h2>

        <button
          className="shop-primary"
          onClick={() => navigate('/')}
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="new-checkout">

      <h1>Checkout</h1>

      <div className="checkout-steps">
        <span className="completed-step">✓ Cart</span>
        <span>────</span>
        <span className="current-step">② Checkout</span>
        <span>────</span>
        <span>③ Confirmation</span>
      </div>

      <form
        className="checkout-layout"
        onSubmit={placeOrder}
      >

        <section className="delivery-form">

          <h2>📍 Delivery Information</h2>

          <label>Full Name</label>

          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          <label>Phone Number</label>

          <input
            type="tel"
            placeholder="Enter 10-digit phone number"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            pattern="[0-9]{10}"
            required
          />

          <label>Delivery Address</label>

          <textarea
            placeholder="House number, street and area"
            value={address}
            onChange={e => setAddress(e.target.value)}
            required
          />

          <label>City</label>

          <input
            placeholder="Enter city"
            value={city}
            onChange={e => setCity(e.target.value)}
            required
          />

          <label>PIN Code</label>

          <input
            placeholder="Enter 6-digit PIN code"
            value={pincode}
            onChange={e => setPincode(e.target.value)}
            pattern="[0-9]{6}"
            required
          />

          <h2>💳 Payment Method</h2>

          {[
            'Cash on Delivery',
            'UPI (Demo)',
            'Card (Demo)'
          ].map(method => (

            <label
              className={`payment-option ${
                payment === method
                  ? 'selected-payment'
                  : ''
              }`}
              key={method}
            >

              <input
                type="radio"
                name="payment"
                value={method}
                checked={payment === method}
                onChange={e => setPayment(e.target.value)}
              />

              {method}

            </label>

          ))}

          <p className="payment-note">
            This is a demonstration checkout.
            No real payment is processed.
          </p>

        </section>

        {/* Order Summary */}

        <aside className="order-summary">

          <h2>Order Summary</h2>

          {cart.map((product, index) => (

            <div className="summary-row" key={index}>

              <span>
                {product.emoji || '🛍️'} {product.name}
              </span>

              <strong>
                ₹{formatPrice(product.price)}
              </strong>

            </div>

          ))}

          <hr />

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>₹{formatPrice(subtotal)}</strong>
          </div>

          <div className="summary-row">
            <span>Delivery</span>
            <strong className="free-delivery">FREE</strong>
          </div>

          <div className="summary-row">
            <span>Discount</span>
            <strong className="free-delivery">
              - ₹{formatPrice(discount)}
            </strong>
          </div>

          <hr />

          <div className="summary-row final-total">
            <span>Total</span>
            <strong>₹{formatPrice(total)}</strong>
          </div>

          <button type="submit" className="shop-primary">
            Place Order →
          </button>

          <button
            type="button"
            className="continue-shopping"
            onClick={() => navigate('/cart')}
          >
            ← Back to Cart
          </button>

        </aside>

      </form>

    </div>
  )
}

export default Checkout
