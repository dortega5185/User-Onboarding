import React, { useState, useEffect } from 'react'
import axios from 'axios';
import * as yup from 'yup';

const formSchema = yup.object().shape({
  name: yup.string().required("Name is a required field."),
  email: yup
    .string()
    .email("Must be a valid email address.")
    .required("Must include email address."),
  password: yup.string().required('Password is a required field.'),
  terms: yup.boolean().oneOf([true], "please agree to terms of use"),
});

const Form = () => {
  // state for whether our button should be disabled or not.
  const [buttonDisabled, setButtonDisabled] = useState(true);

  // managing state for our form inputs
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    terms: "",
  });

  // state for our errors
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    terms: "",
  });

  // new state to set our post request too. So we can console.log and see it.
  const [post, setPost] = useState([]);

  /* Each time the form value state is updated, check to see if it is valid per our schema. 
  This will allow us to enable/disable the submit button.*/
  useEffect(() => {
      /* We pass the entire state into the entire schema, no need to use reach here. 
    We want to make sure it is all valid before we allow a user to submit
    isValid comes from Yup directly */
    formSchema.isValid(formState).then(valid => {
      setButtonDisabled(!valid);
    })
  }, [formState])

  const formSubmit = e => {
    e.preventDefault();
    axios
      .post("https://reqres.in/api/users", formState)
      .then(res => {
        setPost(res.data); // get just the form data from the REST api

        // reset form if successful
        setFormState({
          name: "",
          email: "",
          terms: "",
          positions: "",
          motivation: ""
        });
      })
      .catch(err => console.log(err.response));
  };

  const validateChange = e => {
    // Reach will allow us to "reach" into the schema and test only one part.
    yup
      .reach(formSchema, e.target.name)
      .validate(e.target.value)
      .then(valid => {
        setErrors({
          ...errors,
          [e.target.name]: ""
        });
      })
      .catch(err => {
        setErrors({
          ...errors,
          [e.target.name]: err.errors[0]
        });
      });
  };

  const inputChange = e => {
    /* e.persist allows us to use the synthetic event in an async manner.
    We need to be able to use it after the form validation */
    e.persist();
    const newFormData = {
      ...formState,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value
    }
    /* If you want to access the event properties in an asynchronous way, you should call event.persist() on the event, which will remove the synthetic event from the pool and allow references to the event to be retained by user code. */
    validateChange(e);
    setFormState(newFormData);
  }
  





    return (
      <>
        <form onSubmit={formSubmit}>
          <label htmlFor="name">
            Name:
            <input
              name="name"
              type="text"
              placeholder="Name"
              id="name"
              value={formState.name}
              onChange={inputChange}
            />
            {errors.name.length > 0 ? (
              <p className="error">{errors.name}</p>
            ) : null}
          </label>
          <label htmlFor="email">
            Email:
            <input
              name="email"
              type="email"
              placeholder="bob@gmail.com"
              id="email"
              value={formState.email}
              onChange={inputChange}
            />
            {errors.email.length > 0 ? (
              <p className="error">{errors.email}</p>
            ) : null}
          </label>
          <label htmlFor="password">
            Password:
            <input
              name="password"
              type="password"
              placeholder="Password"
              id="password"
              value={formState.password}
              onChange={inputChange}
            />
            {errors.name.length > 0 ? (
              <p className="error">{errors.password}</p>
            ) : null}
          </label>
          <label htmlFor="terms" className="terms">
            <input
              type="checkbox"
              name="terms"
              checked={formState.terms}
              value={formState.terms}
              onChange={inputChange}
            />
            Terms & Conditions
          </label>
          {/* displaying our post request data */}
          <pre>{JSON.stringify(post, null, 2)}</pre>
          <button disabled={buttonDisabled}>Submit</button>
        </form>
      </>
    );
}

export default Form;