import Link from "next/link";
import { Smartphone, Download, BookOpen, WifiOff, Bell } from "lucide-react";
import release from "@/data/mobile-release.json";
export function DownloadApp() {
  const android = release.android as {
    url: string;
    bytes: number;
    sha256: string;
  } | null;
  return (
    <section className="section" id="download-app">
      <div className="container">
        <div className="download-app-card">
          <div>
            <span className="eyebrow">
              <Smartphone size={18} />
              رفيقك أينما كنت
            </span>
            <h2>أنا مسلم على هاتفك، دون إنترنت</h2>
            <p>
              القرآن والتفسير، والأحاديث وشروحها، وقصص الأنبياء، والأذكار
              والأدعية؛ مكتبة ترافقك على جهازك.
            </p>
            <div className="download-app-features">
              <span>
                <BookOpen size={16} />
                المحتوى والصور محفوظة
              </span>
              <span>
                <WifiOff size={16} />
                قراءة دون اتصال
              </span>
              <span>
                <Bell size={16} />
                تذكيرات محلية في أندرويد
              </span>
            </div>
            <div className="download-app-actions">
              {android ? (
                <a className="button primary" href={android.url} download>
                  <Download size={18} />
                  تنزيل تطبيق أندرويد
                </a>
              ) : (
                <span className="button secondary" aria-disabled="true">
                  تطبيق أندرويد قيد التجهيز
                </span>
              )}
              <a className="button secondary" href={release.web}>
                فتح نسخة iPhone والأجهزة الأخرى
              </a>
              <Link className="text-link" href="/download/">
                طريقة التثبيت
              </Link>
            </div>
            <small>
              في iPhone: تُحفظ المكتبة أول مرة، ثم تُضاف للشاشة الرئيسية.
              إشعارات الخلفية دون إنترنت متاحة في تطبيق أندرويد.
            </small>
          </div>
          <div className="download-app-mark" aria-hidden="true">
            <Smartphone size={100} strokeWidth={1} />
            <span>أنا مسلم</span>
            <small>إيمان يرافق يومك</small>
          </div>
        </div>
      </div>
    </section>
  );
}
