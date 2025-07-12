import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background font-arabic" dir="rtl">
      <Header />

      <main className="py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
        <div className="max-w-7xl w-full">
          {/* Page Header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl font-bold text-primary-600 mb-4 leading-tight">
              قصر نور الشمس
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              نحن ملتزمون بتقديم أفضل خدمات التجميل والعناية الشخصية في بيئة مريحة وفاخرة
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-400 to-primary-600 mx-auto rounded-full shadow-lg"></div>
          </div>



          {/* Section 1 */}
          <div className="flex justify-center mb-40">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-40 animate-fade-in-up max-w-4xl w-full">

              {/* Image + Caption */}
              <div className="flex flex-col items-center">
                <div className="relative w-[400px] h-[550px] overflow-hidden rounded-2xl shadow-xl">
                  <img
                    src={`${BASE_URL}/uploads/Ayat.jpg`}
                    alt="نبذة عن مركزنا"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <p className="mt-4 text-lg font-semibold text-primary-700">خبيرة البشرة آيات جلاد</p>
              </div>

              {/* Text Content */}
              <div className="text-right">
                <h2 className="text-3xl sm:text-4xl font-bold text-primary-700 mb-4 leading-tight">نبذة عن مركزنا</h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  قصر نور الشمس هو مركز للعناية بالمرأة افتُتِح عام 2021 على يد الأُختين آيات وميس النصرة امتداداً لمتجر نور الشمس. حيث يقدم قصر نور الشمس خدمات عالية الجودة لمختلف المقاصد كالخدمات العلاجية والخدمات الوقائية وخدمات التجميل في مختلف الأقسام مثل قسم العناية بالبشرة، العناية بالشعر، العناية بالأظافر، قسم الليزر و قسم تجهيز العرائس.
                </p>
              </div>

            </div>
          </div>


          {/* Section 2 */}
          <div className="flex justify-center mb-40">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-40 animate-fade-in-up max-w-4xl w-full">
              <div className="relative w-[2000px] h-[500px] overflow-hidden rounded-2xl shadow-xl">
                <img src={`${BASE_URL}/uploads/AmericanBoard.jpg`} alt="إدارة مركزنا" className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
              </div>
              <div className="text-right">
                <h2 className="text-3xl sm:text-4xl font-bold text-primary-700 mb-4 leading-tight">إدارة مركزنا</h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  يدار قصر نور الشمس من قبل آيات خبيرة البشرة آيات جلاد الحاصلة على شهادة دبلوم في العناية بالبشرة في جامعة العقبة للعلوم والتكنولولجيا، والحاصلة أيضاً علة شهادة اعتماد من البورد الأمريكي في العناية بالبشرة، والعديد من شهادات الامتياز والاعتمادات الأخرى. كما وقامت بالإشراف على العديد من الدورات التدريبية في مجال العناية بالبشرة، ومنها دورات ‘إعداد خبيرة بشرة‘ التي تعقد حالياً في مركزنا.
                </p>
              </div>
            </div>
          </div>

          {/* Title Between Sections */}
          <div className="text-center my-12">
            <h2 className="text-4xl font-bold text-primary-700">أقسام مركزنا</h2>
          </div>

          {/* Section 3 */}
          <div className="flex justify-center mb-40">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-40 animate-fade-in-up max-w-4xl w-full">
              <div className="relative w-[590px] h-[690px] overflow-hidden rounded-2xl shadow-xl">
                <img src={`${BASE_URL}/uploads/NailsSection.jpg`} alt="قسم الأظافر" className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
              </div>
              <div className="text-right">
                <h2 className="text-3xl sm:text-4xl font-bold text-primary-700 mb-4 leading-tight">قسم الأظافر</h2>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="flex justify-center mb-40">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-40 animate-fade-in-up max-w-4xl w-full">
              <div className="relative w-[590px] h-[690px] overflow-hidden rounded-2xl shadow-xl">
                <img src={`${BASE_URL}/uploads/LaserSection.jpg`} alt="قسم الليزر" className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
              </div>
              <div className="text-right">
                <h2 className="text-3xl sm:text-4xl font-bold text-primary-700 mb-4 leading-tight">قسم الليز</h2>
              </div>
            </div>
          </div>

          {/* Section 6 */}
          <div className="flex justify-center mb-40 px-0">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-20 animate-fade-in-up" style={{ width: 'fit-content' }}>

              <div className="relative" style={{ width: '880px', height: '690px' }}>
                <img
                  src={`${BASE_URL}/uploads/SkinSection.jpg`}
                  alt=" قسم البشرة"
                  className="w-full h-full object-cover rounded-2xl shadow-xl transition-transform duration-300 hover:scale-105"
                />
              </div>

              <div className="text-right ml-8 lg:ml-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-primary-700 mb-4 leading-tight">قسم البشرة</h2>
              </div>

            </div>
          </div>


          {/* Section 6 */}
          <div className="flex justify-center mb-40 px-0">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-20 animate-fade-in-up" style={{ width: 'fit-content' }}>

              <div className="relative" style={{ width: '690px', height: '690px' }}>
                <img
                  src={`${BASE_URL}/uploads/HairSection.jpg`}
                  alt=" قسم الشعر"
                  className="w-full h-full object-cover rounded-2xl shadow-xl transition-transform duration-300 hover:scale-105"
                />
              </div>

              <div className="text-right ml-8 lg:ml-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-primary-700 mb-4 leading-tight">قسم الشعر</h2>
              </div>

            </div>
          </div>


          {/* Section 7 */}
          <div className="flex justify-center mb-40 px-0">
            <div className="flex flex-col lg:flex-row-reverse items-center gap-20 animate-fade-in-up" style={{ width: 'fit-content' }}>

              <div className="relative" style={{ width: '790px', height: '690px' }}>
                <img
                  src={`${BASE_URL}/uploads/ProductsSection.jpg`}
                  alt=" قسم المنتجات"
                  className="w-full h-full object-cover rounded-2xl shadow-xl transition-transform duration-300 hover:scale-105"
                />
              </div>

              <div className="text-right ml-8 lg:ml-16">
                <h2 className="text-3xl sm:text-4xl font-bold text-primary-700 mb-4 leading-tight">قسم المنتجات</h2>
              </div>

            </div>
          </div>



        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
