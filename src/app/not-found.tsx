import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="sticker-card p-8 md:p-12 max-w-md mx-auto space-y-4 bg-white relative">
        <div className="washi-tape" />
        <span className="sticker-badge bg-[#FFD94A] text-[#14151A]">
          <Sparkles className="w-3.5 h-3.5" />
          404 NOT FOUND
        </span>
        <h2 className="font-display font-black text-4xl text-[#14151A]">
          Page Vanished!
        </h2>
        <p className="text-sm text-[#14151A]/70">
          The rewards wheel you are looking for does not exist or has been relocated.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="sticker-btn inline-flex items-center gap-2 bg-[#FF6B8A] text-white px-6 py-2.5 text-sm hover:bg-[#ff5577] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to SPINO Wheel
          </Link>
        </div>
      </div>
    </div>
  );
}
