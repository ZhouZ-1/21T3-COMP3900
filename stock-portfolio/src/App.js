import './App.css';
import MainPage from './components/MainPage/index';
import SignIn from './components/SignIn/index';
import SignUp from './components/SignUp/index';
import Updatepwd from './components/Updatepwd/index';
import AccountPage from './components/AccountPage/index';
import ForgotMyPassword from './components/ForgotMyPassword';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={MainPage}/>
        <Route exact path='/signIn' component={SignIn}/>
        <Route exact path='/signUp' component={SignUp}/>
        <Route exact path='/updatepwd' component={AccountPage}/>
        <Route exact path='/account' component={AccountPage}/>
        <Route exact path='/resetPassword' component={ForgotMyPassword}/>



      </Switch>
    </Router>
  );
}

export default App;
