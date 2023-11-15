import Link from 'next/link'
import localFont from 'next/font/local'
import { Poppins } from 'next/font/google'
import { Medal } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const textFont = Poppins({
	subsets: ['latin'],
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

const PrivacyPage = () => {
	return (
		<div className='flex items-center justify-center flex-col max-w-m md:max-w-3xl text-center mx-auto p-2'>
			<div className='flex items-center justify-center flex-col'>
				<h1 className='text-6xl md:text-6xl text-center dark:text-white text-neutral-800 mb-6 font-extrabold'>
					We are committed to offering you the best experience.
				</h1>
			</div>
			<div
				className={cn(
					'text-sm md:text-xl text-slate-600 mt-4 dark:text-slate-200',
					textFont.className
				)}
			>
				<div className='leading-normal dark:text-slate-300 mb-4'>
					<h1 className='font-semibold text-3xl mt-3'>
						Privacy Policy
					</h1>
					<p>
						At <span className='font-bold'> Taskify</span>, we
						prioritize the confidentiality and security of your
						personal information. We collect and process data in
						accordance with legal requirements and industry best
						practices. Our platform may gather certain information
						when you register, use our services, or interact with
						our website or mobile application.
					</p>

					<h1 className='font-semibold text-3xl mt-3'>
						Information Collection
					</h1>
					<p>
						We may collect personal data such as your name, email
						address, and usage data. Additionally, we may
						automatically collect information about your device and
						usage patterns through cookies or similar tracking
						technologies.
					</p>

					<h1 className='font-semibold text-3xl mt-3'>Data Usage</h1>
					<p>
						The information gathered is used to provide, maintain,
						and improve our services, personalize your experience,
						and communicate with you. We may also use aggregated
						data for analytical purposes and to enhance the
						functionality of our platform.
					</p>

					<p className='font-semibold text-3xl mt-3'>Data Security</p>
					<p>
						We employ industry-standard security measures to
						safeguard your data against unauthorized access,
						disclosure, alteration, or destruction.
					</p>

					<h1 className='font-semibold text-3xl mt-3'>
						User Control
					</h1>
					<p>
						You have the right to review, update, or delete your
						personal information. You can manage your preferences
						and privacy settings within your account.
					</p>

					<h1 className='font-semibold text-3xl mt-3'>
						Legal Compliance
					</h1>
					<p>
						We may disclose your information if required by law or
						in response to valid requests by public authorities.
					</p>

					<p className='mt-3'>
						By using <span className='font-bold'>Taskify</span>, you
						consent to the collection and use of your information as
						outlined in this Privacy Policy. We may update this
						policy periodically, and any significant changes will be
						notified to you via email or by prominently posting a
						notice on our website.
					</p>
				</div>
			</div>
			<Button className='mt-6' size='lg' asChild>
				<Link href='/sign-up'>Get Taskify for free</Link>
			</Button>
		</div>
	)
}

export default PrivacyPage
