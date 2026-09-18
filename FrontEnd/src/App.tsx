

import { Navigate, Route, Routes } from 'react-router-dom'
import WebsiteLayout from './layouts/WebsiteLayout'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import AdminDashboard from './pages/Admin/pages/AdminDashboard'
import AdminOrders from './pages/Admin/pages/AdminOrders'
import AdminProducts from './pages/Admin/pages/AdminProducts'
import AdminCategories from './pages/Admin/pages/AdminCategories'
import AdminCustomers from './pages/Admin/pages/AdminCustomers'
import { RequireAuth, RequireGuest, RequireRole } from './middleware/routeGuards'
import Products from './pages/Products/Products'; 
import Contact from './pages/Contact/Contact';
import About from'./pages/About/About';
import Categories from './pages/Categories/Categories';
import Cart from './pages/Cart/Cart';
import Wishlist from './pages/Wishlist/Wishlist'
function App() {
  return (
    <Routes>
      <Route element={<WebsiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} /> 
        <Route path="/cart" element={<Cart />} /> 
        <Route path="/wishlist" element={<Wishlist />} /> 
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/categories" element={<Categories />} />
      </Route>
      <Route element={<RequireGuest />}>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<RequireAuth />}>
        <Route element={<RequireRole allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/register" replace />} />
    </Routes>
  )
}

export default App
