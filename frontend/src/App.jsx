import Layout from './components/layout/Layout'
import DashboardPage from './pages/DashboardPage'
import { Route, Routes } from 'react-router-dom'
import ProjectResources from './pages/ProjectResources'
import ProjectsPage from './pages/ProjectsPage'
import ResourcesPage from './pages/ResourcesPage'
import { NavigationProvider } from './contexts/NavigationProvider'

const App = () => {
  return (
    <div>
      <NavigationProvider>
        <Layout>
          <Routes>
            <Route path='/' element={<DashboardPage/>}/>
            <Route path='/result' element={<ProjectResources/>}/>
            <Route path='/projects' element={<ProjectsPage/>}/>
            <Route path='/resources' element={<ResourcesPage/>}/>
          </Routes>
        </Layout> 
      </NavigationProvider>
    </div>
  )
}

export default App