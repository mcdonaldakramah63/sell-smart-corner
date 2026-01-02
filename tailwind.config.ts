import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					glow: 'hsl(var(--primary-glow))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				warning: {
					DEFAULT: 'hsl(var(--warning))',
					foreground: 'hsl(var(--warning-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				marketplace: {
					primary: 'hsl(var(--marketplace-primary))',
					secondary: 'hsl(var(--marketplace-secondary))',
					accent: 'hsl(var(--marketplace-accent))',
					surface: 'hsl(var(--marketplace-surface))',
					border: 'hsl(var(--marketplace-border))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'2xl': '1rem',
				'3xl': '1.5rem'
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif']
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					from: { opacity: '0', transform: 'translateY(10px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-up': {
					from: { opacity: '0', transform: 'translateY(20px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-down': {
					from: { opacity: '0', transform: 'translateY(-20px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-in': {
					from: { transform: 'translateY(10px)', opacity: '0' },
					to: { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-in-left': {
					from: { transform: 'translateX(-20px)', opacity: '0' },
					to: { transform: 'translateX(0)', opacity: '1' }
				},
				'slide-in-right': {
					from: { transform: 'translateX(20px)', opacity: '0' },
					to: { transform: 'translateX(0)', opacity: '1' }
				},
				'scale-in': {
					from: { transform: 'scale(0.95)', opacity: '0' },
					to: { transform: 'scale(1)', opacity: '1' }
				},
				'scale-up': {
					from: { transform: 'scale(0.8)', opacity: '0' },
					to: { transform: 'scale(1)', opacity: '1' }
				},
				'shimmer': {
					from: { backgroundPosition: '-200% 0' },
					to: { backgroundPosition: '200% 0' }
				},
				'pulse-glow': {
					'0%, 100%': { boxShadow: '0 0 20px hsl(var(--primary) / 0.3)' },
					'50%': { boxShadow: '0 0 40px hsl(var(--primary) / 0.5)' }
				},
				'bounce-subtle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'spin-slow': {
					from: { transform: 'rotate(0deg)' },
					to: { transform: 'rotate(360deg)' }
				},
				'blob': {
					'0%': { transform: 'translate(0, 0) scale(1)' },
					'33%': { transform: 'translate(30px, -50px) scale(1.1)' },
					'66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
					'100%': { transform: 'translate(0, 0) scale(1)' }
				},
				'ripple': {
					'0%': { transform: 'scale(0)', opacity: '0.5' },
					'100%': { transform: 'scale(4)', opacity: '0' }
				},
				'glow-pulse': {
					'0%, 100%': { opacity: '0.4' },
					'50%': { opacity: '0.8' }
				},
				'slide-up-fade': {
					from: { opacity: '0', transform: 'translateY(30px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				},
				'zoom-in': {
					from: { opacity: '0', transform: 'scale(0.5)' },
					to: { opacity: '1', transform: 'scale(1)' }
				},
				'swing': {
					'0%, 100%': { transform: 'rotate(-3deg)' },
					'50%': { transform: 'rotate(3deg)' }
				},
				'heartbeat': {
					'0%': { transform: 'scale(1)' },
					'14%': { transform: 'scale(1.1)' },
					'28%': { transform: 'scale(1)' },
					'42%': { transform: 'scale(1.1)' },
					'70%': { transform: 'scale(1)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out forwards',
				'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
				'fade-in-down': 'fade-in-down 0.6s ease-out forwards',
				'slide-in': 'slide-in 0.4s ease-out',
				'slide-in-left': 'slide-in-left 0.5s ease-out forwards',
				'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
				'scale-in': 'scale-in 0.3s ease-out',
				'scale-up': 'scale-up 0.4s ease-out forwards',
				'shimmer': 'shimmer 2s infinite linear',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
				'float': 'float 6s ease-in-out infinite',
				'spin-slow': 'spin-slow 8s linear infinite',
				'blob': 'blob 7s infinite',
				'ripple': 'ripple 0.6s linear',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'slide-up-fade': 'slide-up-fade 0.7s ease-out forwards',
				'zoom-in': 'zoom-in 0.5s ease-out forwards',
				'swing': 'swing 1s ease-in-out infinite',
				'heartbeat': 'heartbeat 1.5s ease-in-out infinite'
			},
			backdropBlur: {
				'xs': '2px'
			},
			boxShadow: {
				'elegant': 'var(--shadow-elegant)',
				'soft': 'var(--shadow-soft)',
				'glow': 'var(--shadow-glow)',
				'card': 'var(--shadow-card)',
				'hover': 'var(--shadow-hover)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
