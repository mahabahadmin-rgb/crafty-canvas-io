import { NextResponse } from "next/server";
import { z } from "zod";
import { createAssetSubmission, getAssets, supabaseRuntimeState, uploadPublicSubmissionDocument } from "@/lib/supabase/mahabah";
import { localizedNumber } from "@/lib/validation/localized-number";
import { routeErrorBody } from "@/lib/api/route-errors";

const schema = z.object({
  fullName: z.string().min(2),
  mobile: z.string().min(8),
  email: z.string().email(),
  city: z.string().min(2),
  district: z.string().optional(),
  assetType: z.string().min(2),
  area: z.preprocess(localizedNumber, z.number().positive()),
  deedNumber: z.string().optional(),
  deedDate: z.string().optional(),
  assetName: z.string().optional(),
  description: z.string().min(10),
  mapUrl: z.string().optional(),
  intent: z.string().optional(),
});

const allowedMimeTypes = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);

function validUploadedFiles(form: FormData) {
  const files = form.getAll("files").filter((value): value is File => value instanceof File && value.size > 0);
  const invalid = files.find((file) => file.size > 10 * 1024 * 1024 || (file.type && !allowedMimeTypes.has(file.type)));
  return { files, invalid };
}

export async function GET() {
  const result = await getAssets();
  return NextResponse.json({ data: result.data, source: result.source, supabase: supabaseRuntimeState() });
}

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "تعذر قراءة بيانات الأصل العقاري" }, { status: 400 });
  const result = schema.safeParse(Object.fromEntries(form.entries()));
  if (!result.success) {
    return NextResponse.json({ error: "الرجاء استكمال البيانات المطلوبة بشكل صحيح", issues: result.error.flatten() }, { status: 400 });
  }
  const { files, invalid } = validUploadedFiles(form);
  if (invalid) {
    return NextResponse.json({ error: "نوع المرفق غير مدعوم أو يتجاوز 10MB" }, { status: 400 });
  }

  try {
    const submission = await createAssetSubmission(result.data);
    if (!submission.persisted && submission.message === "asset_not_created") {
      return NextResponse.json({ ...submission, error: "تعذر إنشاء سجل الأصل العقاري" }, { status: 502 });
    }
    if (!submission.persisted) {
      return NextResponse.json({ ...submission, error: "اتصال Supabase غير مكتمل، لا يمكن حفظ الأصل العقاري حالياً" }, { status: 503 });
    }
    if (submission.id && files.length > 0) {
      const uploads = await Promise.all(files.map((file) => uploadPublicSubmissionDocument({
        entityType: "asset_submission",
        entityId: submission.id,
        label: "مرفق أصل عقاري",
        file,
      })));
      if (uploads.some((upload) => !upload.persisted)) {
        return NextResponse.json({ ...submission, error: "تم حفظ الأصل، لكن تعذر ربط بعض المرفقات في Supabase" }, { status: 502 });
      }
    }
    return NextResponse.json({ ...submission, message: "تم استلام الأصل العقاري بنجاح" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(routeErrorBody(error, "تعذر حفظ الأصل العقاري في قاعدة البيانات"), { status: 500 });
  }
}
