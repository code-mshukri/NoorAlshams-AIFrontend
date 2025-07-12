import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, useAnimation } from 'framer-motion';
import {
    Facebook, Twitter, Instagram, Phone, Mail, MapPin, Clock,
    ArrowUp, Heart, Star, Users, Award, Sparkles, ChevronRight,
    Send, CheckCircle, Globe, Shield, Zap
} from 'lucide-react';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Make sure to import useLanguage if it's in a parent directory
// import { useLanguage } from '../../contexts/LanguageContext';


const Footer = () => {
    // Assuming a dummy t function if useLanguage is not available
    const t = (key) => key.charAt(0).toUpperCase() + key.slice(1);
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const controls = useAnimation();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, threshold: 0.1 });

    useEffect(() => {
        if (isInView) {
            controls.start('visible');
        }
    }, [controls, isInView]);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
            setEmail('');
            setTimeout(() => setIsSubscribed(false), 3000);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    const socialLinks = [
        { icon: Facebook, href: 'https://www.facebook.com/share/1FAPUeZsu7/?mibextid=wwXIfr', color: 'hover:text-blue-500', label: 'Facebook' },
        { icon: Instagram, href: 'https://www.instagram.com/noor_alshams_store?igsh=MTlidHp3MHNpeDRjOA%3D%3D&utm_source=qr', color: 'hover:text-pink-500', label: 'Instagram' }
    ];

    const stats = [
        { icon: Users, number: '1000+', label: 'عميلة سعيدة' },
        { icon: Award, number: '15', label: 'خبيرة تجميل' },
        { icon: Star, number: '4.9', label: 'تقييم العملاء' },
        { icon: Sparkles, number: '50+', label: 'خدمة متميزة' }
    ];

    

    return (
        <>
            <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                    opacity: showBackToTop ? 1 : 0,
                    scale: showBackToTop ? 1 : 0
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={scrollToTop}
                className="fixed bottom-8 left-8 z-50 bg-primary-200 text-white p-3 rounded-full shadow-lg hover:bg-primary-300 transition-colors duration-300"
            >
                <ArrowUp className="w-5 h-5" />
            </motion.button>

            <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E" )`,
                    }} />
                </div>

                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-primary-200 rounded-full opacity-20"
                            animate={{
                                y: [0, -20, 0],
                                x: [0, 10, 0],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 3 + i,
                                repeat: Infinity,
                                delay: i * 0.5,
                            }}
                            style={{
                                left: `${20 + i * 15}%`,
                                top: `${30 + i * 10}%`,
                            }}
                        />
                    ))}
                </div>

                <motion.div
                    ref={ref}
                    variants={containerVariants}
                    initial="hidden"
                    animate={controls}
                    className="relative z-10"
                >
                    

                    <div className="py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                                <motion.div variants={itemVariants} className="lg:col-span-1">
                                    <div className="flex items-center space-x-3 space-x-reverse mb-6">
                                        <div className="relative">
                                            <img
                                                src= {`${BASE_URL}/uploads//logo.png`}
                                                alt="قصر نور الشمس"
                                                className="h-16 w-16 object-contain rounded-full ring-4 ring-primary-200/20"
                                            />
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary-200 to-secondary-400 bg-clip-text text-transparent">
                                                قصر نور الشمس
                                            </h3>
                                            <p className="text-gray-400 text-sm">للجمال والعناية</p>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 mb-6 leading-relaxed">
                                        مركز متكامل للجمال والعناية بالمرأة، نقدم خدمات متميزة بأيدي خبراء متخصصين
                                        باستخدام أحدث التقنيات والمنتجات العالمية.
                                    </p>
                                    <div className="flex items-center space-x-4 space-x-reverse mb-6">
                                        <div className="flex items-center space-x-2 space-x-reverse text-green-400">
                                            <Shield className="w-4 h-4" />
                                            <span className="text-xs">معتمد</span>
                                        </div>
                                        <div className="flex items-center space-x-2 space-x-reverse text-blue-400">
                                            <Zap className="w-4 h-4" />
                                            <span className="text-xs">سريع</span>
                                        </div>
                                        <div className="flex items-center space-x-2 space-x-reverse text-yellow-400">
                                            <Star className="w-4 h-4" />
                                            <span className="text-xs">مميز</span>
                                        </div>
                                    </div>
                                    <div className="flex space-x-4 space-x-reverse">
                                        {socialLinks.map((social, index) => (
                                            <motion.a
                                                key={index}
                                                href={social.href}
                                                whileHover={{ scale: 1.2, rotate: 5 }}
                                                whileTap={{ scale: 0.9 }}
                                                className={`w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-300 ${social.color} transition-all duration-300 hover:shadow-lg hover:shadow-primary-200/25`}
                                                aria-label={social.label}
                                            >
                                                <social.icon className="w-5 h-5" />
                                            </motion.a>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* FIX: Added motion.div wrapper for animations */}
                                <motion.div variants={itemVariants}>
                                    <h3 className="text-lg font-semibold text-primary-200 mb-6">تواصل معنا</h3>
                                    <ul className="space-y-4 mb-8">
                                        <li className="flex items-start space-x-3 space-x-reverse group">
                                            <div className="w-8 h-8 bg-primary-200/20 rounded-lg flex items-center justify-center group-hover:bg-primary-200/30 transition-colors duration-200">
                                                <MapPin className="w-4 h-4 text-primary-200" />
                                            </div>
                                            <div>
                                                <p className="text-gray-300 text-sm leading-relaxed">
                                                    جنين - شارع حيفا - عمارة الفيصل
                                                </p>
                                            </div>
                                        </li>
                                        <li className="flex items-center space-x-3 space-x-reverse group">
                                            <div className="w-8 h-8 bg-primary-200/20 rounded-lg flex items-center justify-center group-hover:bg-primary-200/30 transition-colors duration-200">
                                                <Phone className="w-4 h-4 text-primary-200" />
                                            </div>
                                            <a href="tel:+972598267948" className="text-gray-300 hover:text-primary-200 transition-colors duration-200 text-sm">
                                                +972599153406
                                            </a>
                                        </li>
                                       
                                    </ul>
                                </motion.div>

                                {/* FIX: Added motion.div wrapper for animations */}
                                <motion.div variants={itemVariants}>
                                    <h3 className="text-lg font-semibold text-primary-200 mb-6">أيام العمل</h3>
                                    <div className="space-y-2 text-sm text-gray-300">
                                        <div className="flex justify-between">
                                            <span>السبت - الخميس</span>
                                            <span className="text-green-400">  10:00 ص - 16:30 م</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>الجمعة</span>
                                            <span className="text-green-400">قابل للدوام إذا كانت هناك حجوزات مسبقة فقط</span>
                                        </div>
                                    </div>
                                </motion.div>

                        
                                
                            </div>
                        </div>
                    </div>

                    <motion.div
                        variants={itemVariants}
                        className="border-t border-gray-700/50 py-8"
                    >
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                                <div className="flex items-center space-x-2 space-x-reverse text-gray-400 text-sm">
                                    <span>جميع الحقوق محفوظة &copy; 2025 قصر نور الشمس </span>
                                    
                                </div>
                                <div className="flex items-center space-x-6 space-x-reverse text-sm text-gray-400">
                                    
                                    
                                    
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </footer>
        </>
    );
};

export default Footer;
