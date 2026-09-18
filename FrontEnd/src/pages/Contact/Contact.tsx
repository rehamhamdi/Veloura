import { useState } from 'react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { ArrowRight} from 'lucide-react';
export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    firstName: '',
    email: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // مسح الإيرور بمجرد ما اليوزر يكتب
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newErrors = { firstName: '', email: '', message: '' };
    let isValid = true;

    // التحقق من الاسم الأول
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }

    // التحقق من الإيميل
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // التحقق من الرسالة
    if (!formData.message.trim()) {
      newErrors.message = 'Please enter your message';
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      // هنا المفروض نبعت الداتا للباك إند، بس مؤقتاً هنظهر رسالة النجاح
      setIsSubmitted(true);
      setFormData({ firstName: '', lastName: '', email: '', message: '' }); // تفريغ الفورمة
      
      // إخفاء رسالة النجاح بعد 5 ثواني
      setTimeout(() => setIsSubmitted(false), 5000);
    }
  };

  return (
    <main className="bg-[#f8f3ed] min-h-screen px-6 py-12 lg:px-10">
      <div className="mx-auto max-w-[1100px]">
        
        {/* عنوان الصفحة */}
        <div className="text-center mb-16">
          <h1 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-[#422f2c]">Contact Us</h1>
          <div className="h-px w-full bg-[#eadcd2] mt-10"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* العمود الأيسر: الفورمة */}
          <div>
            {isSubmitted && (
              <div className="mb-6 rounded-lg bg-green-50 p-4 text-green-800 border border-green-200">
                Thank you! Your message has been sent successfully. We will get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* حقل الاسم */}
              <div>
                <label className="block text-sm font-medium text-[#422f2c] mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full rounded-xl border ${errors.firstName ? 'border-red-500' : 'border-[#eadcd2]'} bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a86f6b]`}
                    />
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[#eadcd2] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a86f6b]"
                  />
                </div>
              </div>

              {/* حقل الإيميل */}
              <div>
                <label className="block text-sm font-medium text-[#422f2c] mb-2">
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full rounded-xl border ${errors.email ? 'border-red-500' : 'border-[#eadcd2]'} bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a86f6b]`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* حقل الرسالة */}
              <div>
                <label className="block text-sm font-medium text-[#422f2c] mb-2">
                  Comment or Message
                </label>
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full rounded-xl border ${errors.message ? 'border-red-500' : 'border-[#eadcd2]'} bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a86f6b] resize-none`}
                ></textarea>
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>

              {/* زرار الإرسال */}
              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#674d47] px-8 py-3.5 text-sm font-bold text-white transition hover:bg-[#523d38] w-full sm:w-auto"
              >
                Submit Message <ArrowRight size={18} />
              </button>
            </form>
          </div>

          {/* العمود الأيمن: بيانات التواصل والروابط */}
          <div className="space-y-10 lg:pl-10">
            
            <div>
              <h2 className="font-['Playfair_Display'] text-2xl tracking-widest text-[#422f2c] mb-6 uppercase">Contact</h2>
              <div className="space-y-4 text-[#422f2c]">
                <p><strong className="font-semibold">Email:</strong> velora@gmail.com</p>
                <p><strong className="font-semibold">Whatsapp:</strong> 01103400746</p>
              </div>
            </div>

            <div>
              <h2 className="font-['Playfair_Display'] text-2xl tracking-wide text-[#422f2c] mb-6">Quick Links</h2>
              <ul className="space-y-4 text-sm text-[#735d58]">
                <li><a href="#" className="hover:text-[#a86f6b] transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#a86f6b] transition">Refund and Returns Policy</a></li>
                <li><a href="#" className="hover:text-[#a86f6b] transition">Shipping & Delivery Policy</a></li>
              </ul>
            </div>

            <div className="flex gap-4 pt-2">
              <a href="#" className="text-[#422f2c] hover:text-[#a86f6b] transition">
                <FaFacebook size={24} />
              </a>
              <a href="#" className="text-[#422f2c] hover:text-[#a86f6b] transition">
                <FaInstagram size={24} />
              </a>
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}