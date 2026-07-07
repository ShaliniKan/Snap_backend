import CategoryProducts from "../pages/CategoryProducts";
import Home from "../pages/Home";
import ProductDetail from "../pages/ProductDetail";
import SearchProducts from "../pages/SearchProducts";
import SellOnApnaMart from "../pages/SellOnApnaMart";
import SubcategoryProducts from "../pages/SubcategoryProducts";
import { ROUTES } from "./routePaths";

const publicRoutes = [
    {
        path: ROUTES.public.home,
        element: <Home />,
    },
    {
        path: ROUTES.public.sell,
        element: <SellOnApnaMart />,
    },
    {
        path: ROUTES.public.products,
        element: <SearchProducts />,
    },
    {
        path: ROUTES.public.category,
        element: <CategoryProducts />,
    },
    {
        path: ROUTES.public.subcategory,
        element: <SubcategoryProducts />,
    },
    {
        path: ROUTES.public.productDetails,
        element: <ProductDetail />,
    },
];



export default publicRoutes;

