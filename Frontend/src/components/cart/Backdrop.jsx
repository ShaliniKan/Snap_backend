const Backdrop = ({ onClick, top = 0 }) => {
    return (
        <button
            aria-label="Close overlay"
            className="fixed left-0 right-0 bottom-0 z-50 bg-black/45 opacity-100 transition-opacity"
            onClick={onClick}
            style={{ top }}
            type="button"
        />
    );
};

export default Backdrop;
