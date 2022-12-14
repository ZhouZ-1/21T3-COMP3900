import NavBar from '../NavBar';
import { useHistory } from 'react-router';

function MainPage() {
  const history = useHistory();
  let isAuthenticated = !!sessionStorage.getItem('token');
  return (
    <div>
      <div className='navBar'>
        <NavBar />
      </div>

      <div className='mainContents'>
        {isAuthenticated ? (
          <div
            class='btn-group'
            style={{
              textAlign: 'center',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              padding: '40px 25%',
              marginTop: '50px',
              marginBottom: '50px',
            }}
          >
            <button
              type='button'
              class='btn btn-warning'
              style={{ margin: '10px', color: 'white' }}
              onClick={() => history.push('/watchList')}
            >
              Go to Watchlist
            </button>
            <br />
            <button
              type='button'
              class='btn btn-warning'
              style={{ margin: '10px', color: 'white' }}
              onClick={() => history.push('/viewPortfolio')}
            >
              Go to Portfolio
            </button>
            <br />
            <button
              type='button'
              class='btn btn-warning'
              style={{ margin: '10px', color: 'white' }}
              onClick={() => history.push('/tax')}
            >
              Go to Financial
            </button>
          </div>
        ) : (
          <p>Log in!</p>
        )}
      </div>
    </div>
  );
}

export default MainPage;
