"use client"
import React, { useEffect, useState } from 'react'
import ProjectHeader from '../_shared/Header'
import ProjectSettings from '../_shared/Settings'
import ProjectCanvas from '../_shared/Canvas'
import { useParams } from 'next/navigation'
import axios from 'axios'
import { projectType, ScreenConfig } from '@/type/types'
import { LoaderIcon} from 'lucide-react'

function ProjectPage() {
  const {projectId} = useParams()
  const [projectDetail, setProjectDetail] = useState<projectType>()
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState('')
  const [screenConfig, setScreenConfig] = useState<ScreenConfig[]>([])
  useEffect(() => {
    projectId && getProjectDetail()
  }, [projectId])
  const getProjectDetail = async() => {
    setLoading(true)
    setLoadingMsg('Loading details...')
     const result = await axios.get("/api/project?projectId="+projectId)
     console.log(result.data)
    setProjectDetail(result.data.projectDetail)
    setScreenConfig(result.data.screenConfig)
    setLoading(false)
    setLoadingMsg('Loading')
  }

  useEffect(() => {
    if(projectDetail&&screenConfig&&screenConfig.length == 0) {
      generateScreenConfig()
    }
    else if(projectDetail&&screenConfig) {
      generatescreenUiUx()
    }
  },[projectDetail,screenConfig])
  const generateScreenConfig = async() => {
    // console.log('generating screen config ...')
    setLoading(true)
    setLoadingMsg('Generating config...')
    const result = await axios.post('/api/generate-config', {
      projectId:projectId,
      deviceType:projectDetail?.device,
      userInput:projectDetail?.userInput
    })
    console.log(result.data)
    setLoading(false)
    getProjectDetail()
    setLoadingMsg('Loading')
  }

  const generatescreenUiUx = async() => {
    setLoading(true)
     for(let ind = 0; ind < screenConfig.length; ind++) {
        const screen = screenConfig[ind]
        if(screen?.code)continue;
        setLoadingMsg('Generating Screen ' + ind + 1)

        const result = await axios.post('/api/generate-screen-ui', {
          projectId,
          screenId:screen?.screenId,
          screenName:screen.screenName,
          purpose:screen.purpose,
          screenDescription:screen.screenDescription
        })
        console.log(result.data)
        setScreenConfig(prev => prev.map((item,i) => (
          i=== ind ? result.data: item
        )))
     }
     setLoading(false)
  }
  return (
    <div>
        <ProjectHeader/> 

        <div className='flex items-center '>
            {/* Setting section */}
              {loading && <div className='absolute left-1/2 top-[100px] flex justify-center align-items-center gap-2 bg-blue-300/40 border border-blue-200 p-2 rounded-xl text-gray-800'>
                  <LoaderIcon className='animate-spin'/>{loadingMsg}
                </div>}
            <ProjectSettings projectDetail={projectDetail}/>
            {/* Canvas section */}
            <ProjectCanvas/>
        </div>
    </div>
  )
}

export default ProjectPage