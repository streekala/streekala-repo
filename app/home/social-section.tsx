import Image from "next/image";
import Link from "next/link";

const socialPosts = [
  {
    image: "/new-arrivals-1.webp",
    alt: "Blue cotton kurta styling",
  },
  {
    image: "/new-arrivals-2.webp",
    alt: "Blue printed ethnic wear styling",
  },
  {
    image: "/trending-img-3.webp",
    alt: "Layered kurta styling",
  },
  {
    image: "/new-arrivals-3.webp",
    alt: "Pink cotton top styling",
  },
  {
    image: "/trending-img-1.webp",
    alt: "Pink cotton top styling",
  },
];

const SocialSection = () => {
  return (
    <section className="w-full overflow-hidden py-12 sm:py-16 lg:py-20">
      <div className="mb-10 flex flex-col items-center gap-2 px-4 text-center">
        <p className="text-lg text-foreground sm:text-xl">
          Follow Us on Instagram
        </p>
        <Link
          href="https://www.instagram.com/"
          target="_blank"
          rel="noreferrer"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground sm:text-base"
        >
          @streekala
        </Link>
      </div>

      <div className="flex w-full gap-1 overflow-x-auto px-1 pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden sm:gap-2 sm:px-2">
        {socialPosts.map((post) => (
          <Link
            href="https://www.instagram.com/"
            target="_blank"
            rel="noreferrer"
            key={post.image}
            className="group relative block aspect-[1.3/1] min-w-[82vw] overflow-hidden sm:min-w-0 sm:flex-1"
          >
            <Image
              src={post.image}
              alt={post.alt}
              fill
              sizes="(min-width: 640px) 25vw, 82vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default SocialSection;