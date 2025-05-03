import { Logo_light } from "@/assets";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-primary text-white mt-auto w-full">
      <div className="w-[95%] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and mission */}
          <div className="flex flex-col items-center md:items-start gap-6">
            <Image
              src={Logo_light}
              alt="Kaya Logo"
              className="w-32 object-contain"
            />
            <p className="text-center md:text-left text-sm leading-relaxed">
              At Kaya, our mission is to simplify parcel delivery by connecting
              individuals and businesses with reliable, affordable, and
              efficient riders. We are committed to delivering not just parcels
              but also trust, convenience, and peace of mind.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <h4 className="font-semibold text-lg">Quick Links</h4>
            <ul className="space-y-2 text-sm">
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

          {/* Legal & social */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <h4 className="font-semibold text-lg">Legal</h4>
            <p className="text-sm text-center md:text-left">
              © 2024 Kaya. All rights reserved. Deliveries made simple, every
              time.
            </p>
            <div className="flex gap-4 text-sm">
              <Link href="/terms" className="hover:underline">
                Terms
              </Link>
              <Link href="/privacy" className="hover:underline">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
