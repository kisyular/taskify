import { Logo } from '@/components/logo'
import { DarkModeToggle } from '@/components/modals/dark-mode'
import { Button } from '@/components/ui/button'
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs'
import { Plus } from 'lucide-react'

const Navbar = () => {
	return (
		<nav className='fixed z-50 top-0 px-4 w-full h-14 border-b shadow-sm  flex items-center'>
			{/* TODO Mobile Sidebar */}
			<div className='flex items-center gap-x-4'>
				<div className='hidden md:flex'>
					<Logo />
				</div>
				<Button
					variant='default'
					size='sm'
					className='rounded-sm hidden md:block h-auto  py-1.5 px-2'
				>
					Create
				</Button>
				<Button
					variant='default'
					size='sm'
					className='rounded-sm block md:hidden'
				>
					<Plus className='h-4 w-4' />
				</Button>
			</div>
			<div className='ml-auto flex items-center gap-x-2 '>
				<DarkModeToggle />
				<OrganizationSwitcher
					hidePersonal
					afterCreateOrganizationUrl='/organization/:id'
					afterLeaveOrganizationUrl='/select-org'
					afterSelectOrganizationUrl='/organization/:id'
					appearance={{
						elements: {
							rootBox:
								'dark:bg-black flex justify-center items-center',
							organizationSwitcherTrigger:
								'dark:text-white capitalize',
							avatarBox:
								'dark:border-white border-solid border-2 dark:bg-slate-400 rounded-full',
							organizationSwitcherTriggerIcon:
								'dark:text-white opacity-100',
						},
					}}
				/>
				<UserButton
					afterSignOutUrl='/'
					appearance={{
						elements: {
							avatarBox:
								'h-30 w-30 dark:border-white border-solid border-2 border-black',
						},
					}}
				/>
			</div>
		</nav>
	)
}
export default Navbar
