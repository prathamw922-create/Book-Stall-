import HeroSection from '../components/home/HeroSection';
import FeaturedBooks from '../components/home/FeaturedBooks';
import NewArrivals from '../components/home/NewArrivals';
import BestSellers from '../components/home/BestSellers';
import CategoriesSection from '../components/home/CategoriesSection';
import CustomerReviews from '../components/home/CustomerReviews';
import ContactInfo from '../components/home/ContactInfo';

const HomePage = () => {
  return (
    <div className="page-enter page-enter-active">
      <HeroSection />
      <FeaturedBooks />
      <CategoriesSection />
      <NewArrivals />
      <BestSellers />
      <CustomerReviews />
      <ContactInfo />
    </div>
  );
};

export default HomePage;
