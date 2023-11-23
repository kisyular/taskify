'use client'

import { Card } from '@prisma/client'

interface CardItemProps {
	data: Card
	index: number
}
const CardItem = ({ data, index }: CardItemProps) => {
	return (
		<div
			role='button'
			onClick={() => {}}
			className='truncate border border-accent hover:border-black py-2 px-3 text-sm rounded-md shadow-sm dark:hover:border-white'
		>
			{data.title}
		</div>
	)
}

export default CardItem
