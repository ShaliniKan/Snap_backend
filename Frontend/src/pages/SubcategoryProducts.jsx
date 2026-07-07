import TopHeader from "../components/layout/TopHeader";
import Navbar from "../components/layout/Navbar";
import ProductListingPage from "../components/product/ProductListingPage";

const SubcategoryProducts = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            <TopHeader />
            <Navbar />
            <ProductListingPage mode="subcategory" />
        </div>
    );
};

export default SubcategoryProducts;
