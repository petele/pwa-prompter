import { h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style.css';

export const Account = () => {
  return (
    <Link activeClassName={style.active} href="/account">
      Account
    </Link>
  );
}
