'use client'

import { ElementRef, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { ListWithCards } from '@/types'
import ListHeader from './list-header'

interface ListItemProps {
	data: ListWithCards
	index: number
}

const ListItem = ({ data, index }: ListItemProps) => {
	const enableEditing = () => {}
	return (
		<li className='shrink-0 h-full w-[272px] select-none'>
			<div className='w-full rounded-md dark:bg-white dark:text-black  shadow-md pb-2 bg-black text-white dark:border-black border-white border'>
				<ListHeader data={data} onAddCard={enableEditing} />
			</div>
		</li>
	)
}
export default ListItem
