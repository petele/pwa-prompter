import { h } from 'preact';
import {useEffect, useState} from "preact/hooks";
import style from './style.css';

import { nanoid } from 'nanoid';
import { get, set } from 'idb-keyval';

// Note: `user` comes from the URL, courtesy of our router
const Profile = ({ user }) => {
  const [time, setTime] = useState(Date.now());
  const [count, setCount] = useState(10);

  useEffect(() => {
    let timer = setInterval(() => setTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const clickMe = function() {
    console.log('clicked');
    set('john', 'this is my script');
  }

  return (
    <div class={style.profile}>
      <h1>Profile: {user}</h1>
      <p>This is the user profile for a user named { user }.</p>

      <div>Current time: {new Date(time).toLocaleString()}</div>

      <p>
        <button onClick={clickMe}>Click Me</button>
        {' '}
        Clicked {count} times.
      </p>
    </div>
  );
}

export default Profile;
