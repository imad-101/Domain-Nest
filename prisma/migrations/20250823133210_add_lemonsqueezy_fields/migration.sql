/*
  Warnings:

  - A unique constraint covering the columns `[lemonsqueezy_customer_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lemonsqueezy_subscription_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN "lemonsqueezy_current_period_end" DATETIME;
ALTER TABLE "users" ADD COLUMN "lemonsqueezy_customer_id" TEXT;
ALTER TABLE "users" ADD COLUMN "lemonsqueezy_subscription_id" TEXT;
ALTER TABLE "users" ADD COLUMN "lemonsqueezy_variant_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_lemonsqueezy_customer_id_key" ON "users"("lemonsqueezy_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_lemonsqueezy_subscription_id_key" ON "users"("lemonsqueezy_subscription_id");
