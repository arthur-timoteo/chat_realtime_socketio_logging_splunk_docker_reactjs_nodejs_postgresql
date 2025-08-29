import { useNavigate } from 'react-router-dom';
import './style.css';
import { FormEvent, useState } from 'react';
import { FaSpinner } from 'react-icons/fa6';
import { api } from '../../services/axios';
import { Log } from '../../services/logger';

interface IMessageToUser {
    style: 'success' | 'danger' | undefined,
    message: string | undefined
}

function SignIn() {
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [messageToUser, setMessageToUser] = useState<IMessageToUser>({ style: undefined, message: undefined });
    const [isLoading, setIsloading] = useState(false);

    function doNotHaveAnAccount(){
        navigate('/signup');
    }
    
    async function signIn(event: FormEvent<HTMLFormElement>){
        event.preventDefault();

        if(!email || !password){
            setMessageToUser({ style: 'danger', message: 'There are blank fields' });
            await Log('The supplied object is incorrect', 'WARN', 'SI-I-SI-0', null);
            return;
        }

        setIsloading(true);
        
        try{
            const result = await api.post('/account/signin', {
                email,
                password_signin: password
            });
    
            setIsloading(false);
            navigate('/home', { state: { pk: result.data.data.pk } });
        }
        catch (error) {
            setMessageToUser({ style: 'danger', message: 'Error to try sign-up' });
            await Log('Error to try sign in', 'ERROR', 'SI-I-SI-1', `error: ${error as string}`);
        }

        setIsloading(false);
    }

    return (
        <div className="sign-in-area">
            <form onSubmit={signIn}>
                <h1>SIGN-IN</h1>

                {messageToUser.message && (<div className={messageToUser.style} >{messageToUser.message}</div>)}

                <div className="line-input">
                    <label>EMAIL:</label>
                    <input 
                        type="email"
                        name="email"
                        placeholder="Your email" 
                        value={email}
                        onChange={ event => setEmail(event.target.value) }
                    />
                </div>
                <div className="line-input">
                    <label>PASSWORD:</label>
                    <input 
                        type="password"
                        name="password"
                        placeholder="Your password" 
                        value={password}
                        onChange={ event => setPassword(event.target.value) }
                    />
                </div>

                <button type="submit" disabled={isLoading} title="Sign-in">
                    {!isLoading ? (<>SIGN-IN</>) 
                    : (<>Loading <FaSpinner className="icon" /></>)}
                </button>
            </form>

            <a className="link-forgot-password" title="Forgot your password? Click here">Forgot your password? Click here</a>
            <a className="link-create-account" onClick={doNotHaveAnAccount} title="Click here to create an account">Don't have an account yet? Click here to create an account</a>
        </div>
    );
}

export default SignIn;