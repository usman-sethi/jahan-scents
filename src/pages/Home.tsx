import { Hero } from '../components/home/Hero';
import { CategoryPreview } from '../components/home/CategoryPreview';
import { ProductShowcase } from '../components/home/ProductShowcase';
import { BrandStory } from '../components/home/BrandStory';
import { ScentFinder } from '../components/home/ScentFinder';
import { Testimonials } from '../components/home/Testimonials';
import { Helmet } from 'react-helmet-async';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>JAHAN | Signature Luxury Fragrances</title>
        <meta name="description" content="Discover JAHAN's exquisite collection of luxury fragrances, timeless scents, and crafted perfume assortments that evoke deep emotions." />
        <link rel="canonical" href="https://jahan-perfume.example.com/" />
      </Helmet>
      <main>
        <Hero />
        <CategoryPreview />
        <ProductShowcase />
        <BrandStory />
        <ScentFinder />
        <Testimonials />
      </main>
    </>
  );
}
