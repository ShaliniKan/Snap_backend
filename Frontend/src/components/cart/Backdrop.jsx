const Backdrop = ({ onClick }) => {
    return (
        <button
            aria-label="Close cart"
            className="fixed inset-0 z-50 bg-black/45 opacity-100 transition-opacity"
            onClick={onClick}
            type="button"
        />
    );
};

export default Backdrop;
