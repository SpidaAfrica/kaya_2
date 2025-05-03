import { Logo_light } from "@/assets";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="w-[95%] mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:justify-between gap-8">
          {/* Logo & Navigation */}
          <div className="flex-[3] flex flex-col gap-6">
            <Image
              src={Logo_light}
              alt="Kaya Logo"
              className="w-32 h-auto md:w-40 object-contain"
            />

            <ul className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-left">
              <li>
                <Link href="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/socials" className="hover:underline">
                  Our Socials
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:underline">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* About Kaya */}
          <div className="flex-[2] border-t border-blue-400 pt-6 md:border-none md:pt-0">
            <p className="text-left text-sm md:text-base">
              At Kaya, our mission is to simplify parcel delivery by connecting
              individuals and businesses with reliable, affordable, and
              efficient riders. We are committed to delivering not just parcels
              but also trust, convenience, and peace of mind.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-white/20 flex flex-col md:flex-row justify-between items-start md:items-center text-sm text-left gap-4">
          <p>© 2024 Kaya. All rights reserved. Deliveries made simple, every time.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:underline">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
