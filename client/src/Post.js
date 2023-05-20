// import {formatISO9075} from "date-fns";
import { Link } from 'react-router-dom';

export default function Post({
  _id,
  title,
  summary,
  cover,
  content,
  createdAt,
  author,
}) {
  return (
    <div className="post">
      <div className="image">
        <img src="https://logos-world.net/wp-content/uploads/2021/11/GoKart-New-Logo.png" alt="" />
      </div>
      <div className="texts">
        <h2>GO Cart</h2>
        <p className="info">
          <a className="author">Arya</a>
          <time>
            2023-10-19 03:19
          </time>
        </p>
        <p className="summary">This is the summary for the Go-Cart. It's super fast. So is your mom. Bring your mom, we are gonna get koochies for tonight.</p>
      </div>
    </div>
  );
}
