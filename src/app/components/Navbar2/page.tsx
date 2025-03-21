
import Link from "next/link";

export default function Navbar2() {
  return (
    <div className="w-[1340px] h-[58px] lg:w-[1337px] lg:h-[58px] lg:px-[17px] lg:pl-[38px] flex items-center justify-between gap-[20px]">
      {/* Logo */}
      <div className="flex items-center ml-24">
        <h3 className="font-Montserrat font-semibold leading-[32px] text-[24px] text-[#252B42] mt-1 hidden lg:block">
          Bandage
        </h3>
      </div>
  
      {/* Navigation links */}
      <div className="hidden lg:flex lg:flex-grow lg:justify-between items-center">
        <ul className="font-Montserrat font-semibold text-[14px] text-[#737373] gap-[20px] leading-[24px] flex ml-40">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/Product-1">Product</Link></li>
          <li><Link href="/Pricing">Pricing</Link></li>
          <li><Link href="/Contact">Contact</Link></li>
        </ul>
  
        {/* Login / Register section */}
        <div className="flex items-center gap-[20px]">
          <div className="w-[166px] h-[54px] p-[15px] flex items-center gap-[10px] mr-3 cursor-pointer">
            <div className="w-[12px] h-[12px] mt-[6px]"></div>
            <span className="font-Montserrat font-semibold text-[14px] text-[#23A6F0]">
              Login
            </span>
          </div>
  
          {/* Become a Member button */}
          <button className="bg-[#23A6F0] text-white font-semibold text-[14px] py-2 px-6 rounded">
            Become a Member
          </button>
        </div>
      </div>
    </div>
  );
}
