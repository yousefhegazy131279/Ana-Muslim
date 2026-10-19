export function qiblaBearing(latitude: number, longitude: number): number {
  if (!Number.isFinite(latitude) || Math.abs(latitude) > 90 || !Number.isFinite(longitude) || Math.abs(longitude) > 180) throw new Error('أدخل إحداثيات صحيحة: خط العرض بين −٩٠ و٩٠ وخط الطول بين −١٨٠ و١٨٠.');
  if (Math.abs(latitude - 21.4225) < 0.00001 && Math.abs(longitude - 39.8262) < 0.00001) throw new Error('أنت عند موضع الكعبة تقريبًا؛ لا يمكن تحديد اتجاه واحد من هذه الإحداثيات.');
  const rad = Math.PI / 180; const p1 = latitude * rad; const p2 = 21.4225 * rad; const delta = (39.8262 - longitude) * rad;
  const bearing = Math.atan2(Math.sin(delta) * Math.cos(p2), Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(delta)) / rad;
  return (bearing + 360) % 360;
}
