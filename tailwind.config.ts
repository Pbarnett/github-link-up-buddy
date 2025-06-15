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
				surface: 'var(--bg-surface)',
				'card-analyst': 'var(--bg-card)',
				'accent-analyst': 'var(--accent)',
				'accent-fade': 'var(--accent-fade)',
				'text-muted-analyst': 'var(--text-muted)',
				'error-analyst': 'var(--error)',
				'success-analyst': 'var(--success)',
				'border-subtle': 'var(--border-subtle)',
				'text-primary-analyst': 'var(--text-primary)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				mono: ['Space Mono', 'Menlo', 'monospace']
			},
			boxShadow: {
				card: '0 6px 12px rgba(0,0,0,0.24)',
				modal: '0 12px 32px rgba(0,0,0,0.45)',
				'accent-fade': '0 2px 4px var(--accent-fade)'
			},
			fontSize: {
				'h1': ['2.5rem', { lineHeight: '3rem' }], // 40px/48px
				'h2': ['1.75rem', { lineHeight: '2.25rem' }], // 28px/36px
				'h3': ['1.375rem', { lineHeight: '1.875rem' }], // 22px/30px
				'body': ['0.9375rem', { lineHeight: '1.5rem' }], // 15px/24px
				'label': ['0.6875rem', { lineHeight: '1.25rem', fontWeight: '500' }], // 11px/20px
				'data': ['1.125rem', { lineHeight: '1.75rem' }] // 18px/28px
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
				'card-hover': {
					'0%': {
						transform: 'translateY(0px)'
					},
					'100%': {
						transform: 'translateY(-4px)'
					}
				},
				'cta-press': {
					'0%': {
						transform: 'scale(1)'
					},
					'50%': {
						transform: 'scale(0.97)'
					},
					'100%': {
						transform: 'scale(1)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'card-hover': 'card-hover 150ms ease-out',
				'cta-press': 'cta-press 80ms ease-out'
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		function({ addUtilities }: any) {
			const newUtilities = {
				'.ring-focus': {
					'&:focus-visible': {
						outline: 'none',
						'box-shadow': '0 0 0 2px var(--accent)',
						'border-radius': 'calc(var(--radius) - 2px)'
					}
				},
				'.skip-link': {
					position: 'absolute',
					top: '-40px',
					left: '6px',
					background: 'var(--accent)',
					color: 'var(--text-primary)',
					padding: '8px 16px',
					'text-decoration': 'none',
					'border-radius': '4px',
					'z-index': '1000',
					'&:focus': {
						top: '6px'
					}
				},
				'.card-hover-effect': {
					transition: 'transform 150ms ease-out, box-shadow 150ms ease-out',
					'&:hover': {
						transform: 'translateY(-4px)',
						'box-shadow': '0 6px 12px rgba(0,0,0,0.24)'
					}
				},
				'.cta-press-effect': {
					transition: 'transform 80ms ease-out',
					'&:active': {
						transform: 'scale(0.97)'
					}
				}
			}
			addUtilities(newUtilities)
		}
	],
} satisfies Config;
