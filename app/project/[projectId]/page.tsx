import React from 'react'
import ProjectHeader from '../_shared/Header'
import ProjectSettings from '../_shared/Settings'
import ProjectCanvas from '../_shared/Canvas'

function ProjectPage() {
  return (
    <div>
        <ProjectHeader/> 

        <div className='flex items-center'>
            {/* Setting section */}
            <ProjectSettings/>
            {/* Canvas section */}
            <ProjectCanvas/>
        </div>
    </div>
  )
}

export default ProjectPage