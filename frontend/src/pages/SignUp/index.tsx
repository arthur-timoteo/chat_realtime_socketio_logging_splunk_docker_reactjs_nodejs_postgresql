import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './style.css';
import { api } from '../../services/axios';
import { FaSpinner } from 'react-icons/fa6';

interface IMessageToUser {
    style: 'success' | 'danger' | undefined,
    message: string | undefined
}

function SignUp() {
    const navigate = useNavigate();
    
    const [firstName, setFirstName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordConfirm, setPasswordConfirm] = useState<string>('');
    const [isLoading, setIsloading] = useState(false);

    const [showSignUpButton, setShowSignUpButton] = useState<boolean>(false);
    const [messageToUser, setMessageToUser] = useState<IMessageToUser>({ style: undefined, message: undefined });

    function alreadyHaveAnAccount(){
        navigate('/');
    }

    function handleCheckboxReadTerms() {
        setShowSignUpButton(!showSignUpButton);
    }

    async function signUp(event: FormEvent<HTMLFormElement>){
        event.preventDefault();

        setMessageToUser({ style: undefined, message: undefined });
        setIsloading(true);
        setShowSignUpButton(false);

        if(!firstName || !email || !password || !passwordConfirm){
            setMessageToUser({ style: 'danger', message: 'There are blank fields' });
            setIsloading(false);
            return;
        }

        if(password != passwordConfirm){
            setMessageToUser({ style: 'danger', message: `Passwords don't match` });
            setIsloading(false);
            return;
        }

        try{
            await api.post('/account/signup', {
                first_name: firstName,
                email,
                password_signin: password,
                ip_address: "111.111.1.1"
            });

            setMessageToUser({ style: 'success', message: 'Registration successfully made' });

            setFirstName('');
            setEmail('');
            setPassword('');
            setPasswordConfirm('');
            handleCheckboxReadTerms();
            setIsloading(false);

            navigate('/');
        }
        catch {
            setMessageToUser({ style: 'danger', message: 'Error to try sign-up' });
        }

        setIsloading(false);
    }

    return (
        <div className="sign-up-area">
            <form onSubmit={signUp}>
                <h1>SIGN-UP</h1>

                {messageToUser.message && (<div className={messageToUser.style} >{messageToUser.message}</div>)}

                <label className="inpt-label">FIRST NAME:</label>
                <input 
                    type="text" 
                    name="first_name" 
                    placeholder="Your name"
                    value={firstName}
                    onChange={ event => setFirstName(event.target.value) }
                />
                <label className="inpt-label">EMAIL:</label>
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Your email"
                    value={email}
                    onChange={ event => setEmail(event.target.value) }
                />
                <label className="inpt-label">PASSWORD:</label>
                <input 
                    type="password" 
                    name="password" 
                    placeholder="Your password"
                    value={password}
                    onChange={ event => setPassword(event.target.value) }
                />
                <label className="inpt-label">CONFIRM PASSWORD:</label>
                <input 
                    type="password" 
                    name="confirm_password" 
                    placeholder="Reapet your password"
                    value={passwordConfirm}
                    onChange={ event => setPasswordConfirm(event.target.value) }
                />

                <div className='terms'>
                    <input type="checkbox" name="read_terms" checked={showSignUpButton} onChange={handleCheckboxReadTerms}/>
                    <span>By creating an account you agree to the Terms of Use <br/>and Privacy Policy</span>
                </div>

                <button type="submit" disabled={!showSignUpButton}>
                    {!isLoading ? (<>SIGN-UP</>) 
                    : (<FaSpinner className="icon" />)}
                </button>
            </form>
            <a className="link-already-have-account" onClick={alreadyHaveAnAccount}>Already have an account? Click here</a>
        </div>
    );
}

export default SignUp;