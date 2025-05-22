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
					foreground: 'hsl(var(--primary-foreground))'
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
				// Updated Job portal specific colors with neon and purple palette
				'job-neon': {
					100: '#F0E7FF',
					200: '#E0CFFF',
					300: '#C4A3FF',
					400: '#A370FF',
					500: '#8A3FFC',
					600: '#6929C4',
					700: '#491D8B',
					800: '#31135E',
					900: '#1C0F30',
				},
				'job-purple': {
					100: '#F6F2FF',
					200: '#E8DAFF',
					300: '#D4BBFF',
					400: '#BE95FF',
					500: '#A56EFF',
					600: '#8A3FFC',
					700: '#6929C4',
					800: '#491D8B',
					900: '#31135E',
				},
				// Keep job-blue for compatibility but update colors
				'job-blue': {
					100: '#E6F6FF',
					200: '#BAE6FF',
					300: '#82CFFF',
					400: '#33B1FF',
					500: '#1192E8',
					600: '#0072C3',
					700: '#00539A',
					800: '#003A6D',
					900: '#012749',
				},
				// Update neutral colors for dark theme
				'job-neutral': {
					100: '#F4F4F4',
					200: '#E0E0E0',
					300: '#C6C6C6',
					400: '#A8A8A8',
					500: '#8D8D8D',
					600: '#6F6F6F',
					700: '#525252',
					800: '#393939',
					900: '#262626',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'neon-pulse': {
					'0%, 100%': {
						boxShadow: '0 0 5px rgba(165, 110, 255, 0.15), 0 0 10px rgba(165, 110, 255, 0.1)'
					},
					'50%': {
						boxShadow: '0 0 8px rgba(165, 110, 255, 0.2), 0 0 15px rgba(165, 110, 255, 0.15)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'neon-pulse': 'neon-pulse 2s infinite'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'neon-gradient': 'linear-gradient(to right, #8A3FFC, #33B1FF)',
				'purple-gradient': 'linear-gradient(135deg, #6929C4 0%, #A56EFF 100%)',
				'dark-gradient': 'linear-gradient(to bottom, #1C0F30 0%, #262626 100%)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
