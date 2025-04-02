import InterviewCard from '@/components/InterviewCard'
import { Button } from '@/components/ui/button'
import { dummyInterviews } from '@/constants'
import { getInterviewsByUserId, getLatestInterviews } from '@/lib/actions/general.action'
import { getCurrentUser } from '@/lib/actions/auth.action'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const page = async () => {
  const user = await getCurrentUser();

  const [userInterviews, latestInterviews] = await Promise.all([
    await getInterviewsByUserId(user?.id! ),
    await getLatestInterviews({ userId: user?.id! })
  ])

  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = latestInterviews?.length! > 0;
  return (
    <>
        <section className='card-cta'>
          <div className='flex flex-col gap-6 max-w-lg'>
            <h2 className='text-primary-100'>Get ready for your next interview</h2>
            <p className='text-lg'>Practice with a mock interview partner</p>

            <Button asChild className='btn-primary max-sm:w-full'>
              <Link href="/interview">Start an Interview</Link>
            </Button>
          </div>

          <Image src='/robot.png' alt='robot dude' width={400} height={400} />
        </section>

        <section className='flex flex-col gap-6 mt-8'>
            <h2 className='text-center'>Your Interviews</h2>

            <div className='interview-section max-sm:w-8/10 mx-auto flex flex-row gap-6 flex-wrap justify-center'>
                {
                  hasPastInterviews ? (
                    userInterviews?.map((interview) => (
                      <InterviewCard key={interview.id} {...interview} />
                    ))
                  ) : (
                    <p>You havent taken any interviews yet</p>
                  )
                }
            </div>
        </section>

        <section className='flex flex-col gap-6 mt-8'>
          <h2 className='text-center'>Take an Interview</h2>

          <div className='interview-section max-sm:w-8/10 mx-auto flex flex-row gap-6 flex-wrap justify-center'>
                {
                  hasUpcomingInterviews ? (
                    latestInterviews?.map((interview) => (
                      <InterviewCard key={interview.id} {...interview} />
                    ))
                  ) : (
                    <p>There are no interviews available at the moment</p>
                  )
                }
          </div>
        </section>
    </>
  )
}

export default page