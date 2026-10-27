import { connection } from "next/server";
import HeroSection from "./home/hero-section";
import NewArrivals from "./home/new-arrivals";
import TrendingSection from "./home/trending-section";
import SocialSection from "./home/social-section";
import { createPageMetadata } from "@/lib/metadata";

export const instant = false;
export const metadata = createPageMetadata({
  title: "Women's Fashion, Made Beautiful",
  description:
    "Shop Streekala for thoughtfully designed women's fashion that brings contemporary style, comfort, and timeless Indian details to every occasion.",
  path: "/",
  keywords: [
    "women's fashion India",
    "ethnic wear for women",
    "contemporary Indian clothing",
    "Streekala fashion",
  ],
});

export default async function Home() {
  await connection();

  return (
    <div>
      <HeroSection />
      <div className="mt-10">
        <NewArrivals />
        <TrendingSection />
      </div>
      <SocialSection />
    </div>
  );
}
