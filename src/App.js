import React, { useState } from 'react';
import axios from 'axios';

import './app.css';

const baseUrl = process.env.NODE_ENV === 'production'
  ? 'https://r.bhlnk.com'
  : 'http://localhost:8080';

function Input({ onSubmit }) {
  const [value, setValue] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(value);
  };

  const handleChange = e => {
    setValue(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input className="row input" type="text" value={value} onChange={handleChange} />
      <br />
      <input className="row submit button" type="submit"/>
    </form>
  );
}

function Redirect({ url, redirect }) {
  return (
    <div className="redirect">
      <a href={redirect}>{redirect}</a>{':'}
      <br />
      {`(${url})`}
    </div>
  );
}

function App() {
  const [redirects, setRedirects] = useState({});

  const handleSubmit = async url => {
    if (redirects[url]) return;

    try {
      const redirect = await axios.put(`${baseUrl}/`, { url }).then(({ data }) => data);
      setRedirects({
        ...redirects,
        [url]: redirect,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="cntnr">
      <div className="row">
        {"short urls for days"}
      </div>
      <Input onSubmit={handleSubmit} />
      <div className="row">
        {Object.keys(redirects).map(url => (
          <Redirect key={url} url={url} redirect={redirects[url]} />
        ))}
      </div>
    </div>
  );
}

export default App;
