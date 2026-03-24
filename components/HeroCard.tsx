import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { SlideData } from "@/types/types";
import { ShoppingBag, Coffee, PhoneCall, ArrowRight } from "lucide-react";
import { RichText } from "./RichText";


export default function HeroCard({ data }: { data: SlideData }) {
  const { 
    name, 
    productImage, 
    productDescription, 
    categoryImage, 
    categoryDescription, 
    categoryCta,
    category 
  } = data;
  
  const iconMap: Record<string, React.ReactNode> = {
    order: <ShoppingBag className="w-5 h-5" />,
    drink: <Coffee className="w-5 h-5" />,
    contact: <PhoneCall className="w-5 h-5" />,
  };

  return (
    <div className="flex justify-center items-stretch w-full max-w-[1500px] mx-auto px-4 md:px-16 py-8 md:py-16 h-full box-border max-md:pt-[46vw]">
      <div className="grid grid-cols-2 gap-0 self-center w-full h-full p-4 md:p-12 overflow-hidden max-md:flex max-md:flex-col max-md:justify-center max-md:items-center max-md:gap-[3.8vw] max-md:h-auto max-md:overflow-visible relative">
        
        {/* Left Content - Category Area */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: false }}
          className="z-10 flex flex-col justify-end items-start w-full min-w-0 relative max-md:items-center max-md:justify-center max-md:text-center p-2"
        >
          
          <div className="text-left w-full max-w-[500px] mb-8 max-md:text-center max-md:mb-0 relative">
            <h1 className="text-[6vw] leading-[0.75] xl:text-[5.5em] max-md:text-[9.6vw] font-extrabold break-words hyphens-auto max-md:leading-[0.8] mb-4 tracking-[-0.02em]">
              {categoryDescription}
            </h1>

            <div className="relative">
              {categoryCta && (
                <div className="flex flex-row items-center gap-3 mt-3 max-md:flex-col max-md:items-center max-md:gap-[1vw] flex-wrap">
                  <span className="text-[#333333] font-normal uppercase tracking-widest text-[1rem] font-rokkitt max-md:text-[3.8vw]">
                    {categoryCta.text}
                  </span>
                  <Link 
                    href={categoryCta.href}
                    className="flex items-center gap-3 bg-white/50 border border-brand-brown/20 text-brand-brown px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer no-underline shadow-sm"
                  >
                    {iconMap[categoryCta.iconType]}
                    {categoryCta.label}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Category Image as Background */}
          {categoryImage && (
            <div className="absolute left-[-5%] bottom-[25%] -z-10 w-[30vw] max-w-[500px] opacity-30 max-md:hidden">
              <Image
                src={categoryImage}
                alt={typeof category === 'object' ? category.name : "Kategória"}
                width={500}
                height={500}
                className="w-full h-full object-contain object-top"
              />
            </div>
          )}
        </motion.div>

        {/* Right Content - Product Image and Description Area */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: false }}
          className="flex flex-col justify-end items-end min-w-0 relative max-md:items-center max-md:justify-center max-md:w-full p-2"
        >

          {/* Product Image */}
          {(productImage || data.image) && (
            <div className="w-full max-w-[800px] h-auto relative z-[1] max-md:w-[70vw] max-md:min-w-0 max-md:max-w-[400px] max-md:mt-4">
              <Image
                src={productImage || data.image}
                alt={name}
                width={800}
                height={800}
                className="w-full h-full object-contain max-md:object-center drop-shadow-2xl"
              />
            </div>
          )}
          
          {/* Product Description */}
          <div className="z-[2] text-right mt-12 mb-8 relative max-md:text-center max-md:w-full max-md:mx-auto max-md:mt-[3.8vw] max-md:mb-[15.4vw] max-md:px-[3.8vw]">
            <h2 className="text-[32px] font-bold leading-[36px] mb-2.5 max-md:text-[5.8vw] max-md:leading-[1.1]">
              <strong>{name}</strong>
            </h2>
            {/* admin/termekek 5 (Product Description) */}
            <div className="text-right ml-auto max-w-[35vw] text-[1.2vw] leading-[1.3em] opacity-70 max-md:text-center max-md:mx-auto max-md:max-w-[85vw] max-md:text-[3.5vw] italic">
              <RichText content={productDescription} />
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
