import './style.css';

function SignIn() {
    return (
        <div className="sign-in-area">
            <h1>SIGN-IN</h1>

            <div className="line-input">
                <label>EMAIL:</label>
                <input type="email" />
            </div>
            <div className="line-input">
                <label>PASSWORD:</label>
                <input type="password" />
            </div>

            <button>SIGN-IN</button>
            <a className="link-forgot-password">Forgot your password? Click here</a>
            <a className="link-create-account">Don't have an account yet? Click here to create an account</a>
        </div>
    );
}

export default SignIn;