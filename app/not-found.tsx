import { ButtonLink } from "@/components/ui/button-link";

export default function NotFound() {
  return (
    <section className="section-y">
      <div className="container-page max-w-xl text-center">
        <div className="card-shell rounded-[30px] p-10">
          <p className="font-display text-7xl font-extrabold text-gold">404</p>
          <h1 className="mt-4 font-display text-3xl font-bold text-navy">الصفحة غير موجودة</h1>
          <p className="mt-4 leading-8 text-muted">قد يكون الرابط تغير أو أن المحتوى غير متاح حاليًا.</p>
          <div className="mt-7"><ButtonLink href="/" variant="dark">العودة للرئيسية</ButtonLink></div>
        </div>
      </div>
    </section>
  );
}
