import { useState } from 'react'
import type { FormEvent } from 'react'
import { AtSign, Camera, PinIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (email.trim()) setSubscribed(true)
  }

  return (
    <footer id="footer" className="bg-[#422f2c] px-6 pb-7 pt-16 text-[#f8e9e1] lg:px-10 lg:pt-20">
      <div className="mx-auto max-w-[1160px]">
        <div className="grid gap-12 border-b border-[#755852] pb-14 md:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div>
            <Link className="font-['Playfair_Display'] text-3xl" to="/">Veloura</Link>
            <p className="mt-5 max-w-[270px] text-sm leading-[1.8] text-[#d8bdb3]">Thoughtful skincare for softer rituals and naturally radiant days.</p>
            <div className="mt-6 flex gap-3">
              <a className="grid h-9 w-9 place-items-center rounded-full border border-[#8b6860] transition hover:bg-[#76504c]" href="#footer" aria-label="Instagram"><Camera size={16} /></a>
              <a className="grid h-9 w-9 place-items-center rounded-full border border-[#8b6860] transition hover:bg-[#76504c]" href="#footer" aria-label="Facebook"><AtSign size={16} /></a>
              <a className="grid h-9 w-9 place-items-center rounded-full border border-[#8b6860] transition hover:bg-[#76504c]" href="#footer" aria-label="Pinterest"><PinIcon size={16} /></a>
            </div>
          </div>
          <FooterColumn title="Quick links" links={['Home', 'Shop', 'About Us', 'Contact']} />
          <FooterColumn title="Customer care" links={['Shipping', 'Returns', 'FAQ', 'Privacy Policy']} />
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[.18em] text-[#e6c7bc]">Stay in the ritual</h3>
            <p className="mt-4 text-sm leading-[1.7] text-[#d8bdb3]">Notes on skin, self-care, and new Veloura arrivals.</p>
            <form className="mt-5 flex border-b border-[#8b6860] pb-2" onSubmit={handleNewsletterSubmit}>
              <input className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#b8958c]" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email address" aria-label="Email address" required />
              <button className="text-[12px] font-bold text-[#f3d9d0]" type="submit">Subscribe</button>
            </form>
            {subscribed && <p className="mt-3 text-xs text-[#d6e5c9]" role="status">You're on the list. Welcome to the ritual.</p>}
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-6 text-[11px] text-[#b8958c] sm:flex-row sm:items-center sm:justify-between"><span>© 2026 Veloura. All rights reserved.</span><span>Made for your everyday ritual.</span></div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return <div><h3 className="text-[11px] font-bold uppercase tracking-[.18em] text-[#e6c7bc]">{title}</h3><div className="mt-5 grid gap-3 text-sm text-[#d8bdb3]">{links.map((link) => <a className="transition hover:text-white" href={link === 'Home' ? '#home' : link === 'Shop' ? '#shop' : link === 'About Us' ? '#about' : '#footer'} key={link}>{link}</a>)}</div></div>
}

export default Footer
