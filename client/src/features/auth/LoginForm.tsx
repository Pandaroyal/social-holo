import { useAppSelector, useAppDispatch } from "../../app/hooks"
import { selectAllUsers } from "../users/usersSlice"
import { login, updateStatus } from "./authSlice";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../../components/Spinner";
import { Status } from "../../utils/constants";
import { Alert } from "@mui/material";
import { showError, toastDisplay } from '../../utils/helper';
import  $ from 'jquery';
import { result } from "lodash";

interface LoginFormFields extends HTMLFormControlsCollection {
    email: HTMLSelectElement
    password: HTMLInputElement
}

interface LoginFormElements extends HTMLFormElement {
    readonly elements: LoginFormFields
}

export const LoginForm = () => {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const users = useAppSelector(selectAllUsers)
    const { status, error } = useAppSelector(state => state.auth)

    const usersOptions = users.map(user => (
        <option key={user.id} value={user.id}>
          {user.name}
        </option>
    ))

    const handleSubmit = async (e: React.FormEvent<LoginFormElements>) => {
      console.log("submission start");
      e.preventDefault()
      console.log("submission end");
      const { elements } = e?.currentTarget
      const email = elements?.email?.value.trim()
      const password = elements?.password?.value.trim()
      console.log("userId -> ", email, "password -> ", password);
      if(email && password){
          console.log("email -> ", email);
          try{
            const result = await dispatch(login({email, password}))
            console.log("result -> ", result);
          }catch(err){
            console.log("err -> ", err);
          }
          if (login.fulfilled.match(result)) {
            console.log("Login successful");
            // Handle any redirect logic or set authenticated state here
          } else {
            console.log("Login failed");
            // Handle failure case here
          }
      }else{
          console.warn("Both fields are required.");
          // Log if either field is empty
      }
    }

    if(status === Status.loading) return <Spinner text={"Loading..."} size={"5"} />
    else if(status === Status.succeeded) {
      console.log("succeeded");
      navigate("/posts")
      dispatch(updateStatus(Status.idle))
    } 
    else if(status === Status.failed) error ? showError(error) : toastDisplay("Login failed");
    if(!users || users.length === 0){
        return <Spinner text={"Loading..."} size={"5"} />
    }

    return (
      <section className="mt-10 bg-gray-800 text-white p-6 rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-3xl font-bold mb-4 text-blue-400">Welcome to Tweeter!</h2>
        <h3 className="text-xl font-semibold mb-6">Please log in:</h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Select */}
          <div>
            <label htmlFor="email" className="block mb-2 font-semibold">User:</label>
            <select
              id="email"
              name="email"
              required
              className="w-full p-2 bg-gray-800 text-white rounded border border-gray-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">Select</option>
              {usersOptions}
            </select>
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 font-semibold">Password:</label>
            <input
              type="text"
              id="password"
              defaultValue=""
              required
              className="w-full p-2 bg-gray-800 text-white rounded border border-gray-600 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          <Alert severity="error" id='signup-error' sx={{ display: 'none' }}></Alert>
          {/* Log In Button */}
          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold">
            Log In
          </button>
        </form>
      </section>
    )
}