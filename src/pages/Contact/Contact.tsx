import { FaFacebook, FaInstagram } from 'react-icons/fa';
export default function Contact() {
  return (
    <main className="min-h-screen bg-[#f8f3ed] px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-[1160px]">
        
        {/* 1. عنوان الصفحة وتحته خط رفيع شيك */}
        <h1 className="mb-12 border-b border-[#eadcd2] pb-6 text-center font-['Playfair_Display'] text-4xl text-[#422f2c]">
          Contact Us
        </h1>
        
        {/* 2. الحاوية اللي هتقسم الصفحة نصين (عمودين على الكمبيوتر، وعمود واحد على الموبايل) */}
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          
          {/* النص الأول: مكان الفورم */}
          {/* ================= النص الأول: الفورم ================= */}
          <div>
        <form className="flex flex-col gap-6">
              
              {/* حقل الاسم (أول وأخير) */}
              <div>
                <label className="mb-2 block text-[13px] font-semibold text-[#5b4240]">Name <span className="text-red-500">*</span></label>
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <input type="text" placeholder="First name" className="box-border h-[50px] w-full rounded-[13px] border border-[#e3d2c8] bg-[#fffdf9] px-4 text-sm text-[#3b2a29] outline-none placeholder:text-[#b5a09a] focus:border-[#b9827e] focus:ring-[3px] focus:ring-[rgba(185,130,126,.15)]" required />
                  </div>
                  <div className="w-1/2">
                    <input type="text" placeholder="Last name" className="box-border h-[50px] w-full rounded-[13px] border border-[#e3d2c8] bg-[#fffdf9] px-4 text-sm text-[#3b2a29] outline-none placeholder:text-[#b5a09a] focus:border-[#b9827e] focus:ring-[3px] focus:ring-[rgba(185,130,126,.15)]" required />
                  </div>
                </div>
              </div>

              {/* حقل الإيميل */}
              <div>
                <label className="mb-2 block text-[13px] font-semibold text-[#5b4240]">Email address <span className="text-red-500">*</span></label>
                <input type="email" placeholder="you@example.com" className="box-border h-[50px] w-full rounded-[13px] border border-[#e3d2c8] bg-[#fffdf9] px-4 text-sm text-[#3b2a29] outline-none placeholder:text-[#b5a09a] focus:border-[#b9827e] focus:ring-[3px] focus:ring-[rgba(185,130,126,.15)]" required />
              </div>

              {/* حقل الرسالة */}
              <div>
                <label className="mb-2 block text-[13px] font-semibold text-[#5b4240]">Comment or Message</label>
                <textarea rows={5} placeholder="Your message here..." className="box-border w-full rounded-[13px] border border-[#e3d2c8] bg-[#fffdf9] p-4 text-sm text-[#3b2a29] outline-none placeholder:text-[#b5a09a] focus:border-[#b9827e] focus:ring-[3px] focus:ring-[rgba(185,130,126,.15)]"></textarea>
              </div>

              {/* زرار الإرسال */}
              <button type="submit" className="mt-2 h-[50px] rounded-[13px] border-0 bg-[#6d4946] text-[13px] font-bold text-[#fffaf5] shadow-[0_8px_18px_rgba(109,73,70,.18)] transition hover:-translate-y-px hover:bg-[#583a38]">
                Submit Message <span className="ml-2 text-[17px]" aria-hidden="true">→</span>
              </button>
            </form>
          </div>

         {/* ================= النص التاني: بيانات التواصل ================= */}
          <div className="flex flex-col gap-10">
            
            {/* الإيميل والواتساب */}
            <div>
              <h2 className="mb-6 font-['Playfair_Display'] text-xl uppercase tracking-widest text-[#422f2c]">Contact</h2>
              <div className="flex flex-col gap-4 text-[15px] text-[#493331]">
                <p><span className="font-bold">Email:</span> glowtheraonlinetrading@gmail.com</p>
                <p><span className="font-bold">Whatsapp:</span> 01103400746</p>
              </div>
            </div>

            {/* روابط سريعة */}
            <div>
              <h2 className="mb-5 font-['Playfair_Display'] text-xl font-bold text-[#422f2c]">Quick Links</h2>
              <div className="flex flex-col gap-3 text-sm text-[#806967]">
                <a href="#" className="transition hover:text-[#422f2c]">Privacy Policy</a>
                <a href="#" className="transition hover:text-[#422f2c]">Refund and Returns Policy</a>
                <a href="#" className="transition hover:text-[#422f2c]">Shipping & Delivery Policy</a>
              </div>
            </div>

           
           {/* أيقونات السوشيال ميديا الحقيقية */}
            <div className="flex gap-4">
              <a href="#" className="text-[#422f2c] transition hover:text-[#a86f6b]">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-[#422f2c] transition hover:text-[#a86f6b]">
                <FaInstagram size={20} />
              </a>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}