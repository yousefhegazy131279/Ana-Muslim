import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import { read, save } from "./storage";
export const reminderTypes = [
  {
    id: 101,
    title: "موعد وردك من القرآن",
    body: "لحظات مع القرآن وتفسيره تُضيء يومك.",
    route: "/quran",
    time: "08:00",
  },
  {
    id: 102,
    title: "اقرأ حديثًا وتدبّر معناه",
    body: "افتح الأحاديث النبوية واقرأ شرح حديث اليوم.",
    route: "/hadith",
    time: "17:00",
  },
  {
    id: 103,
    title: "رحلة في قصص الأنبياء",
    body: "تابع فصلًا من قصة نبي مع الأدلة والتفسير.",
    route: "/stories",
    time: "20:00",
  },
];
export type Reminders = { enabled: boolean; times: string[] };
export function reminderSettings(): Reminders {
  return read("reminders", {
    enabled: false,
    times: reminderTypes.map((r) => r.time),
  });
}
export async function setReminders(settings: Reminders) {
  if (!Capacitor.isNativePlatform())
    throw Error(
      "التذكيرات التلقائية دون إنترنت متاحة في التطبيق الأصلي. نسخة الشاشة الرئيسية لا تضمن إشعارات في الخلفية دون اتصال.",
    );
  if (settings.enabled) {
    const permission = await LocalNotifications.requestPermissions();
    if (permission.display !== "granted")
      throw Error(
        "لم تُمنح صلاحية الإشعارات. يمكنك تفعيلها من إعدادات الهاتف.",
      );
  }
  const old = reminderSettings();
  const schedule = async (times: string[]) =>
    LocalNotifications.schedule({
      notifications: reminderTypes.map((r, i) => {
        const [hour, minute] = times[i].split(":").map(Number);
        if (
          !Number.isInteger(hour) ||
          hour < 0 ||
          hour > 23 ||
          !Number.isInteger(minute) ||
          minute < 0 ||
          minute > 59
        )
          throw Error("اختر وقتًا صحيحًا.");
        return {
          id: r.id,
          title: r.title,
          body: r.body,
          schedule: { on: { hour, minute }, repeats: true },
          extra: { route: r.route },
          channelId: "reading-reminders",
        };
      }),
    });
  await LocalNotifications.cancel({
    notifications: reminderTypes.map((r) => ({ id: r.id })),
  });
  try {
    if (settings.enabled) {
      if (Capacitor.getPlatform() === "android")
        await LocalNotifications.createChannel({
          id: "reading-reminders",
          name: "تذكيرات القراءة",
          description: "ورد القرآن والأحاديث وقصص الأنبياء",
          importance: 3,
        });
      await schedule(settings.times);
    }
    save("reminders", settings);
  } catch (e) {
    if (old.enabled) await schedule(old.times).catch(() => undefined);
    throw e;
  }
}
export async function attachNotificationNavigation() {
  if (!Capacitor.isNativePlatform()) return;
  await LocalNotifications.addListener(
    "localNotificationActionPerformed",
    (event) => {
      const route = event.notification.extra?.route;
      if (["/quran", "/hadith", "/stories"].includes(route))
        location.hash = route;
    },
  );
}
