import { useRef, useState } from "react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from "yup";
import io from "socket.io-client";
let server = "http://localhost:3001";
const socket = io(server, {});
const Signup = () => {
    const [showErrorBox, setShowErrorBox] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showSuccessBox, setShowSuccessBox] = useState(false);

    socket.on("signupResponse", (data) => {
        console.log(data);
        if (data.success) {
            setShowSuccessBox(true);
            setShowErrorBox(false);
        } else {
            setShowErrorBox(true);
            setErrorMessage(data.message);
            setShowErrorBox(true);
        }
    });

    const initialValues = {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    };

    const validationSchema = Yup.object({
        username: Yup.string().required("Username is required"),
        email: Yup.string()
            .email("Invalid email address")
            .required("Email is required"),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match")
            .required("Confirm Password is required"),
    });

    const handleSubmit = (values, { setSubmitting }) => {
        socket.emit("signup", {
            username: values.username,
            email: values.email,
            password: values.password,
        });
        // Reset the form
        setSubmitting(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-secondary font-bold rounded-md shadow-lg p-8 max-w-sm w-full border">
                {showSuccessBox && (
                    <div className="bg-primary border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                        <strong className="font-bold">Success! </strong>
                        <span className="block sm:inline">Your account has been created! Please check your email for a confirmation link.</span>
                        <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                            <svg
                                className="fill-current h-6 w-6 text-green-500"
                                role="button"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                onClick={() => setShowSuccessBox(false)}

                            >
                                <title>Close</title>
                                <path
                                    fillRule="evenodd"
                                    d="M14.348 5.652a.5.5 0 010 .707L9.707 10l4.641 4.641a.5.5 0 11-.707.707L9 10.707l-4.641 4.64a.5.5 0 11-.707-.707L8.293 10 3.652 5.359a.5.5 0 01.707-.707L9 9.293l4.641-4.64a.5.5 0 01.707 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </span>
                    </div>
                )}
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    {({ errors, touched }) => (
                        <Form className="space-y-4">
                            <div>
                                <Field
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="Username"
                                    className="w-full border border-gray-300 rounded-md p-2"
                                />
                                {errors.username && touched.username && (
                                    <div className="text-red-500 mt-1">{errors.username}</div>
                                )}
                            </div>

                            <div>
                                <Field
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Email"
                                    className="w-full border border-gray-300 rounded-md p-2"
                                />
                                {errors.email && touched.email && <div className="text-red-500 mt-1">{errors.email}</div>}
                            </div>

                            <div>
                                <Field
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    className="w-full border border-gray-300 rounded-md p-2"
                                />
                                {errors.password && touched.password && (
                                    <div className="text-red-500 mt-1">{errors.password}</div>
                                )}
                            </div>

                            <div>
                                <Field
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    className="w-full border border-gray-300 rounded-md p-2"
                                />
                                {errors.confirmPassword && touched.confirmPassword && (
                                    <div className="text-red-500 mt-1">{errors.confirmPassword}</div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-200"
                            >
                                Signup
                            </button>
                        </Form>
                    )}
                </Formik>

                {showErrorBox && (
                    <div className="bg-primary border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
                        <span className="block sm:inline">{errorMessage}</span>
                        <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                            {/* put icon here */}
                        </span>
                    </div>
                )}
            </div>
        </div>


    );
};

export default Signup;
