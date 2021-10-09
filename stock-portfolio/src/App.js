import './App.css';
import MainPage from './components/MainPage/index';
import SignIn from './components/SignIn/index';
import SignUp from './components/SignUp/index';
import UpdateAccount from './components/UpdateAccount/index';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={MainPage}/>
        <Route exact path='/signIn' component={SignIn}/>
        <Route exact path='/signUp' component={SignUp}/>
        <Route exact path='/updateAccount' component={UpdateAccount}/>
      </Switch>
    </Router>
  );
}

export default App;
