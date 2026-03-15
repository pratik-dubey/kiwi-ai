// "use client"
// import React, { useEffect, useState } from 'react'
// import ProjectHeader from '../_shared/Header'
// import ProjectSettings from '../_shared/Settings'
// import ProjectCanvas from '../_shared/Canvas'
// import { useParams } from 'next/navigation'
// import axios from 'axios'
// import { projectType, ScreenConfig } from '@/type/types'
// import { LoaderIcon} from 'lucide-react'

// function ProjectPage() {
//   const {projectId} = useParams()
//   const [projectDetail, setProjectDetail] = useState<projectType>()
//   const [loading, setLoading] = useState(false)
//   const [loadingMsg, setLoadingMsg] = useState('')
//   const [screenConfig, setScreenConfig] = useState<ScreenConfig[]>([])
//   useEffect(() => {
//     projectId && getProjectDetail()
//   }, [projectId])
//   const getProjectDetail = async() => {
//     setLoading(true)
//     setLoadingMsg('Loading details...')
//      const result = await axios.get("/api/project?projectId="+projectId)
//      console.log(result.data)
//     setProjectDetail(result.data.projectDetail)
//     setScreenConfig(result.data.screenConfig)
//     setLoading(false)
//     setLoadingMsg('Loading')
//   }

//   useEffect(() => {
//     if(projectDetail&&screenConfig&&screenConfig.length == 0) {
//       generateScreenConfig()
//     }
//     else if(projectDetail&&screenConfig) {
//       generatescreenUiUx()
//     }
//   },[projectDetail,screenConfig])
//   const generateScreenConfig = async() => {
//     // console.log('generating screen config ...')
//     setLoading(true)
//     setLoadingMsg('Generating config...')
//     const result = await axios.post('/api/generate-config', {
//       projectId:projectId,
//       deviceType:projectDetail?.device,
//       userInput:projectDetail?.userInput
//     })
//     console.log(result.data)
//     setLoading(false)
//     getProjectDetail()
//     setLoadingMsg('Loading')
//   }

//   const generatescreenUiUx = async() => {
//     setLoading(true)
//      for(let ind = 0; ind < screenConfig.length; ind++) {
//         const screen = screenConfig[ind]
//         if(screen?.code)continue;
//         setLoadingMsg('Generating Screen ' + ind )

//         const result = await axios.post('/api/generate-screen-ui', {
//           projectId,
//           screenId:screen?.screenId,
//           screenName:screen.screenName,
//           purpose:screen.purpose,
//           screenDescription:screen.screenDescription
//         })
//         console.log(result.data)
//         setScreenConfig(prev => prev.map((item,i) => (
//           i=== ind ? result.data: item
//         )))
//      }
//      setLoading(false)
//   }
//   // return (
//   //   <div>
//   //       <div className='h-[2px]'><ProjectHeader/> </div>

//   //       <div className='flex'>
//   //           {/* Setting section */}
//   //             {loading && <div className='absolute left-1/2 top-[100px] flex justify-center align-items-center gap-2 bg-blue-300/40 border border-blue-200 p-2 rounded-xl text-gray-800'>
//   //                 <LoaderIcon className='animate-spin'/>{loadingMsg}
//   //               </div>}
//   //           <ProjectSettings projectDetail={projectDetail}/>
//   //           {/* Canvas section */}
//   //           <ProjectCanvas/>
//   //       </div>
//   //   </div>
//   // )

//   return (
//     <div className='flex flex-col min-h-screen'>
//         {/* Changed h-[2px] to h-20 to give the header actual space in the layout */}
//         <div className='h-20'><ProjectHeader/> </div>

//         <div className='flex flex-1'>
//             {/* Setting section */}
//             {loading && <div className='absolute left-1/2 top-[100px] z-50 flex justify-center items-center gap-2 bg-blue-300/40 border border-blue-200 p-2 rounded-xl text-gray-800 -translate-x-1/2'>
//                   <LoaderIcon className='animate-spin'/>{loadingMsg}
//                 </div>}
            
//             {/* Added flex-shrink-0 to Settings so it doesn't squash */}
//             <div className="flex-shrink-0">
//               <ProjectSettings projectDetail={projectDetail}/>
//             </div>

//             {/* Added flex-1 to Canvas so it fills the remaining screen space */}
//             <div className="flex-1">
//               <ProjectCanvas/>
//             </div>
//         </div>
//     </div>
//   )
// }

// export default ProjectPage





"use client"
import React, { useEffect, useRef, useState } from 'react'
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
  const generationStarted = useRef(false)

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
    if (generationStarted.current) return
    if (!projectDetail) return

    if(projectDetail && screenConfig && screenConfig.length == 0) {
      generationStarted.current = true
      generateScreenConfig()
    }
    else if(projectDetail && screenConfig) {
      generationStarted.current = true
      generatescreenUiUx()
    }
  },[projectDetail, screenConfig])

  const generateScreenConfig = async() => {
    setLoading(true)
    setLoadingMsg('Generating config...')
    const result = await axios.post('/api/generate-config', {
      projectId:projectId,
      deviceType:projectDetail?.device,
      userInput:projectDetail?.userInput
    })
    console.log(result.data)
    setLoading(false)
    setLoadingMsg('Loading')
    generationStarted.current = false  // ← add this reset before getProjectDetail
    getProjectDetail()
  }

  const generatescreenUiUx = async() => {
    setLoading(true)
    const screensToGenerate = screenConfig.slice(0, 3)  // only first 3 screens
    for(let ind = 0; ind < screensToGenerate.length; ind++) {
       const screen = screensToGenerate[ind]
       if(screen?.code) continue;
       setLoadingMsg('Generating Screen ' + ind)

       const result = await axios.post('/api/generate-screen-ui', {
         projectId,
         screenId:screen?.screenId,
         screenName:screen.screenName,
         purpose:screen.purpose,
         screenDescription:screen.screenDescription
       })
       console.log(result.data)
       setScreenConfig(prev => prev.map((item,i) => (
         i === ind ? result.data: item
       )))
    }
    setLoading(false)
  }

  return (
    <div className='flex flex-col min-h-screen'>
        <div className='h-20'><ProjectHeader/> </div>
        <div className='flex flex-1'>
            {loading && <div className='absolute left-1/2 top-[100px] z-50 flex justify-center items-center gap-2 bg-blue-300/40 border border-blue-200 p-2 rounded-xl text-gray-800 -translate-x-1/2'>
                  <LoaderIcon className='animate-spin'/>{loadingMsg}
                </div>}
            <div className="flex-shrink-0">
              <ProjectSettings projectDetail={projectDetail}/>
            </div>
            <div className="flex-1">
              <ProjectCanvas/>
            </div>
        </div>
    </div>
  )
}

export default ProjectPage