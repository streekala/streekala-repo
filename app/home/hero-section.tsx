import HeroCarousel from "@/components/hero-carusel"

const slides = [
  {
    id: 1,
    image: "/hero-slide-1.webp",          // desktop
    mobileImage: "/hero-slide-1-mobile.webp", // mobile
    alt: "New collection",
    title: "New Collection",
    subtitle: "Handpicked styles for the season",
    href: "/collections/new",
    cta: "Shop now",
  },
  {
    id: 2,
    image: "/hero-slide-2.webp",
    mobileImage: "/hero-slide-2-mobile.webp",
    alt: "Festive sale",
    title: "Festive Sale",
    subtitle: "Up to 40% off",
    href: "/collections/sale",
    cta: "View offers",
  },
]

const HeroSection = () => {
  return (
    <section>
      <HeroCarousel slides={slides} />
    </section>
  )
}

export default HeroSection