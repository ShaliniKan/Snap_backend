const sendEmail = async ({ to, subject, html, text }) => {
    if (!to) {
        return { sent: false, reason: "missing-recipient" };
    }

    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        try {
            const nodemailer = require("nodemailer");
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT || 587),
                secure: process.env.SMTP_SECURE === "true",
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });

            await transporter.sendMail({
                from: process.env.SMTP_FROM || process.env.SMTP_USER,
                to,
                subject,
                html,
                text,
            });

            return { sent: true };
        } catch (error) {
            console.error("Email send failed:", error.message);
        }
    }

    console.log(`[Email] To: ${to} | Subject: ${subject}\n${text || html}`);
    return { sent: true, mode: "console" };
};

const sendOrderConfirmationEmail = async ({ email, orderId, totalAmount }) => {
    return sendEmail({
        to: email,
        subject: "Your ApnaMart order is confirmed",
        text: `Thank you for shopping with ApnaMart. Order ${orderId} has been placed for ₹${totalAmount}.`,
        html: `<p>Thank you for shopping with <strong>ApnaMart</strong>.</p><p>Order <strong>${orderId}</strong> has been placed for <strong>₹${totalAmount}</strong>.</p>`,
    });
};

const sendVendorStatusEmail = async ({ email, businessName, status }) => {
    return sendEmail({
        to: email,
        subject: `ApnaMart seller application ${status}`,
        text: `Your seller application for ${businessName} has been ${status}.`,
        html: `<p>Your seller application for <strong>${businessName}</strong> has been <strong>${status}</strong>.</p>`,
    });
};

module.exports = {
    sendEmail,
    sendOrderConfirmationEmail,
    sendVendorStatusEmail,
};
