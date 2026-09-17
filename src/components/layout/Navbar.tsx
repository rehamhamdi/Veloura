import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Search, ShoppingBag, UserRound, X } from 'lucide-react'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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

  return (
    <header className={`sticky top-0 z-50 transition-all ${scrolled ? 'border-b border-[#eadcd2] bg-[#faf6f0]/95 shadow-[0_6px_24px_rgba(83,55,48,.06)] backdrop-blur-md' : 'bg-[#faf6f0]'}`}>
      <nav className="mx-auto flex h-[76px] max-w-[1320px] items-center justify-between px-6 lg:px-10" aria-label="Main navigation">
        <Link className="flex items-center gap-3" to="/" aria-label="Veloura home">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#ecd5cc] font-['Playfair_Display'] text-lg text-[#79504b]">V</span>
          <span className="font-['Playfair_Display'] text-[22px] font-semibold tracking-[.02em]">Veloura</span>
        </Link>

        <div className="hidden items-center gap-8 text-[13px] font-medium text-[#735d58] lg:flex">
          <Link className="transition-colors hover:text-[#a86f6b]" to="/">Home</Link>
          <Link className="transition-colors hover:text-[#a86f6b]" to="/products">Products</Link>
          <Link className="transition-colors hover:text-[#a86f6b]" to="/categories">Categories</Link>
          <Link className="transition-colors hover:text-[#a86f6b]" to="/about">About Us</Link>
          <Link className="transition-colors hover:text-[#a86f6b]" to="/contact">Contact Us</Link>
        </div>

        <div className="flex items-center gap-1 text-[#624943]">
{/* أيقونة البحث ومربع البحث (Search) */}
          <div className="relative flex items-center">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-[#422f2c] transition-colors hover:text-[#a86f6b] outline-none"
            >
              <Search size={20} />
            </button>

            {/* المربع اللي بيظهر لما نضغط على الأيقونة */}
            {isSearchOpen && (
              <div className="absolute right-0 top-full z-50 mt-5 w-64 md:w-72 overflow-hidden rounded-[16px] border border-[#eadcd2] bg-[#fffdf9] p-2 shadow-[0_8px_24px_rgba(83,55,48,.12)]">
                <div className="flex items-center rounded-xl bg-[#f8f3ed] px-3 py-2.5">
                  <Search size={16} className="text-[#a86f6b]" />
                  <input 
                    type="text" 
                    placeholder="Search Veloura..." 
                    className="ml-3 w-full bg-transparent text-[13px] text-[#422f2c] outline-none placeholder:text-[#b5a09a]"
                    autoFocus
                  />
                </div>
              </div>
            )}
          </div>          <Link className="hidden h-10 w-10 place-items-center rounded-full transition hover:bg-[#f1e3dc] sm:grid" to="/login" aria-label="Account"><UserRound size={18} strokeWidth={1.6} /></Link>
          <button className="relative grid h-10 w-10 place-items-center rounded-full transition hover:bg-[#f1e3dc]" type="button" aria-label="Shopping bag"><ShoppingBag size={18} strokeWidth={1.6} /><span className="absolute right-0.5 top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#76504c] px-1 text-[9px] font-bold text-white">0</span></button>
          <button className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-[#f1e3dc] lg:hidden" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X size={21} strokeWidth={1.6} /> : <Menu size={21} strokeWidth={1.6} />}</button>
        </div>
      </nav>

      {menuOpen && <div className="border-t border-[#eadcd2] bg-[#faf6f0] px-6 py-5 lg:hidden">
        <div className="flex flex-col gap-4 text-sm text-[#735d58]">
          <Link to="/" onClick={closeMenu}>Home</Link>
          <a href="#shop" onClick={closeMenu}>Shop</a>
          <a href="#categories" onClick={closeMenu}>Categories</a>
          <a href="#about" onClick={closeMenu}>About Us</a>
          <Link to="/login" onClick={closeMenu}>Account</Link>
        </div>
      </div>}
    </header>
  )
}

export default Navbar
