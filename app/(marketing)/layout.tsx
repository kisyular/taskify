import { Footer } from './_components/footer'
import { Navbar } from './_components/navbar'

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='h-full bg-slate-100  dark:bg-black'>
			<Navbar />
			<main className='pt-40 pb-20 bg-slate-100 dark:bg-black'>
				{children}
			</main>
			<Footer />
		</div>
	)
}

export default MarketingLayout
