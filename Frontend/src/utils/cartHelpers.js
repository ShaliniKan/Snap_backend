export const getCartItemAttributesLine = (item) => {
    const parts = [];
    const size = item.selected_size || item.variant_id?.size;
    const color = item.selected_color || item.variant_id?.color;

    if (size) {
        parts.push(`Size: ${size}`);
    }

    if (color) {
        parts.push(`Color: ${color}`);
    }

    parts.push("Pack: Pack Of 1");

    return parts.join(" | ");
};
