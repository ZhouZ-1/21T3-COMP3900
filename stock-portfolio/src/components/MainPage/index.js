import NavBar from "../NavBar";
import React from 'react';
function MainPage(){
    return (
        <div>
            <div className="navBar">
                <NavBar/>
            </div>

            <div className="mainContents">
                <p>Some contents here</p>
            </div>

            <div className="footer">
                <p>Some footer here</p>
            </div>
        </div>
    );
}
export default MainPage;