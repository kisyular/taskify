'use client'
import { useOrganization } from '@clerk/nextjs'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import { CreditCard } from 'lucide-react'

const Info = () => {
	const { organization, isLoaded } = useOrganization()

	if (!isLoaded) {
		return <Info.Skeleton />
	}

	return (
		<div className='flex items-center gap-x-4'>
			<div className='w-[60px] h-[60px] relative'>
				<Image
					fill
					src={organization?.imageUrl!}
					alt='Organization'
					className='rounded-md object-cover'
					sizes='(max-width: 768px) 100vw'
				/>
			</div>
			<div className='space-y-1'>
				<p className='font-semibold text-xl capitalize'>
					{organization?.name}
				</p>
				<div className='flex items-center text-xs text-muted-foreground'>
					<CreditCard className='h-3 w-3 mr-1' />
					Free
				</div>
			</div>
		</div>
	)
}
export default Info

Info.Skeleton = function SkeletonInfo() {
	return (
		<div className='flex items-center gap-x-4'>
			<div className='w-[60px] h-[60px] relative'>
				<Skeleton className='w-full h-full absolute bg-slate-500 dark:bg-slate-400' />
			</div>
			<div className='space-y-2'>
				<Skeleton className='h-10 w-[200px] bg-slate-500 dark:bg-slate-400' />
				<div className='flex items-center'>
					<Skeleton className='h-4 w-4 mr-2 bg-slate-500 dark:bg-slate-400' />
					<Skeleton className='h-4 w-[100px] bg-slate-500 dark:bg-slate-400' />
				</div>
			</div>
		</div>
	)
}
