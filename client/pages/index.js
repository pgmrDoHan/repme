import { useState } from 'react';

function HomePage() {
  const [data, setData] = useState({});
  const [result, setResult] = useState("");

  const onChange = (event) => {
    const { target: { name, value } } = event;

    if (name === "username") {
      setData((prevState) => ({
        ...prevState,
        username: value
      }))
    }
    else if (name === "email") {
      setData((prevState) => ({
        ...prevState,
        email: value
      }))
    }
    else if (name === "password") {
      setData((prevState) => ({
        ...prevState,
        pwd: value
      }))
    }
  }

  const onSubmit = (event) => {
    event.preventDefault();
    fetch(
      `http://127.0.0.1:8080/account/${event.target.name}`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setResult(JSON.stringify(result))
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  return (
    <div>
      <form name='sign-up' onSubmit={onSubmit}>
        <input name="username" required value={data.username} onChange={onChange} />
        <input name="email" required value={data.email} onChange={onChange} />
        <input name="password" required value={data.pwd} onChange={onChange} />
        <button type="submit">sign-up</button>
      </form>
      <hr></hr>
      <form name='sign-in' onSubmit={onSubmit}>
        <input name="email" value={data.email} required onChange={onChange} />
        <input name="password" required value={data.pwd} onChange={onChange} />
        <button type="submit">sign-in</button>
      </form>
      <hr />
      <p id='result'>{result.toString()}</p>
    </div>
  );
}

export default HomePage