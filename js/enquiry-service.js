/**
 * SREE KRISHNA ENTERPRIZES - ENQUIRY & COMMUNICATION SERVICE
 * Modular service architecture ready for backend/API or Email Service integration.
 */

const SKE_CONFIG = {
  phone: "+919843227289",
  phoneFormatted: "+91 98432 27289",
  emails: ["infoskeindiaerd@gmail.com", "arunskeindiaerd@gmail.com"],
  defaultWhatsAppMsg: "Hello Sree Krishna Enterprizes, I am interested in your textile machinery/products. Please share more details.",
  apiEndpoint: "api/enquiry.php" // Self-hosted PHP endpoint — secure server-side email dispatch
};

const EnquiryService = {
  /**
   * Generates a direct WhatsApp enquiry URL with encoded custom message
   */
  getWhatsAppUrl(customText) {
    const text = customText || SKE_CONFIG.defaultWhatsAppMsg;
    return `https://wa.me/${SKE_CONFIG.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
  },

  /**
   * Generates direct mailto link with subject and body
   */
  getMailtoUrl(subject, body) {
    const primaryEmail = SKE_CONFIG.emails[0];
    const ccEmail = SKE_CONFIG.emails[1];
    const sub = encodeURIComponent(subject || "Textile Machinery & Accessories Enquiry - Sree Krishna Enterprizes");
    const content = encodeURIComponent(body || "Dear Sree Krishna Enterprizes Team,\n\nI would like to enquire about your textile machinery and accessories.");
    return `mailto:${primaryEmail}?cc=${ccEmail}&subject=${sub}&body=${content}`;
  },

  /**
   * Validates enquiry form payload
   */
  validateEnquiry(formData) {
    const errors = {};

    if (!formData.fullName || formData.fullName.trim().length < 2) {
      errors.fullName = "Please enter your full name.";
    }

    if (!formData.country || formData.country.trim().length < 2) {
      errors.country = "Please specify your country.";
    }

    if (!formData.phone || formData.phone.trim().length < 6) {
      errors.phone = "Please provide a valid contact phone or WhatsApp number.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email.trim())) {
      errors.email = "Please enter a valid business email address.";
    }

    if (!formData.productRequired || formData.productRequired.trim().length < 2) {
      errors.productRequired = "Please select or describe the product/machinery required.";
    }

    if (!formData.message || formData.message.trim().length < 5) {
      errors.message = "Please provide enquiry details or requirements.";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  /**
   * Submits enquiry payload
   * Stored in localStorage for offline preview & sends formatted request
   */
  async submitEnquiry(formData) {
    const validation = this.validateEnquiry(formData);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const payload = {
      ...formData,
      id: "ENQ-" + Date.now(),
      createdAt: new Date().toISOString(),
      status: "New"
    };

    // Store in browser storage (Admin-ready cache for testing & auditing)
    try {
      const existing = JSON.parse(localStorage.getItem("ske_enquiries") || "[]");
      existing.unshift(payload);
      localStorage.setItem("ske_enquiries", JSON.stringify(existing));
    } catch (e) {
      console.warn("Storage warning:", e);
    }

    // Send to Formspree — delivers email to owner inbox on every submission
    if (SKE_CONFIG.apiEndpoint) {
      try {
        const response = await fetch(SKE_CONFIG.apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            name: payload.fullName,
            company: payload.companyName,
            country: payload.country,
            phone: payload.phone,
            email: payload.email,
            product: payload.productRequired,
            condition: payload.machineryCondition,
            quantity: payload.quantity,
            specifications: payload.specifications,
            message: payload.message,
            enquiry_id: payload.id,
            submitted_at: payload.createdAt
          })
        });

        const json = await response.json();

        if (!response.ok || json.error) {
          console.error("Formspree error:", json);
          return {
            success: false,
            errors: { message: json.error || "Submission failed. Please try WhatsApp or call us directly." }
          };
        }
      } catch (err) {
        console.error("Network error:", err);
        return {
          success: false,
          errors: { message: "Network error. Please check your connection and try again." }
        };
      }
    }

    return {
      success: true,
      message: "Thank you for your enquiry. Our team will contact you shortly.",
      data: payload
    };
  }
};

window.EnquiryService = EnquiryService;
window.SKE_CONFIG = SKE_CONFIG;
