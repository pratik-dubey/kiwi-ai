"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { THEME_NAME_LIST, THEMES } from '@/data/themes'
import { Camera, CameraIcon, Share, Sparkle, Sparkles } from 'lucide-react'
import React, { useState } from 'react'

function ProjectSettings() {
    const [selectedTheme, setSelectedTheme] = useState<string>('AURORA_INK')
    const [projectName, setProjectName] = useState('')
    const [newScreenInput, setNewScreenInput] = useState<string>()
    return (
        <div className='w-[300px] mt-15 border-r border-amber-700 shadow-2xl p-4 h-[90vh]'>
            <h2 className='font-medium text-lg'>Settings</h2>

            <div className='mt-5'>
                <h2 className='text-sm mb-1'>Project Name</h2>
                <Input placeholder='Project Name' onChange={(event) => setProjectName(event.target.value)} />
            </div>

            <div className='mt-5'>
                <h2 className='text-sm mb-1'>Generate New Screen</h2>
                <Textarea placeholder='Enter prompt to generate new screen' onChange={(event) => setNewScreenInput(event.target.value)} />
                <Button className='mt-5 w-full'> <Sparkles /> Generate</Button>
            </div>

            <div className='mt-5'>
                <h2 className='text-sm mb-1'>Themes</h2>
                <div className='h-[200px] overflow-auto'>
                    <div>
                        {THEME_NAME_LIST.map((theme, index) => (
                            <div className={`p-3 border border-black m-2 rounded-xl ${theme === selectedTheme ? "bg-primary/20 border border-primary" : "bg-white"}`} onClick={() => setSelectedTheme(theme)}>
                                <h2>{theme}</h2>
                                <div className='flex mb-2 gap-1'>
                                    <div className='h-4 w-4 rounded-full' style={{ backgroundColor: THEMES[theme].secondary }} />
                                    <div className='h-4 w-4 rounded-full' style={{ backgroundColor: THEMES[theme].primary }} />
                                    <div className='h-4 w-4 rounded-full' style={{ backgroundColor: THEMES[theme].accent }} />
                                    <div className='h-4 w-4 rounded-full' style={{ backgroundColor: THEMES[theme].background }} />
                                </div>

                                <div
                                    className="h-4 w-4 rounded-full"
                                    style={{
                                        background: `linear-gradient(
      135deg,
      ${THEMES[theme].background},
      ${THEMES[theme].primary},
      ${THEMES[theme].accent}
    )`,
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className='gap-2 flex mt-5'>
                <Button variant={'outline'} size={'sm'} className='mt-2'><CameraIcon /> Screenshot</Button>
                <Button variant={'outline'} size={'sm'} className='mt-2'><Share /> Share</Button>
            </div>
        </div>
    )
}

export default ProjectSettings