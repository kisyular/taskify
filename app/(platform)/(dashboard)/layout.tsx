import Navbar from './_components/navbar'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='h-full'>
			<Navbar />
			<div className='mt-20'>{children}</div>
		</div>
	)
}

export default DashboardLayout
