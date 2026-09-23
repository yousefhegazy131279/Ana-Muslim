import Link from 'next/link';
export default function NotFound(){return <section className="not-found"><h1>٤٠٤</h1><h2>لم نجد هذه الصفحة</h2><p>يمكنك العودة للرئيسية أو متابعة القراءة من فهرس القرآن.</p><Link className="button primary" href="/">العودة للرئيسية</Link><Link className="button secondary" style={{marginRight:12}} href="/quran/">القرآن الكريم</Link></section>}
