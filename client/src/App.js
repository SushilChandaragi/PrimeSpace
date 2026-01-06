import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// API Base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Auth Context
const AuthContext = createContext();

const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Navbar Component
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          Prime<span>Space</span>
        </Link>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/properties">Properties</Link></li>
          {user && user.role === 'admin' && (
            <li><Link to="/dashboard">Dashboard</Link></li>
          )}
          {user ? (
            <>
              <li><span style={{ color: '#c5a059' }}>Welcome, {user.username}</span></li>
              <li><button onClick={handleLogout} className="nav-btn">Logout</button></li>
            </>
          ) : (
            <li><Link to="/login" className="nav-btn">Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

// Footer Component
const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-content">
        <div className="footer-section">
          <h3>PrimeSpace</h3>
          <p>Your trusted partner in finding the perfect property in Karnataka. We make real estate simple.</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/properties">All Properties</Link>
          <Link to="/login">Agent Login</Link>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Camp Area, Belgaum</p>
          <p>Karnataka - 590001</p>
          <p>contact@primespace.com</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 PrimeSpace. All Rights Reserved.</p>
      </div>
    </div>
  </footer>
);

// Property Card Component
const PropertyCard = ({ property }) => {
  const formatPrice = (price, type) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }
    return `₹${price.toLocaleString()}${type === 'Rent' ? '/mo' : ''}`;
  };

  return (
    <div className="property-card">
      <div className="property-image">
        <img src={property.image} alt={property.title} />
        <span className="property-badge">{property.type}</span>
        <span className={`property-status status-${property.status.toLowerCase()}`}>
          {property.status}
        </span>
      </div>
      <div className="property-content">
        <div className="property-price">
          {formatPrice(property.price, property.type)}
          {property.type === 'Rent' && <span>/month</span>}
        </div>
        <h3 className="property-title">{property.title}</h3>
        <p className="property-location">📍 {property.location}</p>
        <div className="property-features">
          <span className="feature">🛏 {property.bedrooms} Beds</span>
          <span className="feature">🚿 {property.bathrooms} Baths</span>
          <span className="feature">📐 {property.area} sq.ft</span>
        </div>
        <Link to={`/property/${property._id}`} className="view-btn">View Details</Link>
      </div>
    </div>
  );
};

// Home Page
const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      const res = await axios.get(`${API_URL}/properties?status=Available`);
      console.log('API Response:', res.data); // Debug log
      // Ensure res.data is an array before setting state
      const properties = Array.isArray(res.data) ? res.data : [];
      setFeaturedProperties(properties.slice(0, 3));
    } catch (error) {
      console.error('Error fetching properties:', error);
      setFeaturedProperties([]); // Set empty array on error
    }
  };

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your <span>Dream Home</span></h1>
          <p>Discover premium properties in Belgaum and across Karnataka. Your perfect home is just a click away.</p>
          <button className="hero-btn" onClick={() => navigate('/properties')}>
            Explore Properties
          </button>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <h2>Featured Properties</h2>
            <p>Handpicked properties for you</p>
          </div>
          <div className="property-grid">
            {featuredProperties.map(property => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

// All Properties Page
const AllProperties = () => {
  const [properties, setProperties] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, [filter]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/properties`;
      if (filter !== 'All') {
        url += `?type=${filter}`;
      }
      const res = await axios.get(url);
      const properties = Array.isArray(res.data) ? res.data : [];
      setProperties(properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    }
    setLoading(false);
  };

  return (
    <section className="section">
      <div className="container">
        <div className="section-title">
          <h2>All Properties</h2>
          <p>Browse our complete collection of properties</p>
        </div>

        <div className="filter-bar">
          {['All', 'Sale', 'Rent'].map(type => (
            <button
              key={type}
              className={`filter-btn ${filter === type ? 'active' : ''}`}
              onClick={() => setFilter(type)}
            >
              {type === 'All' ? 'All Properties' : `For ${type}`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading">Loading properties...</div>
        ) : (
          <div className="property-grid">
            {properties.map(property => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// Property Details Page
const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const res = await axios.get(`${API_URL}/properties/${id}`);
      setProperty(res.data);
    } catch (error) {
      console.error('Error fetching property:', error);
    }
    setLoading(false);
  };

  const formatPrice = (price, type) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Crore`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lakh`;
    }
    return `₹${price.toLocaleString()}${type === 'Rent' ? '/month' : ''}`;
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!property) return <div className="loading">Property not found</div>;

  return (
    <section className="property-details">
      <div className="container">
        <div className="details-grid">
          <div className="details-image">
            <img src={property.image} alt={property.title} />
          </div>
          <div className="details-info">
            <span className={`property-status status-${property.status.toLowerCase()}`} style={{ display: 'inline-block', marginBottom: '15px' }}>
              {property.status}
            </span>
            <h1>{property.title}</h1>
            <p className="details-location">📍 {property.location}</p>
            <div className="details-price">{formatPrice(property.price, property.type)}</div>
            
            <div className="details-features">
              <span className="feature">🛏 {property.bedrooms} Bedrooms</span>
              <span className="feature">🚿 {property.bathrooms} Bathrooms</span>
              <span className="feature">📐 {property.area} sq.ft</span>
            </div>

            <div className="details-description">
              <h3>Description</h3>
              <p>{property.description}</p>
            </div>

            <button className="submit-btn" style={{ marginTop: '20px' }}>
              Contact Agent
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Login Page
const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${API_URL}/auth/login`, formData);
      login(res.data);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="form-container">
      <h2>Agent Login</h2>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>
        <button type="submit" className="submit-btn">Login</button>
      </form>
      <p className="form-link">
        Demo: admin@primespace.com / admin123
      </p>
    </div>
  );
};

// Register Page
const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`${API_URL}/auth/register`, formData);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="form-container">
      <h2>Create Account</h2>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            minLength="6"
          />
        </div>
        <button type="submit" className="submit-btn">Register</button>
      </form>
      <p className="form-link">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

// Dashboard (Admin Only)
const Dashboard = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const initialFormState = {
    title: '',
    location: '',
    price: '',
    description: '',
    type: 'Sale',
    status: 'Available',
    bedrooms: 2,
    bathrooms: 1,
    area: '',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await axios.get(`${API_URL}/properties`);
      const properties = Array.isArray(res.data) ? res.data : [];
      setProperties(properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = {
      headers: { Authorization: `Bearer ${user.token}` }
    };

    try {
      if (editingProperty) {
        await axios.put(`${API_URL}/properties/${editingProperty._id}`, formData, config);
        setMessage({ type: 'success', text: 'Property updated successfully!' });
      } else {
        await axios.post(`${API_URL}/properties`, formData, config);
        setMessage({ type: 'success', text: 'Property added successfully!' });
      }
      setFormData(initialFormState);
      setShowForm(false);
      setEditingProperty(null);
      fetchProperties();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Operation failed' });
    }
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      location: property.location,
      price: property.price,
      description: property.description,
      type: property.type,
      status: property.status,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      image: property.image
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await axios.delete(`${API_URL}/properties/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setMessage({ type: 'success', text: 'Property deleted successfully!' });
        fetchProperties();
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to delete property' });
      }
    }
  };

  const formatPrice = (price) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
    return `₹${price.toLocaleString()}`;
  };

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return (
    <section className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h2>Property Dashboard</h2>
          <button className="add-btn" onClick={() => { setShowForm(!showForm); setEditingProperty(null); setFormData(initialFormState); }}>
            {showForm ? 'Cancel' : '+ Add Property'}
          </button>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}

        {showForm && (
          <div className="form-container" style={{ maxWidth: '100%', marginBottom: '30px' }}>
            <h2>{editingProperty ? 'Edit Property' : 'Add New Property'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="e.g., Luxury Villa in Tilakwadi"
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    placeholder="e.g., Tilakwadi, Belgaum"
                  />
                </div>
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    placeholder="e.g., 5000000"
                  />
                </div>
                <div className="form-group">
                  <label>Area (sq.ft)</label>
                  <input
                    type="number"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    required
                    placeholder="e.g., 1500"
                  />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                    <option value="Sale">For Sale</option>
                    <option value="Rent">For Rent</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                    <option value="Available">Available</option>
                    <option value="Sold">Sold</option>
                    <option value="Rented">Rented</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Bedrooms</label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Bathrooms</label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    min="0"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  placeholder="Describe the property..."
                />
              </div>
              <button type="submit" className="submit-btn">
                {editingProperty ? 'Update Property' : 'Add Property'}
              </button>
            </form>
          </div>
        )}

        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Location</th>
              <th>Price</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map(property => (
              <tr key={property._id}>
                <td>{property.title}</td>
                <td>{property.location}</td>
                <td>{formatPrice(property.price)}</td>
                <td>{property.type}</td>
                <td>
                  <span className={`property-status status-${property.status.toLowerCase()}`}>
                    {property.status}
                  </span>
                </td>
                <td>
                  <button className="action-btn edit-btn" onClick={() => handleEdit(property)}>Edit</button>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(property._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/properties" element={<AllProperties />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
