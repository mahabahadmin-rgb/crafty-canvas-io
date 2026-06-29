import type { Metadata } from "next";
import { FormPage } from "@/components/sections/form-page";
export const metadata: Metadata = { title: "إضافة أصل عقاري", description: "نموذج إضافة أصل عقاري للدراسة والتأهيل." };
export default function SubmitAssetPage() { return <FormPage mode="submit" />; }
