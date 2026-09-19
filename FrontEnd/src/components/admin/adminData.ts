import { BadgePercent, LayoutDashboard, Mail, Package, ShoppingBag, Store, Users } from 'lucide-react'

export const navigation = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Products', icon: Package },
  { label: 'Discounts', icon: BadgePercent },
  { label: 'Orders', icon: ShoppingBag },
  { label: 'Contacts', icon: Mail },
]

export const stats = [
  { label: 'Total sales', value: '$24,680', change: '+12.8%', icon: Store, tone: 'bg-[#f3e4dc] text-[#a86f6b]' },
  { label: 'Total orders', value: '1,284', change: '+8.2%', icon: ShoppingBag, tone: 'bg-[#eee8dc] text-[#9a7b52]' },
  { label: 'Total products', value: '186', change: '+4.6%', icon: Package, tone: 'bg-[#e7eee8] text-[#698674]' },
  { label: 'Total customers', value: '8,549', change: '+16.4%', icon: Users, tone: 'bg-[#e9e3ed] text-[#806786]' },
]

export const products = [
  { name: 'Cloud Milk Cleanser', category: 'Cleansers', sold: '428 units', revenue: '$8,988', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=160&q=85' },
  { name: 'Dew Drop Serum', category: 'Serums', sold: '361 units', revenue: '$10,108', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=160&q=85' },
  { name: 'Petal Soft Cream', category: 'Moisturizers', sold: '284 units', revenue: '$7,384', image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=160&q=85' },
]

export const orders = [
  { id: '#VL-4829', customer: 'Amelia Rose', initials: 'AR', date: 'Today, 10:24 AM', total: '$128.00', status: 'Processing' },
  { id: '#VL-4828', customer: 'Sofia Bennett', initials: 'SB', date: 'Today, 09:12 AM', total: '$84.50', status: 'Shipped' },
  { id: '#VL-4827', customer: 'Olivia James', initials: 'OJ', date: 'Yesterday, 04:38 PM', total: '$216.00', status: 'Delivered' },
  { id: '#VL-4826', customer: 'Emma Williams', initials: 'EW', date: 'Yesterday, 01:05 PM', total: '$62.00', status: 'Cancelled' },
]