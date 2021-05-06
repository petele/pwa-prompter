import { h, Component } from 'preact';

// import { auth, googleAuthProvider } from '../firebase';

import { auth, googleAuthProvider } from '../firebase';

const SignIn = ({isSignedIn}) => {

  const text = isSignedIn ? 'Sign out' : 'Sign in';

  async function doSignIn() {
    if (isSignedIn) {
      // sign out
      return;
    }
    const r = await auth.signInWithPopup(googleAuthProvider);
    console.log('signed in', r);
  }

  return (
    <button onClick={doSignIn}>
      {text}
    </button>
  );
}

export default SignIn;

// export default class SignIn extends Component {
//   pete = () => {
//     console.log('asdf');
//   }

//   doSignIn = async () => {
//     console.log('sign in');
//     const result = await auth.signInWithPopup(googleAuthProvider);
//     console.log('result', result);
//   }

//   render() {
//     return (
//       <section>
//         <button onClick={this.doSignIn}>
//           Sign In
//         </button>
//       </section>
//     );
//   }
// }
