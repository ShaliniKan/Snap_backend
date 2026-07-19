import CategoryProducts from "../pages/CategoryProducts";
import Home from "../pages/Home";
import ProductDetail from "../pages/ProductDetail";
import SearchProducts from "../pages/SearchProducts";
import SellOnApnaMart from "../pages/SellOnApnaMart";
import SubcategoryProducts from "../pages/SubcategoryProducts";
import HomeLayout from "../components/layout/HomeLayout";
import StoreLayout from "../components/layout/StoreLayout";
import { ROUTES } from "./routePaths";

const publicRoutes = [
    {
        element: <HomeLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
        ],
    },    {
        path: ROUTES.public.sell,
        element: <SellOnApnaMart />,
    },
    {
        element: <StoreLayout />,
        children: [
            {
                path: ROUTES.public.products,
                element: <SearchProducts />,
            },
            {
                path: ROUTES.public.productDetails,
                element: <ProductDetail />,
            },
            {
                path: ROUTES.public.category,
                element: <CategoryProducts />,
            },
            {
                path: ROUTES.public.subcategory,
                element: <SubcategoryProducts />,
            },
        ],
    },
];

export default publicRoutes;
