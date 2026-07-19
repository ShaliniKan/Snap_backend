const normalizeName = (name = "") => String(name).trim().toLowerCase();

export const BANNER_SLIDES = [
    {
        id: "flash-sale",
        image: "/banner1.jpg",
        alt: "Flash sale banner",
        href: "/products?sort=discount",
    },
    {
        id: "fashion-week",
        image: "/banner2.jpg",
        alt: "Fashion week deals",
        href: "/products",
    },
    {
        id: "electronics",
        image: "/electronic1.jpg",
        alt: "Electronics mega sale",
        href: "/categories",
    },
    {
        id: "beauty",
        image: "/beauty1.jpg",
        alt: "Beauty bonanza",
        href: "/products",
    },
];

export const DEAL_OFFERS = [
    "UNDER ₹499",
    "MIN. 60% OFF",
    "STARTING ₹129",
    "UNDER ₹399",
    "MIN. 50% OFF",
    "UNDER ₹799",
    "MIN. 40% OFF",
    "STARTING ₹199",
];

export const NEW_ARRIVAL_PRICE_TAGS = [
    "UNDER ₹399",
    "UNDER ₹299",
    "UNDER ₹399",
    "UNDER ₹299",
    "UNDER ₹799",
    "UNDER ₹499",
    "UNDER ₹349",
    "UNDER ₹599",
];

const SUBCATEGORY_IMAGES = {
    "men::formal wear": "/men_formal.jpg",
    "men::casual wear": "/men_casual.jpg",
    "men::ethnic wear": "/men_ethnic.jpg",
    "men::sports wear": "/footwear1.jpg",
    "women::western wear": "/women_western.jpg",
    "women::ethnic wear": "/women_ethnic.jpg",
    "women::footwear": "/women_footwear.jpg",
    "women::accessories": "/women_accessories.jpg",
    "footwear::men's footwear": "/men_formal.jpg",
    "footwear::women's footwear": "/women's_footware.jpg",
    "footwear::mens footwear": "/men's_footwear.jpg",
    "home & kitchen::cookware": "/cookware.jpg",
    "home & kitchen::decor": "/decore.jpg",
    "home & kitchen::appliances": "/appliance.jpg",
    "home furnishing::living room furniture": "/living_room.jpg",
    "home furnishing::bedroom furniture": "/bed_room.jpg",
    "electronics::mobiles": "/mobile.jpg",
    "electronics::laptops": "/laptop.jpg",
    "mobiles accessories::mobile accessories": "/mobile_access.jpg",
    "kids::boys clothing": "/baby_boy.jpg",
    "kids::girls clothing": "/baby_girl.jpg",
    "watches::watches": "/watch_pic.jpg",
    "beauty & personal care::beauty & personal care": "/skin.jpg",
};

export const getSubcategoryImage = (subcategoryName = "", parentName = "") => {
    const name = normalizeName(subcategoryName);
    const parent = normalizeName(parentName);
    const mapped = SUBCATEGORY_IMAGES[`${parent}::${name}`];

    if (mapped) {
        return mapped;
    }

    if (parent.includes("women")) return "/women.jpg";
    if (parent.includes("men")) return "/men1.jpg";
    if (parent.includes("kid")) return "/kid.jpg";
    if (parent.includes("electronic")) return "/electronic.jpg";
    if (parent.includes("beauty")) return "/beauty.jpg";
    if (parent.includes("footwear")) return "/footwear1.jpg";
    if (parent.includes("watch")) return "/watches.jpg";
    if (parent.includes("home")) return "/home&kitchen.jpg";

    return "/banner1.jpg";
};

export const getDealOffer = (index) => DEAL_OFFERS[index % DEAL_OFFERS.length];

export const getNewArrivalPriceTag = (index, sellingPrice = 0) => {
    if (sellingPrice > 0) {
        const rounded = Math.ceil(sellingPrice / 100) * 100 - 1;
        return `UNDER ₹${Math.max(rounded, 99)}`;
    }

    return NEW_ARRIVAL_PRICE_TAGS[index % NEW_ARRIVAL_PRICE_TAGS.length];
};
