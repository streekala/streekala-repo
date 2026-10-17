import HeroSection from "./home/hero-section";
import NewArrivals from "./home/new-arrivals";
import TrendingSection from "./home/trending-section";
import SocialSection from "./home/social-section";

export default function Home() {
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
