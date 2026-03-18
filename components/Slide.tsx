"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface SlideProps {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
}

export default function Slide({ name, description, image }: SlideProps) {
  return (
    <div className="w-full h-full relative overflow-hidden">
      <div className="flex justify-center items-stretch w-full max-w-[1900px] mx-auto px-4 md:px-16 py-8 md:py-16 h-full box-border max-md:pt-20">
        <div className="grid grid-cols-2 gap-12 self-center w-full h-full p-4 md:p-12 overflow-hidden max-md:flex max-md:flex-col max-md:justify-center max-md:items-center max-md:gap-4 max-md:h-auto max-md:overflow-visible">
          
          {/* Left Content - Title Area */}
          <motion.div 
            initial={{ x: -10 }}
            whileInView={{ x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: false }}
            className="z-10 flex flex-col justify-end items-start w-full min-w-0 relative max-md:items-center max-md:justify-center max-md:text-center max-md:mb-4"
          >
            <div className="text-left w-full max-w-[500px] mb-8 max-md:text-center max-md:mb-0">
              <h1 className="text-[6.5vw] leading-[0.8] xl:text-[7em] max-md:text-[3.5rem] font-extrabold break-words hyphens-auto max-md:leading-[1]">
                {name.split(" ")[0]}<br className="md:block"/>{name.split(" ").slice(1).join(" ")}
              </h1>
              
              <div className="flex flex-wrap items-center gap-2 mt-6 max-md:hidden">
                <div className="uppercase font-bold tracking-wider">KAPD EL A NAP ÍZÉT</div>
                <button className="text-brand-brown/80 border border-brand-brown/80 rounded-[20px] px-3 py-2 transition-colors hover:bg-white/50 cursor-pointer">
                  További szendvicseink
                </button>
              </div>
            </div>
            
            <div className="absolute left-0 top-0 md:top-[+5%] -z-10 w-[30vw] max-w-[500px] opacity-15 md:opacity-25 max-md:fixed max-md:left-1/2 max-md:-translate-x-1/2 max-md:top-1/4 max-md:w-[60vw]">
              <Image
                src={image}
                alt={name}
                width={500}
                height={500}
                className="w-full h-full object-contain object-top md:object-top"
              />
            </div>
          </motion.div>

          {/* Right Content - Image and Description Area */}
          <motion.div 
            initial={{ x: 10 }}
            whileInView={{ x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: false }}
            className="flex flex-col justify-end items-end min-w-0 relative text-[1vw] max-md:items-center max-md:justify-center max-md:w-full"
          >
            <div className="w-[35vw] min-w-[300px] max-w-[700px] h-auto relative z-[1] max-md:w-[70vw] max-md:min-w-0 max-md:max-w-[400px] max-md:mt-4">
              <Image
                src={image}
                alt={name}
                width={700}
                height={700}
                className="w-full h-full object-contain object-right-bottom max-md:object-center"
              />
            </div>
            
            <div className="z-[2] text-right mt-5 mb-8 relative max-md:text-center max-md:w-[90vw] max-md:mx-auto max-md:mt-4 max-md:mb-16 max-md:px-6">
              <h2 className="text-[32px] font-bold leading-[36px] mb-2.5 max-md:text-[24px] max-md:hidden">
                <strong>{name}</strong>
              </h2>
              <div className="text-right ml-auto max-w-[35vw] text-[1.2vw] leading-[1.1em] max-md:text-center max-md:mx-auto max-md:max-w-[85vw] max-md:text-[4vw]">
                {description}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
