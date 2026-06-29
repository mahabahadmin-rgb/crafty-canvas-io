import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRequest, uploadPublicSubmissionDocument } from "@/lib/supabase/mahabah";
import { localizedNumber } from "@/lib/validation/localized-number";
import { routeErrorBody } from "@/lib/api/route-errors";

const schema = z.object({
  fullName: z.string().min(2),
  mobile: z.string().min(8),
  email: z.string().email(),
  city: z.string().min(2),
  assetType: z.string().min(2),
  area: z.preprocess(localizedNumber, z.number().positive()),
  serviceType: z.string().min(2),
  description: z.string().min(10),
  intent: z.string().optional(),
});

const allowedMimeTypes = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);

function validUploadedFiles(form: FormData) {
  const files = form.getAll("files").filter((value): value is File => value instanceof File && value.size > 0);
  const invalid = files.find((file) => file.size > 10 * 1024 * 1024 || (file.type && !allowedMimeTypes.has(file.type)));
  return { files, invalid };
}

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "تعذر قراءة بيانات طلب الدراسة" }, { status: 400 });
  const result = schema.safeParse(Object.fromEntries(form.entries()));
  if (!result.success) return NextResponse.json({ error: "الرجاء استكمال بيانات طلب الدراسة", issues: result.error.flatten() }, { status: 400 });
  const { files, invalid } = validUploadedFiles(form);
  if (invalid) return NextResponse.json({ error: "نوع المرفق غير مدعوم أو يتجاوز 10MB" }, { status: 400 });

  try {
    const serviceRequest = await createServiceRequest({
      title: result.data.fullName,
      mobile: result.data.mobile,
      email: result.data.email,
      city: result.data.city,
      assetType: result.data.assetType,
      area: result.data.area,
      serviceType: result.data.serviceType,
      description: result.data.description,
      intent: result.data.intent,
    });
    if (!serviceRequest.persisted && serviceRequest.message === "service_request_not_created") {
      return NextResponse.json({ ...serviceRequest, error: "تعذر إنشاء سجل طلب الدراسة" }, { status: 502 });
    }
    if (!serviceRequest.persisted) {
      return NextResponse.json({ ...serviceRequest, error: "اتصال Supabase غير مكتمل، لا يمكن حفظ طلب الدراسة حالياً" }, { status: 503 });
    }
    if (serviceRequest.id && files.length > 0) {
      const uploads = await Promise.all(files.map((file) => uploadPublicSubmissionDocument({
        entityType: "service_request",
        entityId: serviceRequest.id,
        label: "مرفق طلب خدمة",
        file,
      })));
      if (uploads.some((upload) => !upload.persisted)) {
        return NextResponse.json({ ...serviceRequest, error: "تم حفظ الطلب، لكن تعذر ربط بعض المرفقات في Supabase" }, { status: 502 });
      }
    }
    return NextResponse.json({
      ...serviceRequest,
      message: serviceRequest.status === "draft" ? "تم حفظ طلب الدراسة كمسودة" : "تم استلام طلب الدراسة بنجاح",
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(routeErrorBody(error, "تعذر حفظ طلب الدراسة في قاعدة البيانات"), { status: 500 });
  }
}
