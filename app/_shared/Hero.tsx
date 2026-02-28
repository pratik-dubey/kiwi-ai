"use client"
import React, { useState } from 'react'
import { ChevronRight, Loader, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { suggestions } from '@/data/constant'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import axios from 'axios'
function Hero() {
  const [userInput, setUserInput] = useState<string>()
  const [device, setDevice] = useState<string>()
  const {user, isSignedIn} = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const onCreateProject = async() => {
    if(!isSignedIn) {
      router.push('/sign-in')
      return;
    }

    if(!user)return

    setLoading(true)
    const projectId = crypto.randomUUID()
    const result = await axios.post("/api/project", {
      userInput: userInput,
      device: device,
      projectId:projectId
    })

    // console.log(result.data)
    setLoading(false)
    router.push('/project/' + projectId)
  }
  return (
    <div className='p-10 md:px-24 lg:px-48 xl:px-60'>

      <div className="group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] mt-4 mb-4 max-w-[300px] bg-white">
        <span
          className={cn(
            "animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px] z-999"
          )}
          style={{
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "destination-out",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "subtract",
            WebkitClipPath: "padding-box",
          }}
        />
        <AnimatedGradientText className="text-sm font-medium">
          Introducing Kiwi AI
        </AnimatedGradientText>
        <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
      </div>

      <h2 className='mt-3 text-center font-montserrat font-bold text-4xl'>Transforming Prompts into Pixel-Perfect <span className='text-primary'>Web and Mobile</span> Designs</h2>

      <p className='text-center text-xl mt-3 font-medium text-gray-600'>Generate. Customize. Ship. — UI/UX Powered by AI.</p>

      <div className="w-full gap-6 flex justify-center items-center mt-10">
        <InputGroup className='max-w-xl bg-white z-10'>
        <InputGroupTextarea
  data-slot="input-group-control"
  className="flex min-h-18 max-h-40 w-full resize-none overflow-y-auto rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm justify-center"
  placeholder="Enter your design idea"
  value={userInput}
  onChange={(event) => setUserInput(event.target.value)}
/>
          <InputGroupAddon align="block-end">
            <Select defaultValue='website' onValueChange={(value) => setDevice(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Screen" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <InputGroupButton className="ml-auto" size="sm" variant="default" onClick={() => onCreateProject()}>
              {loading ? <Loader className='animate-spin'/> : <Send size={10} />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
        {suggestions.map((item, index) => (
          <div
           onClick={() => setUserInput(item.description)}
            key={index}
            className={`
        flex flex-col items-center justify-center
        px-5 py-4
        rounded-2xl
        border
        cursor-pointer
        max-w-[2000px]
        transition-all duration-300
        hover:shadow-lg hover:-translate-y-1
        ${item.bgColor}
        ${item.borderColor}
      `}
          >
            <span className="text-xl mb-2">
              {item.icon}
            </span>

            <span className={`text-sm font-medium text-center ${item.textColor}`}>
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Hero