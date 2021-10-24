import './App.css';
import React from 'react';
import MainPage from './components/MainPage/index';
import SignIn from './components/SignIn/index';
import SignUp from './components/SignUp/index';
import AccountPage from './components/AccountPage/index';
import ForgotMyPassword from './components/ForgotMyPassword';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import StockDetails from './components/StockDetails';
import StockList from './components/StockList';
import PortfolioOverview from './components/PortfolioOverview';
import CreatePortfolio from './components/CreatePortfolio';

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
        <Route exact path='/createPortfolio' component={CreatePortfolio}/>

      </Switch>
    </Router>
  );
}

export default App;
