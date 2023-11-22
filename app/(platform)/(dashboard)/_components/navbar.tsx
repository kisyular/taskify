'use client'
import { Logo } from '@/components/logo'
import { DarkModeToggle } from '@/components/modals/dark-mode'
import { Button } from '@/components/ui/button'
import { OrganizationSwitcher, UserButton } from '@clerk/nextjs'
import { Plus } from 'lucide-react'
import { useOrganization } from '@clerk/nextjs'
import { Skeleton } from '@/components/ui/skeleton'
import { MobileSidebar } from './mobile-sidebar'
import { FormPopover } from '@/components/forms/form-popover'

const Navbar = () => {
	const { isLoaded: isLoadedOrg } = useOrganization()
	return (
		<nav className='fixed z-50 top-0 px-4 w-full h-14 border-b shadow-sm flex items-center dark:bg-black dark:bg-opacity-50 bg-white bg-opacity-50'>
			<MobileSidebar />

			<div className='flex items-center gap-x-4'>
				<div className='hidden md:flex'>
					<Logo />
				</div>
				<FormPopover align='start' side='bottom' sideOffset={18}>
					<Button
						variant='default'
						size='sm'
						className='rounded-sm hidden md:block h-auto  py-1.5 px-2'
					>
						Create
					</Button>
				</FormPopover>
				<FormPopover>
					<Button
						variant='default'
						size='sm'
						className='rounded-sm block md:hidden'
					>
						<Plus className='h-4 w-4' />
					</Button>
				</FormPopover>
			</div>
			<div className='ml-auto flex items-center gap-x-2 '>
				{!isLoadedOrg && (
					<>
						<div className='flex items-center justify-between mb-2'>
							<Skeleton className='h-10 w-16 mr-3 bg-slate-500 dark:bg-slate-400' />
							<Skeleton className='h-10 w-36 bg-slate-500 dark:bg-slate-400' />
						</div>
					</>
				)}
				<OrganizationSwitcher
					hidePersonal
					afterCreateOrganizationUrl='/organization/:id'
					afterLeaveOrganizationUrl='/select-org'
					afterSelectOrganizationUrl='/organization/:id'
					appearance={{
						elements: {
							rootBox: 'flex justify-center items-center',
							organizationSwitcherTrigger:
								'dark:text-white capitalize truncate w-52',
							avatarBox: 'bg-slate-700 rounded-full',
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
				<DarkModeToggle />
			</div>
		</nav>
	)
}
export default Navbar
