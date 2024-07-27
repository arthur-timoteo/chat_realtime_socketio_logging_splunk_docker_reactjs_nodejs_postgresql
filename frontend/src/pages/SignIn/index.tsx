import { useNavigate } from 'react-router-dom';
import './style.css';
import { FormEvent } from 'react';

function SignIn() {
    const navigate = useNavigate();

    function doNotHaveAnAccount(){
        navigate('/signup');
    }
    
    async function signIn(event: FormEvent<HTMLFormElement>){
        event.preventDefault();

        navigate('/home');
    }

    return (
        <div className="sign-in-area">
            <form onSubmit={signIn}>
                <h1>SIGN-IN</h1>

                <div className="line-input">
                    <label>EMAIL:</label>
                    <input 
                        type="email"
                        name="email"
                        placeholder="Your email" 
                    />
                </div>
                <div className="line-input">
                    <label>PASSWORD:</label>
                    <input 
                        type="password"
                        name="password"
                        placeholder="Your password" 
                    />
                </div>

                <button type="submit">SIGN-IN</button>
            </form>

            <a className="link-forgot-password">Forgot your password? Click here</a>
            <a className="link-create-account" onClick={doNotHaveAnAccount}>Don't have an account yet? Click here to create an account</a>
        </div>
    );
}

export default SignIn;