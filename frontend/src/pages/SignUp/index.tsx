import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './style.css';

function SignUp() {
    const navigate = useNavigate();
    const [isReaded, setIsReaded] = useState<boolean>(false);

    function alreadyHaveAnAccount(){
        navigate('/');
    }

    function handleCheckboxReadTerms() {
        setIsReaded(!isReaded);
    }

    async function signUp(event: FormEvent<HTMLFormElement>){
        event.preventDefault();

        navigate('/');
    }

    return (
        <div className="sign-up-area">
            <form onSubmit={signUp}>
                <h1>SIGN-UP</h1>

                <label className="inpt-label">FIRST NAME:</label>
                <input 
                    type="text" 
                    name="first_name" 
                    placeholder="Your name"
                />
                <label className="inpt-label">EMAIL:</label>
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Your email"
                />
                <label className="inpt-label">PASSWORD:</label>
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Your password"
                />
                <label className="inpt-label">CONFIRM PASSWORD:</label>
                <input 
                    type="password" 
                    name="confirm_password" 
                    placeholder="Reapet your password"
                />

                <div className='terms'>
                    <input type="checkbox" name="read_terms" onChange={handleCheckboxReadTerms}/>
                    <span>By creating an account you agree to the Terms of Use <br/>and Privacy Policy</span>
                </div>

                <button type="submit" disabled={!isReaded}>SIGN-UP</button>
            </form>
            <a className="link-already-have-account" onClick={alreadyHaveAnAccount}>Already have an account? Click here</a>
        </div>
    );
}

export default SignUp;