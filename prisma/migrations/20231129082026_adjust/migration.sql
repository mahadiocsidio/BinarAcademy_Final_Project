/*
  Warnings:

  - A unique constraint covering the columns `[account_id]` on the table `Otp` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "nama" DROP NOT NULL,
ALTER COLUMN "no_telp" DROP NOT NULL,
ALTER COLUMN "negara" DROP NOT NULL,
ALTER COLUMN "kota" DROP NOT NULL,
ALTER COLUMN "role" DROP NOT NULL,
ALTER COLUMN "url_image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Course" ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "deskripsi" DROP NOT NULL,
ALTER COLUMN "url_image_preview" DROP NOT NULL,
ALTER COLUMN "url_gc_tele" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Kategori" ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "deskripsi" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Mentor" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "job" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Notifikasi" ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "deskripsi" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Otp" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "otp" DROP NOT NULL,
ALTER COLUMN "otp" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Promo" ALTER COLUMN "deskripsi" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Rating" ALTER COLUMN "skor" DROP NOT NULL,
ALTER COLUMN "comment" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Riwayat_Transaksi" ALTER COLUMN "status" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Video" ALTER COLUMN "deskripsi" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Otp_account_id_key" ON "Otp"("account_id");
