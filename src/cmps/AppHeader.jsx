import { NavLink, useNavigate } from "react-router-dom";
import { UserMsg } from "./UserMsg";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/actions/user.actions";
import { LoginSignup } from "./LoginSignup";

export function AppHeader() {
    const user = useSelector((storeState) => storeState.userModule.loggedInUser)
	const dispatch = useDispatch()
    const navigate = useNavigate()


	async function onLogout() {
        try {
            navigate("/")
            await logout()
            showSuccessMsg("logged out successfully")
        } catch (error) {
            showErrorMsg("Oops try again")
        }
	}

	return (
		<header className='app-header full main-layout'>
			<section className='header-container'>
				<h1>React Todo App</h1>
				<section className='header-content'>
					{user ? (
						<section className='user-details'>
							<h4>Hello {user.fullname}</h4>
							<button onClick={onLogout}>Logout</button>
						</section>
					) : (
						<section>
							<LoginSignup />
						</section>
					)}
					<nav className='app-nav'>
						<NavLink to='/'>Home</NavLink>
						<NavLink to='/about'>About</NavLink>
						<NavLink to='/toy'>Toys</NavLink>
					</nav>
				</section>
			</section>
			<UserMsg />
		</header>
	)
}

