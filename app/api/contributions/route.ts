import { NextResponse } from "next/server";
import { z } from "zod";
import { createContributionSubmission, getContributions, supabaseRuntimeState, uploadPublicSubmissionDocument } from "@/lib/supabase/mahabah";
import { localizedNumber } from "@/lib/validation/localized-number";
import { routeErrorBody } from "@/lib/api/route-errors";

const schema = z.object({
  fullName: z.string().trim().min(2).optional(),
  mobile: z.string().trim().min(5).optional(),
  email: z.string().trim().email().optional(),
  title: z.string().min(3),
  city: z.string().min(2),
  contributionType: z.string().min(2),
  capitalSar: z.preprocess(localizedNumber, z.number().positive()),
  durationMonths: z.preprocess(localizedNumber, z.number().int().positive()),
  description: z.string().min(10),
  offeringUrl: z.string().optional(),
});

const allowedMimeTypes = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);

function validUploadedFiles(form: FormData) {
  const files = form.getAll("files").filter((value): value is File => value instanceof File && value.size > 0);
  const invalid = files.find((file) => file.size > 10 * 1024 * 1024 || (file.type && !allowedMimeTypes.has(file.type)));
  return { files, invalid };
}

export async function GET() {
  const result = await getContributions();
  return NextResponse.json({ data: result.data, source: result.source, supabase: supabaseRuntimeState() });
}

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "تعذر قراءة بيانات المساهمة العقارية" }, { status: 400 });
  const result = schema.safeParse(Object.fromEntries(form.entries()));
  if (!result.success) {
    return NextResponse.json({ error: "الرجاء استكمال بيانات المساهمة العقارية", issues: result.error.flatten() }, { status: 400 });
  }
  const { files, invalid } = validUploadedFiles(form);
  if (invalid) {
    return NextResponse.json({ error: "نوع المرفق غير مدعوم أو يتجاوز 10MB" }, { status: 400 });
  }

  try {
    const submission = await createContributionSubmission(result.data);
    if (!submission.persisted && submission.message === "contribution_not_created") {
      return NextResponse.json({ ...submission, error: "تعذر إنشاء سجل المساهمة العقارية" }, { status: 502 });
    }
    if (!submission.persisted) {
      return NextResponse.json({ ...submission, error: "اتصال Supabase غير مكتمل، لا يمكن حفظ المساهمة العقارية حالياً" }, { status: 503 });
    }
    if (submission.id && files.length > 0) {
      const uploads = await Promise.all(files.map((file) => uploadPublicSubmissionDocument({
        entityType: "contribution_submission",
        entityId: submission.id,
        label: "مرفق مساهمة عقارية",
        file,
      })));
      if (uploads.some((upload) => !upload.persisted)) {
        return NextResponse.json({ ...submission, error: "تم حفظ المساهمة، لكن تعذر ربط بعض المرفقات في Supabase" }, { status: 502 });
      }
    }
    return NextResponse.json({ ...submission, message: "تم إرسال طلب المساهمة العقارية" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(routeErrorBody(error, "تعذر حفظ المساهمة العقارية في قاعدة البيانات"), { status: 500 });
  }
}
