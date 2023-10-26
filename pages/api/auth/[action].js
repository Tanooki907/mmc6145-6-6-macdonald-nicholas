import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../../config/session"
import db from '../../../db'

// this file handles /api/auth/:action with any request method (GET, POST, etc)
export default withIronSessionApiRoute(
  async function handler(req, res) {
    const { action } = req.query;

    if (action === 'login') {
      if (req.method !== 'POST') {
        return res.status(404).end
      }
      await login(req, res);
    }else if (action === 'logout') {
      if (req.method !== 'POST') {
        return res.status(404).end
      }
      await logout(req, res);
    }else if (action === 'signup') {
      if (req.method !== 'POST') {
        return res.status(404).end
      }
      await signup(req, res);
    }else{
    return res.status(404).end()
    }
  },
  sessionOptions
)

async function login(req, res) {
  const { username, password } = req.body
  try {
    const user = await db.auth.login(username, password)
    req.session.user = {
      username: user.username,
      id: user.id
    }
    await req.session.save()
    res.status(200).end()
  } catch(err) {
    res.status(400).json({error: err.message})
  }
}

async function logout(req, res) {
  await req.session.destroy()
  res.status(200).end()
}

async function signup(req, res) {
  try {
    const {username, password} = req.body
    const user = await db.user.create(username, password)
    req.session.user = {
      username: user.username,
      id: user.id
    }
    await req.session.save()
    res.redirect('/search')
  } catch(err) {
    res.status(400).json({error: err.message})
  }
}