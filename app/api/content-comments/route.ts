import { NextResponse } from "next/server";
import { z } from "zod";
import { createContentComment, listApprovedContentComments } from "@/lib/supabase/mahabah";
import { routeErrorBody } from "@/lib/api/route-errors";

const schema = z.object({
  contentSlug: z.string().trim().min(1).max(180),
  contentType: z.enum(["news", "article"]),
  authorName: z.string().trim().min(2).max(120),
  body: z.string().trim().min(5).max(2000),
});

const querySchema = z.object({
  contentSlug: z.string().trim().min(1).max(180),
  contentType: z.enum(["news", "article"]),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const result = querySchema.safeParse({
    contentSlug: url.searchParams.get("contentSlug"),
    contentType: url.searchParams.get("contentType"),
  });
  if (!result.success) {
    return NextResponse.json({ error: "بيانات التعليقات غير مكتملة", issues: result.error.flatten() }, { status: 400 });
  }

  const comments = await listApprovedContentComments(result.data);
  return NextResponse.json(comments);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const result = schema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: "تأكد من الاسم والتعليق قبل الإرسال" }, { status: 400 });
  }

  try {
    const comment = await createContentComment(result.data);
    if (!comment.persisted && comment.message === "content_comment_not_created") {
      return NextResponse.json({ ...comment, error: "تعذر إنشاء سجل التعليق" }, { status: 502 });
    }
    if (!comment.persisted) {
      return NextResponse.json({ ...comment, error: "اتصال Supabase غير مكتمل، لا يمكن حفظ التعليق حالياً" }, { status: 503 });
    }
    return NextResponse.json({ ...comment, message: "تم استلام تعليقك وسيظهر بعد المراجعة" });
  } catch (error) {
    return NextResponse.json(routeErrorBody(error, "تعذر حفظ التعليق حالياً"), { status: 500 });
  }
}
