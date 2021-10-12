// import {
//     BrowserRouter as Router,
//     Route,
//     Switch, 
//     Link,
//   } from "react-router-dom";
import React from 'react';
import { useHistory } from "react-router";
// TODO fetch from api
// import logo from './../../../public/logo192.png';
import BasicTabs from './../AccNav/index';
// import AccDetails from './../AccDetails/index';
// import UpdatePassword from "../Updatepwd/index";


function AccountPage(){
    var history = useHistory();
    
    return(
        <BasicTabs/>
        // <Router>
        //   <div>
        //     <ul>
        //       <li>
        //         <Link to="/account">Account Details</Link>
        //       </li>
        //       <li>
        //         <Link to="/updatepwd">Update Account</Link>
        //       </li>
        //     </ul>
    
        //     <hr />
    
        //     <Switch>
        //       <Route exact path="/account">
        //         <AccDetails/>
        //         {/* <BasicTabs/> */}
        //       </Route>
        //       <Route path="/updatepwd">
        //         <UpdatePassword/>
        //       </Route>
        //     </Switch>
        //   </div>
        // </Router>
    );
}


export default AccountPage;