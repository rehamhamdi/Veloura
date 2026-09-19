import { useState } from 'react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { Plus, Minus } from 'lucide-react';

// دي البيانات بتاعة القوايم مجهزة ومكتوبة بستايل الموقع
const accordionData = [
  {
    title: "Our Commitment to Diversity and Inclusivity",
    content: "At Veloura, we celebrate diversity and believe that beauty comes in all shapes, sizes, and shades. Our collection caters to individuals of all skin types, tones, and concerns, ensuring that everyone can find products that suit their unique needs."
  },
  {
    title: "Quality and Efficacy",
    content: "We source only the finest ingredients to ensure our products deliver visible, lasting results without compromising your skin's natural health."
  },
  {
    title: "Personalized Solutions",
    content: "Every skin is unique. Our curated ranges allow you to build a routine that targets your specific concerns effectively and gently."
  },
  {
    title: "Expert Guidance and Support",
    content: "Our team of skincare enthusiasts is always here to help you navigate our collection and find exactly what your skin craves."
  }
];

export default function About() {
  // بنستخدم State عشان نعرف انهي قايمة اللي مفتوحة دلوقتي (رقم 0 هي أول واحدة)
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-[#f8f3ed] px-6 py-12 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-[1160px]">
        
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          
          {/* النص اللي على الشمال: رسالة الترحيب */}
          <div>
            <h1 className="mb-6 font-['Playfair_Display'] text-3xl font-bold text-[#422f2c] sm:text-4xl">
              Welcome to Veloura
            </h1>
            <p className="text-[15px] leading-[1.8] text-[#806967]">
              Welcome to Veloura, your premier destination for mindful skincare and radiant beauty. 
              Our mission is to provide thoughtfully crafted routines designed to meet the diverse needs of your skin. 
              We believe in fewer, better products that offer personalized solutions for a healthy-looking, glowing complexion.
            </p>
          </div>

          {/* النص اللي على اليمين: القايمة التفاعلية (Accordion) مكان المستطيل الأبيض */}
          <div className="flex flex-col border border-[#eadcd2] bg-[#fffdf9]">
            {accordionData.map((item, index) => (
              <div key={index} className="border-b border-[#eadcd2] last:border-0">
                <button
                  onClick={() => toggleAccordion(index)}
                  className="flex w-full items-center gap-3 bg-transparent px-5 py-4 text-left font-bold text-[#422f2c] transition hover:bg-[#f1e3dc]"
                >
                  {openIndex === index ? <Minus size={18} /> : <Plus size={18} />}
                  {item.title}
                </button>
                
                {/* الجزء ده بيظهر بس لو القايمة دي هي اللي مفتوحة */}
                {openIndex === index && (
                  <div className="px-5 pb-5 pt-1 text-[14px] leading-relaxed text-[#806967]">
                    {item.content}
                  </div>
                )}
              </div>
            ))}
          </div>
          
        </div>

        {/* الجزء السفلي: السوشيال ميديا ورسالة الشكر */}
        <div className="mt-20 flex flex-col items-center border-t border-[#eadcd2] pt-16 text-center">
          
          <div className="mb-10 flex items-center gap-6">
            <span className="font-bold text-[#422f2c]">Follow us on</span>
            <div className="flex gap-3">
              <a href="#" className="grid h-10 w-10 place-items-center rounded bg-black text-white transition hover:bg-[#a86f6b]">
                <FaFacebook size={18} />
              </a>
              <a href="#" className="grid h-10 w-10 place-items-center rounded bg-black text-white transition hover:bg-[#a86f6b]">
                <FaInstagram size={18} />
              </a>
            </div>
          </div>

          <h2 className="mb-6 font-['Playfair_Display'] text-2xl font-bold text-[#422f2c] sm:text-3xl">
            Thank You for Choosing Veloura
          </h2>
          <p className="max-w-[800px] text-[15px] leading-[1.8] text-[#806967]">
            Thank you for choosing Veloura as your trusted partner in your self-care journey. 
            We're honored to be a part of your beauty and wellness routine, and we look forward to helping you 
            unleash your natural beauty and embrace your best self. Experience the Veloura difference today!
          </p>

        </div>

      </div>
    </main>
  );
}