import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../config/session"
import db from '../../db'

// this handler runs for /api/book with any request method (GET, POST, etc)
export default withIronSessionApiRoute(
  async function handler(req, res) {
    if (req.method === 'POST') {
      // Add a book using db.book.add with request body
      const book = JSON.parse(req.body);
      if (!req.session.user) {
        // User is not logged in
        return res.status(401).end();
      }
      try {
        const addedBook = await db.book.add(req.session.user.id, book);
        if (addedBook) {
          return res.status(200).end();
        } else {
          req.session.destroy();
          return res.status(401).end();
        }
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    } else if (req.method === 'DELETE') {
      // Remove a book using db.book.remove with request body
      const book = JSON.parse(req.body);
      if (!req.session.user) {
        // User is not logged in
        return res.status(401).end();
      }
      try {
        const removed = await db.book.remove(req.session.user.id, book.id);
        if (removed) {
          return res.status(200).end();
        } else {
          req.session.destroy();
          return res.status(401).end();
        }
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    } else {
      // Respond with 404 for all other requests
      return res.status(404).end()
    }
  },
  sessionOptions
)