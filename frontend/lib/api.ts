export type Post = {
  id: number
  title: string
  content: string
  category: string
  status: "publish" | "draft" | "thrash"
  created_date: string
  updated_date: string
}

export type PostInput = {
  title: string
  content: string
  category: string
  status: "publish" | "draft" | "thrash"
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export async function getPosts(
  limit = 100,
  offset = 0
): Promise<Post[]> {
  const response = await fetch(
    `${API_URL}/article/${limit}/${offset}`,
    { cache: "no-store" }
  )

  if (!response.ok) {
    throw new Error("Failed to fetch articles")
  }

  return response.json()
}

export async function getPost(id: string): Promise<Post> {
  const response = await fetch(
    `${API_URL}/article/${id}`,
    { cache: "no-store" }
  )

  if (!response.ok) {
    throw new Error("Article not found")
  }

  return response.json()
}

export async function createPost(input: PostInput): Promise<Post> {
  const response = await fetch(`${API_URL}/article/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to create article")
  }

  return response.json()
}

export async function updatePost(
  id: string,
  input: PostInput
): Promise<Post> {
  const response = await fetch(`${API_URL}/article/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to update article")
  }

  return response.json()
}

export async function deletePost(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/article/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete article")
  }
}