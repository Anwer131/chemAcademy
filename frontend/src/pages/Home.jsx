import React, { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="home">
      <h2>Welcome {user ? user.firstName : 'Guest'}</h2>
      {user ? (
        <>
          <section>
            <h3>Your Courses</h3>
            {/* List user-specific courses here */}
          </section>
          <section>
            <h3>Recommendations</h3>
            {/* Display recommended tutorials, videos, etc. */}
          </section>
        </>
      ) : (
        <p>Please log in to view your courses and recommendations.</p>
      )}
    </div>
  );
};

export default Home;
