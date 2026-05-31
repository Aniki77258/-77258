import { NextRequest, NextResponse } from "next/server"
import {
  getNotifications,
  createNotification,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  getUnreadNotificationCount,
} from "@/lib/services/data-service"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId") || "u_admin_001"
  const type = searchParams.get("type") // optional filter
  const unreadOnly = searchParams.get("unreadOnly") === "true"
  const countOnly = searchParams.get("countOnly") === "true"

  if (countOnly) {
    const result = await getUnreadNotificationCount(userId)
    return NextResponse.json(result)
  }

  const result = await getNotifications(userId)

  // Filter by type if specified
  if (result.data && (type || unreadOnly)) {
    let filtered = result.data
    if (type) {
      filtered = filtered.filter((n) => n.type === type)
    }
    if (unreadOnly) {
      filtered = filtered.filter((n) => !n.read)
    }
    return NextResponse.json({ ...result, data: filtered, total: filtered.length })
  }

  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = await createNotification(body)
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    return NextResponse.json(result, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, action } = body

    if (action === "mark_all_read") {
      const result = await markAllNotificationsRead(body.userId || "u_admin_001")
      if (result.error) return NextResponse.json({ error: result.error }, { status: 400 })
      return NextResponse.json(result)
    }

    if (!id && action !== "mark_all_read") {
      return NextResponse.json({ error: "id is required" }, { status: 400 })
    }

    const result = await markNotificationRead(id)
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 })
    }
    const result = await deleteNotification(id)
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
