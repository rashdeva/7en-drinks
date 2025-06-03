/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: "true",
      padding: {
        DEFAULT: "1rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1200px",
      },
    },
    fontFamily: {
      sans: [
        "Nunito",
        "Fredoka",
        "Arial",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: ["1rem", "1.12500rem"],
      xl: "1.25rem",
      "2xl": ["1.5rem", "1.75rem"],
      "3xl": ["2rem", "2.35rem"],
      "4xl": ["2.5rem", "3rem"],
      "5xl": "3.052rem",
    },
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        telegram: {
          DEFAULT: "var(--telegram)",
          foreground: "var(--telegram-foreground)",
        },
        instagram: {
          foreground: "var(--instagram-foreground)",
        },
      },
      backgroundImage: {
        master: "var(--master-background)",
        instagram: "var(--instagram)",
      },
      borderRadius: {
        "3xl": "2rem",
        lg: "var(--radius)",
        md: "8px",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spin-slow": "spin 30s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
