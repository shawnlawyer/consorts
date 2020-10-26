import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'
import { withRouter } from 'react-router';
import auth0Client from './Auth';
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
            <Layout style={{ background:'#fff', height:'100vh' }}>
                <LeftMenu/>
                <RightFloatingChat/>
                <BottomDrawerTextExpander/>
                <Content>
                    <Switch>
                      { !this.state.checkingSession && <Route exact path='/' component={HomePage} /> }
                      { !auth0Client.isAuthenticated() &&
                        <Route exact path='/callback' component={Auth0Callback} />
                      }
                      { !this.state.checkingSession && auth0Client.isAuthenticated() &&
                        <Route path="/classifiers" render={(props) => (<AgentsList {...props} type={1} />)} />
                      }
                      { !this.state.checkingSession && auth0Client.isAuthenticated() &&
                        <Route path="/chatbots" render={(props) => (<AgentsList {...props} type={2} />)} />
                      }
                      { !this.state.checkingSession && auth0Client.isAuthenticated() &&
                        <Route path="/module/:uuid" component={ModuleBuilder}/>
                      }
                      { !this.state.checkingSession &&
                        <Route path="/chat/:identifier" component={Chat}/>
                      }
                    </Switch>
                </Content>
            </Layout>
        </div>
    );
  }
}

export default withRouter(App);
