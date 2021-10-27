import React from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import MainPage from './components/MainPage';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import AccountPage from './components/AccountPage';
import ForgotMyPassword from './components/ForgotMyPassword';
import StockDetails from './components/StockDetails';
import StockList from './components/StockList';
import PortfolioOverview from './components/PortfolioOverview';
import PortfolioPage from './components/PortfolioPage';


function App() {
  return (
    <Router>
      <Switch>
        <Route exact path='/' component={MainPage}/>
        <Route exact path='/signIn' component={SignIn}/>
        <Route exact path='/signUp' component={SignUp}/>
        <Route exact path='/updatepwd' component={AccountPage}/>
        <Route exact path='/stockDetails/:symbol' component={StockDetails}/>
        <Route exact path='/account' component={AccountPage}/>
        <Route exact path='/resetPassword' component={ForgotMyPassword}/>
        <Route exact path='/stockList' component={StockList}/>
        <Route exact path='/viewPortfolio' component={PortfolioOverview}/>
        <Route path='/portfolio/' component={PortfolioPage}/>

      </Switch>
    </Router>
  );
}

export default App;
