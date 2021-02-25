import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { AuthProvider } from '../contexts/AuthContext';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';

function App() {
  return (
    <Container
      className='d-flex align-items-center justify-content-center'
      style={{ minHeight: '100vh' }}>
      <div className='w-100' style={{ maxWidth: '400px' }}>
        <BrowserRouter>
          <AuthProvider
            domain={process.env.REACT_APP_AUTH0_DOMAIN}
            clientID={process.env.REACT_APP_CLIENT_ID}
            responseType={'token id_token'}
            redirectUri={window.location.origin}>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/login' component={Login} />
              <Route path='/signup' component={Signup} />
            </Switch>
          </AuthProvider>
        </BrowserRouter>
      </div>
    </Container>
  );
}

export default App;
