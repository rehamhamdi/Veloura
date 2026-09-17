import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LogOut, Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react'
import { logout } from '../../features/auth/authSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dispatch = useAppDispatch()
  const isAuthenticated = Boolean(useAppSelector((state) => state.auth.token))

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 16)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function closeMenu() {
    setMenuOpen(false)
  }

  function handleLogout() {
    dispatch(logout())
    closeMenu()
  }

  return (
    <header className={`sticky top-0 z-50 transition-all ${scrolled ? 'border-b border-[#eadcd2] bg-[#faf6f0]/95 shadow-[0_6px_24px_rgba(83,55,48,.06)] backdrop-blur-md' : 'bg-[#faf6f0]'}`}>
      <nav className="mx-auto flex h-[76px] max-w-[1320px] items-center justify-between px-6 lg:px-10" aria-label="Main navigation">
        <Link className="flex items-center gap-3" to="/" aria-label="Veloura home">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#ecd5cc] font-['Playfair_Display'] text-lg text-[#79504b]">V</span>
          <span className="font-['Playfair_Display'] text-[22px] font-semibold tracking-[.02em]">Veloura</span>
        </Link>

        <div className="hidden items-center gap-8 text-[13px] font-medium text-[#735d58] lg:flex">
          <a className="transition-colors hover:text-[#a86f6b]" href="#home">Home</a>
          <a className="transition-colors hover:text-[#a86f6b]" href="#shop">Shop</a>
          <a className="transition-colors hover:text-[#a86f6b]" href="#categories">Categories</a>
          <a className="transition-colors hover:text-[#a86f6b]" href="#about">About Us</a>
        </div>

        <div className="flex items-center gap-1 text-[#624943]">
          <button className="hidden h-10 w-10 place-items-center rounded-full transition hover:bg-[#f1e3dc] sm:grid" type="button" aria-label="Search"><Search size={18} strokeWidth={1.6} /></button>
          <Link className="hidden h-10 w-10 place-items-center rounded-full transition hover:bg-[#f1e3dc] sm:grid" to="/login" aria-label="Account"><UserRound size={18} strokeWidth={1.6} /></Link>
          {isAuthenticated && <button className="hidden h-10 w-10 place-items-center rounded-full transition hover:bg-[#f1e3dc] sm:grid" type="button" onClick={handleLogout} aria-label="Log out"><LogOut size={18} strokeWidth={1.6} /></button>}
          <button className="relative grid h-10 w-10 place-items-center rounded-full transition hover:bg-[#f1e3dc]" type="button" aria-label="Shopping bag"><ShoppingBag size={18} strokeWidth={1.6} /><span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#76504c] px-1 text-[9px] font-bold text-white">0</span></button>
          <button className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-[#f1e3dc] lg:hidden" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X size={21} strokeWidth={1.6} /> : <Menu size={21} strokeWidth={1.6} />}</button>
        </div>
      </nav>

      {menuOpen && <div className="border-t border-[#eadcd2] bg-[#faf6f0] px-6 py-5 lg:hidden">
        <div className="flex flex-col gap-4 text-sm text-[#735d58]">
          <a href="#home" onClick={closeMenu}>Home</a>
          <a href="#shop" onClick={closeMenu}>Shop</a>
          <a href="#categories" onClick={closeMenu}>Categories</a>
          <a href="#about" onClick={closeMenu}>About Us</a>
          <Link to="/login" onClick={closeMenu}>Account</Link>
          {isAuthenticated && <button className="text-left" type="button" onClick={handleLogout}>Log out</button>}
        </div>
      </div>}
    </header>
  )
}

export default Navbar
