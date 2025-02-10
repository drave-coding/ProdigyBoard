import Header from "@/components/NavArea/Header";
import SideBar from "@/components/sidebar";

type Props = {
    children: React.ReactNode;
}

const DashboardLayout = ({children} : Props) => {
  return (
  
    <>
    <Header />
    <div className="flex">
      <div className="px-3 py-3">
      <SideBar />
      </div>
    
      <div className="flex-grow">
        {children}
      </div>
      
    </div>
  </>
    
    
  )
}

export default DashboardLayout;