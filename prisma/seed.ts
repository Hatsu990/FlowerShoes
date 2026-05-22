import { PrismaClient, ReservationStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existingCount = await prisma.reservation.count();
  if (existingCount > 0) {
    return;
  }

  await prisma.reservation.createMany({
    data: [
      {
        name: "김다은",
        phone: "010-1234-5678",
        date: "2026-05-25",
        time: "14:00",
        partySize: 2,
        memo: "창가 자리 요청",
        status: ReservationStatus.PENDING,
      },
      {
        name: "박선우",
        phone: "010-8765-4321",
        date: "2026-05-26",
        time: "11:30",
        partySize: 3,
        memo: "알레르기 재료 안내 필요",
        status: ReservationStatus.CONFIRMED,
      },
    ],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
