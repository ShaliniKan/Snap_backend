import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import CheckoutHeader from "./CheckoutHeader";
import SummaryStep from "./SummaryStep";
import AddressStep from "./AddressStep";
import PaymentStep from "./PaymentStep";
import CheckoutFooter from "./CheckoutFooter";
import OrderSummary from "./OrderSummary";
import { createOrder } from "../../services/orderService";
import { validateCoupon } from "../../services/couponService";
import { checkPincode } from "../../services/deliveryService";
import { createPaymentOrder, verifyPayment } from "../../services/paymentService";

const requiredAddressFields = ["name", "mobile", "pincode", "houseNo", "city", "state"];

const CheckoutModal = ({
    isOpen,
    onClose,
    cart,
    subtotal,
    itemCount,
    onOrderSuccess,
}) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [contactDetails, setContactDetails] = useState({ phone: "", countryCode: "+91", notifyOffers: true });
    const [address, setAddress] = useState({
        name: "",
        mobile: "",
        pincode: "",
        houseNo: "",
        street: "",
        area: "",
        city: "",
        state: "",
        landmark: "",
    });
    const [selectedPayment, setSelectedPayment] = useState("cod");
    const [couponCode, setCouponCode] = useState("");
    const [discountAmount, setDiscountAmount] = useState(0);
    const [couponError, setCouponError] = useState("");
    const [couponMessage, setCouponMessage] = useState("");
    const [deliveryInfo, setDeliveryInfo] = useState(null);
    const [deliveryError, setDeliveryError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderError, setOrderError] = useState("");
    const [orderSuccess, setOrderSuccess] = useState(false);

    const deliveryCharge = deliveryInfo?.deliveryCharge || 0;
    const payableTotal = Math.max(0, subtotal - discountAmount + deliveryCharge);

    useEffect(() => {
        if (!isOpen) {
            setCurrentStep(1);
            setContactDetails({ phone: "", countryCode: "+91", notifyOffers: true });
            setAddress({
                name: "",
                mobile: "",
                pincode: "",
                houseNo: "",
                street: "",
                area: "",
                city: "",
                state: "",
                landmark: "",
            });
            setSelectedPayment("cod");
            setCouponCode("");
            setDiscountAmount(0);
            setCouponError("");
            setCouponMessage("");
            setDeliveryInfo(null);
            setDeliveryError("");
            setIsSubmitting(false);
            setOrderError("");
            setOrderSuccess(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape" && !isSubmitting) {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, isSubmitting, onClose]);

    const steps = useMemo(() => ["Summary", "Address", "Payments"], []);

    const handleCouponApply = async (code, shouldValidate = false) => {
        setCouponCode(code);

        if (!shouldValidate) {
            return;
        }

        try {
            setCouponError("");
            setCouponMessage("");
            const result = await validateCoupon(code, subtotal);
            setDiscountAmount(result.discountAmount || 0);
            setCouponMessage(`Coupon ${result.code} applied successfully.`);
        } catch (err) {
            setDiscountAmount(0);
            setCouponError(err.response?.data?.message || "Invalid coupon code.");
        }
    };

    const handlePincodeCheck = async (pincode) => {
        if (!pincode || pincode.length !== 6) {
            return;
        }

        try {
            setDeliveryError("");
            const result = await checkPincode(pincode);
            setDeliveryInfo(result);
            if (result.city) {
                setAddress((current) => ({
                    ...current,
                    city: current.city || result.city,
                    state: current.state || result.state,
                }));
            }
        } catch (err) {
            setDeliveryInfo(null);
            setDeliveryError(err.response?.data?.message || "Delivery unavailable for this pincode.");
        }
    };

    const handleContinue = async () => {
        if (orderSuccess) {
            onClose();
            return;
        }

        if (currentStep === 1) {
            if (!contactDetails.phone.trim()) {
                setOrderError("Please enter your phone number.");
                return;
            }
            setOrderError("");
            setCurrentStep(2);
            return;
        }

        if (currentStep === 2) {
            const missingField = requiredAddressFields.find((field) => !address[field]?.trim());
            if (missingField) {
                setOrderError("Please complete all required delivery address fields.");
                return;
            }

            if (!deliveryInfo) {
                await handlePincodeCheck(address.pincode);
            }

            if (deliveryError) {
                setOrderError(deliveryError);
                return;
            }

            setOrderError("");
            setCurrentStep(3);
            return;
        }

        try {
            setIsSubmitting(true);
            setOrderError("");

            let razorpay_order_id = "";
            let razorpay_payment_id = "";

            if (selectedPayment !== "cod") {
                const paymentOrder = await createPaymentOrder(payableTotal);
                razorpay_order_id = paymentOrder.orderId;

                if (paymentOrder.provider === "mock") {
                    razorpay_payment_id = `mock_pay_${Date.now()}`;
                }
            }

            const order = await createOrder({
                shipping_address: {
                    ...address,
                    mobile: address.mobile || contactDetails.phone,
                },
                payment_method: selectedPayment,
                coupon_code: couponCode || undefined,
                razorpay_order_id,
                razorpay_payment_id,
            });

            if (selectedPayment !== "cod" && razorpay_payment_id) {
                await verifyPayment({
                    razorpay_order_id,
                    razorpay_payment_id,
                    orderId: order._id,
                });
            }

            setOrderSuccess(true);
            onOrderSuccess?.();
        } catch (err) {
            setOrderError(err.response?.data?.message || "We could not place your order. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) {
        return null;
    }

    return createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-3 py-4 backdrop-blur-sm sm:px-4">
            <div className="flex h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                <CheckoutHeader activeStep={currentStep} steps={steps} onClose={onClose} />

                <div className="flex-1 overflow-y-auto bg-slate-50 px-4 py-4 sm:px-6 lg:px-8">
                    {orderSuccess ? (
                        <div className="mx-auto max-w-xl rounded-xl border border-emerald-200 bg-white p-8 text-center shadow-sm">
                            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Order placed</p>
                            <h3 className="mt-3 text-2xl font-semibold text-slate-900">Thank you for shopping with ApnaMart</h3>
                            <p className="mt-2 text-sm text-slate-600">
                                Your order has been placed successfully. We will notify you when it ships.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                                {currentStep === 1 && (
                                    <SummaryStep contactDetails={contactDetails} onContactChange={setContactDetails} />
                                )}
                                {currentStep === 2 && (
                                    <AddressStep
                                        address={address}
                                        deliveryError={deliveryError}
                                        deliveryInfo={deliveryInfo}
                                        onAddressChange={setAddress}
                                        onPincodeCheck={handlePincodeCheck}
                                    />
                                )}
                                {currentStep === 3 && (
                                    <PaymentStep selectedPayment={selectedPayment} onSelectPayment={setSelectedPayment} />
                                )}
                            </div>

                            <OrderSummary
                                cart={cart}
                                couponCode={couponCode}
                                couponError={couponError}
                                couponMessage={couponMessage}
                                deliveryCharge={deliveryCharge}
                                discountAmount={discountAmount}
                                itemCount={itemCount}
                                onCouponApply={handleCouponApply}
                                payableTotal={payableTotal}
                                subtotal={subtotal}
                            />
                        </div>
                    )}

                    {orderError && (
                        <div className="mx-auto mt-4 max-w-3xl rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                            {orderError}
                        </div>
                    )}
                </div>

                <CheckoutFooter
                    currentStep={currentStep}
                    isSubmitting={isSubmitting}
                    onBack={() => {
                        if (!isSubmitting && !orderSuccess) {
                            setOrderError("");
                            setCurrentStep((step) => Math.max(1, step - 1));
                        }
                    }}
                    onContinue={handleContinue}
                    orderSuccess={orderSuccess}
                    total={payableTotal}
                />
            </div>
        </div>,
        document.body
    );
};

export default CheckoutModal;
