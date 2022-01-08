import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Navigate as Redirect,
  Routes as Switch
} from "react-router-dom";

import './App.css';
import Welcome from './components/Welcome';
import ChatMain from './components/Chat';

import { RootState, AppDispatch } from './redux/store';
import { toggleLoggedIn } from './redux/index';

const App: React.FC<Props> = ({ loggedIn }: Props) => {
  return (
    <div>
      <Router>
        <Switch>
          <Route path="/welcome" element={< Welcome />} />

          <Route path="/chat" element={loggedIn ? < ChatMain /> : <Redirect to="/welcome"/>} />
          <Route path="/*" element={loggedIn ? <Redirect to="/chat"/> : <Redirect to="/welcome"/>} />
        </Switch>
      </Router>
    </div>
  );
}

const mapStateToProps = (state: RootState) => ({
    loggedIn: state.loggedIn.reducerToggleLoggedIn.loggedIn 
});

const dispatchToProps = (dispatch: AppDispatch) => ({
    toggleLoggedIn: (loggedIn: boolean) => dispatch( toggleLoggedIn(loggedIn) )
});

const connector = connect(mapStateToProps, dispatchToProps);
type Props = ConnectedProps<typeof connector>

export default connector(App);