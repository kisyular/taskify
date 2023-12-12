'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useCardModal } from '@/hooks/use-card-modal'

const CardModal = () => {
	const id = useCardModal((state) => state.id)
	const isOpen = useCardModal((state) => state.isOpen)
	const onClose = useCardModal((state) => state.onClose)

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<div className='grid grid-cols-1 md:grid-cols-4 md:gap-4'>
					<div className='col-span-3'>
						<div className='w-full space-y-6'>I am a Modal</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
export default CardModal
