import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { siteConfig } from '@/config/site'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s | ${siteConfig.name}`,
	},
	description: siteConfig.description,
	icons: {
		icon: [
			{
				media: '(prefers-color-scheme: light)',
				url: '/logo-black.png',
				href: '/logo-black.png',
			},
			{
				media: '(prefers-color-scheme: dark)',
				url: '/logo-white.png',
				href: '/logo-white.png',
			},
		],
	},
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={inter.className}>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					disableTransitionOnChange
					storageKey='jotion-theme-2'
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	)
}
