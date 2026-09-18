import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

// دي شكل الداتا المبدئية للقسم، هنعدلها لو الباك إند مسمي الحقول حاجة تانية
interface Category {
  id: number;
  name: string; // ممكن تكون title في الباك إند
  description?: string;
  image?: string; // أو ممكن تكون مصفوفة زي المنتجات
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // شيكي في الـ Swagger لو اسم الـ Endpoint مختلف عن Category
        const response = await api.get('Category'); 
        
        // طبعنا الداتا هنا عشان لو الصور مظهرتش، نفتح الكونسول ونشوف مسارها
        console.log("Categories Response:", response.data);

        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        } else if (response.data && Array.isArray(response.data.$values)) {
          setCategories(response.data.$values);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f3ed]">
        <div className="text-2xl font-['Playfair_Display'] text-[#79504b] animate-pulse">
          Loading Categories...
        </div>
      </div>
    );
  }

  return (
    <main className="bg-[#f8f3ed] min-h-screen px-6 py-12 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-[1320px]">
        
        <div className="text-center mb-16">
          <h1 className="font-['Playfair_Display'] text-4xl lg:text-5xl text-[#422f2c] mb-4">Shop by Category</h1>
          <p className="text-[#806967] text-sm max-w-md mx-auto">Explore our curated collections for your specific skincare needs.</p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-20 text-lg text-[#735d58]">
            No categories found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link 
                to="/products" // ممكن بعدين نعدلها تفلتر المنتجات بالقسم ده
                key={category.id} 
                className="group cursor-pointer flex flex-col items-center text-center"
              >
                <div className="relative w-full h-[350px] mb-6 overflow-hidden rounded-[24px] bg-[#e9d2c5]">
                  <img 
                    // لو مسار الصورة راجع Object زي المنتجات، هنعدل السطر ده
                    src={category.image || 'https://images.unsplash.com/photo-1615397323190-25e2e850b555?auto=format&fit=crop&w=700&q=80'} 
                    alt={category.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-['Playfair_Display'] text-2xl text-[#493331] transition-colors group-hover:text-[#a86f6b]">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}