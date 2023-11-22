'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Check, Loader2 } from 'lucide-react'
import { useFormStatus } from 'react-dom'
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { cn } from '@/lib/utils'
import { unsplash } from '@/lib/unsplash'
import { defaultImages } from '@/constants/images'

import { FormErrors } from './form-errors'

interface FormPickerProps {
	id: string
	errors?: Record<string, string[] | undefined>
}

export const FormPicker = ({ id, errors }: FormPickerProps) => {
	const generateUUID = () => {
		const uuid = uuidv4()
		console.log('Generated UUID:', uuid)
		return uuid
	}
	// Extract 'pending' from useFormStatus()
	const { pending } = useFormStatus()

	// State variables initialization using useState hook
	const [images, setImages] =
		useState<Array<Record<string, any>>>(defaultImages)
	const [isLoading, setIsLoading] = useState(true) // State to track loading status
	const [selectedImageId, setSelectedImageId] = useState(null) // State to hold the ID of a selected image

	// useEffect hook - runs side effects in functional components
	useEffect(() => {
		// Function to fetch images from Unsplash API
		const fetchImages = async () => {
			try {
				// Making an API call to Unsplash to get random images from a specific collection
				const result = await unsplash.photos.getRandom({
					collectionIds: ['317099'],
					count: 9,
				})

				// If the API call is successful and 'result' has 'response'
				if (result && result.response) {
					// Set 'images' state to the received images
					const newImages = result.response as Array<
						Record<string, any>
					>
					setImages(newImages)
				} else {
					// Log an error message if unable to get images from Unsplash
					console.error('Failed to get images from Unsplash')
				}
			} catch (error) {
				// If an error occurs during API call, log the error and set 'images' state to defaultImages
				console.log(error)
				setImages(defaultImages)
			} finally {
				// Set 'isLoading' state to false after fetching images, regardless of success or failure
				setIsLoading(false)
			}
		}

		// Invoke fetchImages function when the component mounts (empty dependency array)
		fetchImages()
	}, []) // Empty dependency array ensures useEffect runs only once after the initial render

	if (isLoading) {
		return (
			<div className='p-6 flex items-center justify-center'>
				<Loader2 className='h-6 w-6 text-sky-700 animate-spin' />
			</div>
		)
	}
	return (
		<div className='relative'>
			<div className='grid grid-cols-3 gap-2 mb-2'>
				{images.map((image) => (
					<div
						key={image.id}
						className={cn(
							'cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted',
							pending && 'opacity-50 hover:opacity-50 cursor-auto'
						)}
						onClick={() => {
							if (pending) return
							setSelectedImageId(image.id)
						}}
					>
						<input
							type='radio'
							id={id + generateUUID()}
							name={id}
							className='hidden'
							checked={selectedImageId === image.id}
							disabled={pending}
							value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`}
							onChange={() => {
								if (!pending) {
									setSelectedImageId(image.id)
								}
							}}
						/>
						<Image
							src={image.urls.thumb}
							alt='Unsplash image'
							className='object-cover rounded-sm'
							fill
							sizes='(max-width: 768px) 100vw'
							priority={true} // Add priority attribute to prioritize this image
						/>
						{selectedImageId === image.id && (
							<div className='absolute inset-y-0 h-full w-full bg-black/30 flex items-center justify-center'>
								<Check className='h-4 w-4 text-white' />
							</div>
						)}
						<Link
							href={image.links.html}
							target='_blank'
							className='opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50'
						>
							{image.user.name}
						</Link>
					</div>
				))}
			</div>
			<FormErrors id='image' errors={errors} />
		</div>
	)
}
