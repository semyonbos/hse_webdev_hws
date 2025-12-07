export const serviceData = {
  service: {
    name: "Wedding Registry Pro",
    description: "Simplify your wedding planning with our comprehensive registry service",
    tagline: "Your perfect wedding, perfectly organized"
  },

  navigation: [
    { href: "#home", label: "HOME" },
    { href: "#features", label: "FEATURES" },
    { href: "#screens", label: "REGISTER" },
    { href: "#contact", label: "CONTACT" }
  ],

  screens: [
    {
      id: "couple-info",
      title: "Couple Information",
      description: "Let's start with the basics about you and your partner",
      fields: [
        { type: "text", name: "brideName", label: "Bride's Full Name", required: true },
        { type: "text", name: "groomName", label: "Groom's Full Name", required: true },
        { type: "email", name: "email", label: "Email Address", required: true },
        { type: "tel", name: "phone", label: "Phone Number", required: true }
      ]
    },
    {
      id: "wedding-details",
      title: "Wedding Details",
      description: "Tell us about your special day",
      fields: [
        { type: "date", name: "weddingDate", label: "Wedding Date", required: true },
        { type: "text", name: "venue", label: "Venue Name", required: true },
        { type: "location", name: "location", label: "City & State", required: true },
        { type: "number", name: "guestCount", label: "Expected Guest Count", required: true }
      ]
    },
    {
      id: "registry-preferences",
      title: "Registry Preferences",
      description: "Customize your gift registry experience",
      fields: [
        { type: "select", name: "registryType", label: "Registry Type", options: ["Traditional", "Honeymoon Fund", "Charity", "Mixed"], required: true },
        { type: "textarea", name: "preferences", label: "Special Requests or Preferences" },
        { type: "checkbox", name: "newsletter", label: "Send me wedding planning tips", checked: true }
      ]
    },
    {
      id: "review-submit",
      title: "Review & Submit",
      description: "Almost done! Review your information and complete registration",
      fields: [
        { type: "review", name: "summary", label: "Registration Summary" },
        { type: "checkbox", name: "terms", label: "I agree to the terms and conditions", required: true }
      ]
    }
  ],

  features: {
    title: "Why Choose Our Service",
    subtitle: "Everything you need for seamless wedding planning",
    items: [
      {
        icon: "🎁",
        title: "Multiple Registry Types",
        description: "Traditional gifts, honeymoon funds, charity donations - all in one place"
      },
      {
        icon: "📱",
        title: "Mobile Friendly",
        description: "Manage your registry from any device, anywhere"
      },
      {
        icon: "🔒",
        title: "Secure & Private",
        description: "Your information is protected with bank-level security"
      },
      {
        icon: "🎨",
        title: "Customizable",
        description: "Personalize your registry to match your wedding theme"
      },
      {
        icon: "📊",
        title: "Guest Management",
        description: "Track RSVPs and guest preferences effortlessly"
      },
      {
        icon: "💝",
        title: "Thank You Manager",
        description: "Organize and track thank you notes automatically"
      }
    ]
  },

  contact: {
    title: "Get In Touch",
    subtitle: "We're here to help make your wedding planning stress-free",
    email: "support@weddingregistrypro.com",
    phone: "+1 (555) 123-4567",
    address: "123 Wedding Lane, Suite 100\nBridal City, NY 10001",
    hours: "Monday - Friday: 9AM - 6PM EST\nSaturday: 10AM - 4PM EST",
    social: [
      { name: "Facebook", icon: "📘", link: "#" },
      { name: "Instagram", icon: "📷", link: "#" },
      { name: "Pinterest", icon: "📌", link: "#" }
    ]
  }
};