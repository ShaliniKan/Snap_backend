const normalizeRole = (value) => String(value || "").trim().toLowerCase();

const resolveRegistrationRole = (payload = {}) => {
    const requestedAccountType = normalizeRole(payload?.accountType || payload?.type);
    const requestedRole = normalizeRole(payload?.role);

    if (requestedRole === "admin" || requestedAccountType === "admin") {
        throw new Error("Admin registration is not allowed through public signup.");
    }

    if (requestedRole && !["customer", "vendor"].includes(requestedRole)) {
        throw new Error("Invalid role provided.");
    }

    if (requestedAccountType && !["customer", "vendor"].includes(requestedAccountType)) {
        throw new Error("Invalid account type provided.");
    }

    if (requestedAccountType === "vendor" || requestedRole === "vendor") {
        return {
            role: "vendor",
        };
    }

    return {
        role: "customer",
    };
};

const validateRegistrationPayload = (payload = {}) => {
    return resolveRegistrationRole(payload);
};

const buildRegistrationProfile = (payload = {}) => {
    const { accountType, type, role, name, firstName, lastName, ...rest } = payload || {};
    const normalizedName = String(name || "").trim();

    let resolvedFirstName = firstName;
    let resolvedLastName = lastName;

    if (!resolvedFirstName && normalizedName) {
        const nameParts = normalizedName.split(/\s+/).filter(Boolean);
        resolvedFirstName = nameParts.shift() || "User";
        resolvedLastName = nameParts.join(" ") || "User";
    }

    return {
        ...rest,
        firstName: resolvedFirstName || "User",
        lastName: resolvedLastName || "User",
    };
};

module.exports = {
    resolveRegistrationRole,
    validateRegistrationPayload,
    buildRegistrationProfile,
};
