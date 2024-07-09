import './style.css';

function SignUp() {
    return (
        <div className="sign-up-area">
            <h1>SIGN-UP</h1>

            <label>FIRST NAME:</label>
            <input type="text" />
            <label>EMAIL:</label>
            <input type="email" />
            <label>PASSWORD:</label>
            <input type="password" />
            <label>CONFIRM PASSWORD:</label>
            <input type="password" />

            <button>SIGN-UP</button>
            <a className="link-already-have-account">Already have an account? Click here</a>
        </div>
    );
}

export default SignUp;