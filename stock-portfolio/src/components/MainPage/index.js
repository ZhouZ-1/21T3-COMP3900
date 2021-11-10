import NavBar from "../NavBar";
import { useHistory } from "react-router";

function MainPage(){
    const history = useHistory();
    let isAuthenticated = !!localStorage.getItem("token")
    return (
        <div>
            <div className="navBar">
                <NavBar/>
            </div>

            <div className="mainContents">
                {isAuthenticated ? 
                (<div>
                    <button type="button" class="btn btn-warning" onClick={() => history.push('/watchList')}>Go to the watch list</button>
                    <br></br>
                    <button type="button" class="btn btn-warning" onClick={() => history.push('/viewPortfolio')}>Go to the Portfolio</button>
                    <br></br>
                    <button type="button" class="btn btn-warning" onClick={() => history.push('/tax')}>Go to the Financial</button>
                </div>): 
                (<p>Some contents here</p>)}
            </div>

            <div className="footer">
                <p>Some footer here</p>
            </div>
        </div>
    );
}
export default MainPage;