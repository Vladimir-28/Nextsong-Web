import { useState } from "react";

import AuthRouter from "./modules/router/AuthRouter";
import PublicRouter from "./modules/router/PublicRouter";
import CustomNavbar from "./components/CustomNavbar";
import Header from "./modules/access/components/Header";
import CustomSidebar from "./components/CustomSidebar";

function App() {

  const [session, setSession] = useState(
    sessionStorage.getItem("user") ? true : false
  );

  return (
    <>
      {session ? (

        <>
          <CustomNavbar setSession={setSession} />
          <CustomSidebar setSession={setSession}/>
          <AuthRouter  />
        </>

      ) : (

        <>
          <Header />
          <PublicRouter setSession={setSession} />
          
        </>

      )}
    </>
  );
}

export default App;