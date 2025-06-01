import { compare } from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import db from "./db"
import type { User } from "@/types"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

export async function createToken(payload: { userId: number; email: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as { userId: number; email: string }
  } catch {
    return null
  }
}

export async function login(email: string, password: string) {
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as User | undefined

  if (!user) {
    return null
  }

  const isValid = await compare(password, user.password)
  if (!isValid) {
    return null
  }

  const token = await createToken({ userId: user.id, email: user.email })

  cookies().set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
  })

  return { id: user.id, email: user.email, name: user.name }
}

export async function logout() {
  cookies().delete("auth-token")
}

export async function getCurrentUser() {
  const token = cookies().get("auth-token")?.value

  if (!token) {
    return null
  }

  const payload = await verifyToken(token)
  if (!payload) {
    return null
  }

  const user = db.prepare("SELECT id, email, name FROM users WHERE id = ?").get(payload.userId) as
    | Omit<User, "password">
    | undefined
  return user || null
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Authentication required")
  }
  return user
}
