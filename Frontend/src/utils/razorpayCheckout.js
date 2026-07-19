const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

export const loadRazorpayScript = () =>
    new Promise((resolve, reject) => {
        if (window.Razorpay) {
            resolve(window.Razorpay);
            return;
        }

        const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);
        if (existing) {
            existing.addEventListener("load", () => resolve(window.Razorpay));
            existing.addEventListener("error", () => reject(new Error("Failed to load Razorpay checkout")));
            return;
        }

        const script = document.createElement("script");
        script.src = RAZORPAY_SCRIPT_URL;
        script.async = true;
        script.onload = () => {
            if (window.Razorpay) {
                resolve(window.Razorpay);
                return;
            }
            reject(new Error("Razorpay checkout is unavailable"));
        };
        script.onerror = () => reject(new Error("Failed to load Razorpay checkout"));
        document.body.appendChild(script);
    });

export const openRazorpayCheckout = async ({
    keyId,
    orderId,
    amount,
    currency = "INR",
    name = "ApnaMart",
    description = "Order payment",
    prefill = {},
}) => {
    const Razorpay = await loadRazorpayScript();

    return new Promise((resolve, reject) => {
        const checkout = new Razorpay({
            key: keyId,
            amount,
            currency,
            order_id: orderId,
            name,
            description,
            prefill,
            theme: { color: "#e40046" },
            handler(response) {
                resolve({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                });
            },
            modal: {
                ondismiss() {
                    reject(new Error("Payment cancelled"));
                },
            },
        });

        checkout.on("payment.failed", (response) => {
            reject(new Error(response.error?.description || "Payment failed"));
        });

        checkout.open();
    });
};

export const getStoredUserEmail = () => {
    try {
        const stored = localStorage.getItem("user");
        if (!stored) {
            return "";
        }
        const user = JSON.parse(stored);
        return user?.email || "";
    } catch {
        return "";
    }
};
