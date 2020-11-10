import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import { withRouter } from 'react-router';
import auth0Client from './Auth';
import ProtectedRoute from './components/ProtectedRoute';
import Auth0Callback from './components/Auth0Callback';
import HomePage from './components/HomePage';
import Chat from './components/Chat';
import ModuleBuilder from './components/ModuleBuilder';
import AgentsList from './components/AgentsList';
import PushListeners from './components/PushListeners';
import LeftMenu from './components/LeftMenu';
import RightFloatingChat from './components/RightFloatingChat';
import BottomDrawerTextExpander from './components/BottomDrawerTextExpander';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import './stylesheets/App.css';

const { Content } = Layout;


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      checkingSession: true,
    }
  }

  async componentDidMount() {
    if (this.props.location.pathname === '/callback') {
      this.setState({checkingSession:false});
      return;
    }
    try {
      await auth0Client.silentAuth();
      this.forceUpdate();
    } catch (err) {
      if (err.error !== 'login_required') console.log(err.error);
    }
    this.setState({checkingSession:false});
  }

  render() {
    return (
        <div className="App">
            <PushListeners />
            { !this.state.checkingSession &&
            <Layout style={{ background:'#fff', height:'100vh' }}>
                <LeftMenu/>
                <RightFloatingChat/>
                <BottomDrawerTextExpander/>
                <Content>
                    <Switch>
                        <Route exact path='/' component={HomePage} />
                        { !auth0Client.isAuthenticated() &&
                        <Route exact path='/callback' component={Auth0Callback} />
                        }
                        <ProtectedRoute path="/classifiers" component={AgentsList} type={1} />
                        <ProtectedRoute path="/chatbots" component={AgentsList} type={2} />
                        <ProtectedRoute path="/module/:uuid" component={ModuleBuilder}/>
                        <Route path="/chat/:identifier" component={Chat}/>
                    </Switch>
                </Content>
            </Layout>
            }
        </div>
    );
  }
}

export default withRouter(App);
