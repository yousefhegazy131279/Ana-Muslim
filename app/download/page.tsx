import { PageHead } from "@/components/ui";
import { DownloadApp } from "@/components/download-app";
import release from "@/data/mobile-release.json";
import { pageMetadata } from '@/lib/seo';
import { PageData } from '@/components/structured-data';
const description = "القراءة دون إنترنت على أندرويد وiPhone والأجهزة الأخرى.";
export const metadata = pageMetadata("تنزيل تطبيق أنا مسلم", description, '/download');
export default function DownloadPage() {
  const android = release.android as {
    url: string;
    bytes: number;
    sha256: string;
  } | null;
  return (
    <>
      <PageData title="تنزيل تطبيق أنا مسلم" path="/download" description={description} />
      <PageHead
        label="أنا مسلم على جهازك"
        title="التطبيق والقراءة دون إنترنت"
        description="اختر طريقة التثبيت المناسبة لجهازك."
      />
      <DownloadApp />
      <section className="container content-section">
        <div className="download-instructions">
          <article className="content-card">
            <h2>أندرويد</h2>
            <ol>
              <li>نزّل ملف التطبيق من زر تنزيل أندرويد.</li>
              <li>
                افتح الملف واسمح لهذا المتصفح بتثبيت التطبيق عند طلب الهاتف.
              </li>
              <li>
                افتح أنا مسلم؛ المكتبة والصور مضمّنة وتعمل دون اتصال من أول
                تشغيل.
              </li>
              <li>
                من الإعدادات، فعّل تذكيرات القرآن والأحاديث والقصص واختر
                أوقاتها، ثم امنح صلاحية الإشعارات.
              </li>
            </ol>
            <p>
              قد تؤخر إعدادات توفير البطارية بعض التذكيرات. لا يحتاج التطبيق إلى
              حساب أو اشتراك.
            </p>
            {android && (
              <>
                <p>
                  الإصدار {release.version} · حجم التنزيل{" "}
                  {(android.bytes / 1024 / 1024).toFixed(1)} ميغابايت.
                </p>
                <details>
                  <summary>بصمة ملف التنزيل SHA-256</summary>
                  <code className="download-checksum" dir="ltr">
                    {android.sha256}
                  </code>
                </details>
              </>
            )}
          </article>
          <article className="content-card">
            <h2>iPhone وiPad</h2>
            <ol>
              <li>افتح نسخة iPhone في Safari.</li>
              <li>اضغط مشاركة، ثم «إضافة إلى الشاشة الرئيسية».</li>
              <li>
                افتح التطبيق من الأيقونة وأبقِ الإنترنت متصلًا حتى تظهر عبارة
                «المكتبة كاملة جاهزة دون إنترنت»؛ بعدها يمكنك قراءة جميع أقسام
                المكتبة والصور دون اتصال.
              </li>
            </ol>
            <p>
              هذه نسخة تُضاف للشاشة الرئيسية؛ لا تحتاج ملف IPA أو متجرًا.
              التذكيرات التلقائية دون إنترنت في الخلفية غير متاحة في هذه النسخة.
            </p>
            <p>
              يتطلب حفظ المكتبة نحو ٢٤ ميغابايت. إذا مسحت بيانات المواقع أو حذف
              النظام التخزين، افتح التطبيق متصلًا لإعادة حفظها.
            </p>
          </article>
          <article className="content-card">
            <h2>الكمبيوتر والأجهزة الأخرى</h2>
            <p>
              افتح النسخة نفسها وانتظر اكتمال حفظ المكتبة. يمكنك تثبيتها من
              قائمة المتصفح إذا كان يدعم التطبيقات، أو استعمالها مباشرة.
            </p>
            <p>
              تتضمن النسخة الحالية ١١٤ سورة مع التفسير، و٣٥٨٢ مادة حديثية
              مشروحة، و٢٥ قصة، والأذكار والأدعية. القراءة فقط؛ دون تلاوات صوتية.
            </p>
            <a className="button primary" href="/mobile/">
              فتح المكتبة على هذا الجهاز
            </a>
          </article>
        </div>
      </section>
    </>
  );
}
