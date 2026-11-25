
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminDashboard() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Electronics')
  const [emoji, setEmoji] = useState('🛍️')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'))

    if (!user || user.role !== 'admin') {
      alert('Admin Login Required!')
      navigate('/login')
      return
    }

    setAuthorized(true)

    setProducts(
      JSON.parse(localStorage.getItem('products')) || []
    )

    setOrders(
      JSON.parse(localStorage.getItem('orders')) || []
    )
  }, [navigate])

  // Add Product

  const addProduct = (e) => {
    e.preventDefault()

    if (!name.trim() || Number(price) <= 0) {
      return
    }

    const newProduct = {
      id: Date.now(),
      name: name.trim(),
      price: Number(price),
      category,
      emoji
    }

    const updated = [...products, newProduct]

    setProducts(updated)
    localStorage.setItem('products', JSON.stringify(updated))

    setName('')
    setPrice('')
    setEmoji('🛍️')

    alert('Product Added Successfully!')
  }

  // Delete Product

  const deleteProduct = (id) => {
    if (!window.confirm('Delete this product?')) return

    const updated = products.filter((p) => p.id !== id)

    setProducts(updated)
    localStorage.setItem('products', JSON.stringify(updated))
  }

  // Update Order Status

  const updateOrder = (id, status) => {
    const updated = orders.map((order) =>
      order.id === id ? { ...order, status } : order
    )

    setOrders(updated)
    localStorage.setItem('orders', JSON.stringify(updated))
  }

  // Delete Order

  const deleteOrder = (id) => {
    if (!window.confirm('Delete this order?')) return

    const updated = orders.filter((order) => order.id !== id)

    setOrders(updated)
    localStorage.setItem('orders', JSON.stringify(updated))
  }

  // Logout

  const logout = () => {
    localStorage.removeItem('loggedInUser')
    navigate('/login')
  }

  // Dashboard Statistics

  const revenue = orders.reduce(
    (total, order) => total + (Number(order.amount) || 0), 0
  )

  const pending = orders.filter(
    (order) => order.status === 'Pending'
  ).length

  const shipped = orders.filter(
    (order) => order.status === 'Shipped'
  ).length

  const delivered = orders.filter(
    (order) => order.status === 'Delivered'
  ).length

  const formatPrice = (amount) =>
    Number(amount).toLocaleString('en-IN')

  // Product Search

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  )

  if (!authorized) return null

  return (
    <div className="admin-dashboard">

      {/* Dashboard Header */}

      <header className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome back! Manage your ShopEasy store.</p>
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </header>

      {/* Statistics Cards */}

      <section className="stats-grid">

        <div className="stat-card blue-card">
          <span>📦</span>
          <p>Total Products</p>
          <h2>{products.length}</h2>
        </div>

        <div className="stat-card purple-card">
          <span>🛒</span>
          <p>Total Orders</p>
          <h2>{orders.length}</h2>
        </div>

        <div className="stat-card green-card">
          <span>💰</span>
          <p>Total Order Value</p>
          <h2>₹{formatPrice(revenue)}</h2>
        </div>

        <div className="stat-card orange-card">
          <span>⏳</span>
          <p>Pending Orders</p>
          <h2>{pending}</h2>
        </div>

      </section>

      {/* Order Chart */}

      <section className="dashboard-panel">
        <h2>Order Overview</h2>

        {[
          { label: 'Pending', count: pending },
          { label: 'Shipped', count: shipped },
          { label: 'Delivered', count: delivered }
        ].map((item) => (
          <div className="chart-row" key={item.label}>

            <span>{item.label}</span>

            <div className="chart-track">
              <div
                className={`chart-fill ${item.label.toLowerCase()}`}
                style={{
                  width: `${
                    orders.length
                      ? (item.count / orders.length) * 100
                      : 0
                  }%`
                }}
              />
            </div>

            <strong>{item.count}</strong>

          </div>
        ))}
      </section>

      {/* Add Product */}

      <section className="dashboard-panel">
        <h2>➕ Add New Product</h2>

        <form className="add-product-form" onSubmit={addProduct}>

          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Product Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="1"
            required
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Home</option>
          </select>

          <input
            type="text"
            placeholder="Product Emoji"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
          />

          <button type="submit" className="primary-btn">
            + Add Product
          </button>

        </form>
      </section>

      {/* Manage Products */}

      <section className="dashboard-panel">

        <div className="panel-header">
          <h2>📦 Manage Products</h2>

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-container">

          <table className="product-table">

            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredProducts.map((product) => (
                <tr key={product.id}>

                  <td>
                    {product.emoji || '🛍️'} {product.name}
                  </td>

                  <td>{product.category || 'General'}</td>

                  <td>₹{formatPrice(product.price)}</td>

                  <td>
                    <button
                      className="danger-btn"
                      onClick={() => deleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

        {filteredProducts.length === 0 && (
          <p className="empty-message">No products found.</p>
        )}

      </section>

      {/* Customer Orders */}

      <section className="dashboard-panel">

        <h2>🛒 Customer Orders</h2>

        {orders.length === 0 && (
          <p className="empty-message">
            No orders available.
          </p>
        )}

        <div className="dashboard-orders">

          {orders.map((order) => (
            <div className="new-order-card" key={order.id}>

              <div className="order-header">

                <h3>Order #{order.id}</h3>

                <span className={`status-badge ${
                  (order.status || 'Pending').toLowerCase()
                }`}>
                  {order.status || 'Pending'}
                </span>

              </div>

              <p><strong>Customer:</strong> {order.customer}</p>
              <p><strong>Email:</strong> {order.email}</p>
              <p><strong>Date:</strong> {order.date}</p>

              <h4>Ordered Products</h4>

              {order.products && order.products.length > 0 ? (
                order.products.map((product, index) => (
                  <div className="ordered-product" key={index}>

                    <span>{product.name}</span>

                    <span>₹{formatPrice(product.price)}</span>

                  </div>
                ))
              ) : (
                <p>No product details available.</p>
              )}

              <h3 className="order-total">
                Total: ₹{formatPrice(order.amount)}
              </h3>

              <div className="order-actions">

                <select
                  value={order.status || 'Pending'}
                  onChange={(e) =>
                    updateOrder(order.id, e.target.value)
                  }
                >
                  <option>Pending</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                </select>

                <button
                  className="danger-btn"
                  onClick={() => deleteOrder(order.id)}
                >
                  Delete Order
                </button>

              </div>

            </div>
          ))}

        </div>

      </section>

    </div>
  )
}

export default AdminDashboard
