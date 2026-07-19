import ListingProductCard from "./ListingProductCard";

const ListingProductGrid = ({ products }) => {
    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
                <ListingProductCard key={product._id} product={product} />
            ))}
        </div>
    );
};

export default ListingProductGrid;
