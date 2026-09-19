

import { Navigate, Route, Routes } from 'react-router-dom'
import WebsiteLayout from './layouts/WebsiteLayout'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import AdminDashboard from './pages/Admin/pages/AdminDashboard'
import AdminOrders from './pages/Admin/pages/AdminOrders'
import AdminProducts from './pages/Admin/pages/AdminProducts'
import AdminDiscounts from './pages/Admin/pages/AdminDiscounts'
import AdminContacts from './pages/Admin/pages/AdminContacts'
import { RequireAuth, RequireGuest, RequireRole } from './middleware/routeGuards'
import Products from './pages/Products/Products'; 
import Contact from './pages/Contact/Contact';
import About from'./pages/About/About';
import Categories from './pages/Categories/Categories';
function App() {
  return (
    <Routes>
      <Route element={<WebsiteLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} /> 
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
          <Route path="/admin/discounts" element={<AdminDiscounts />} />
          <Route path="/admin/categories" element={<Navigate to="/admin/discounts" replace />} />
          <Route path="/admin/contacts" element={<AdminContacts />} />
          <Route path="/admin/customers" element={<Navigate to="/admin/contacts" replace />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/register" replace />} />
    </Routes>
  )
}

export default App
