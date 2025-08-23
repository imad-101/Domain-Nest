/*
  Warnings:

  - You are about to drop the column `ssl_expires_at` on the `domains` table. All the data in the column will be lost.
  - You are about to drop the column `ssl_issuer` on the `domains` table. All the data in the column will be lost.
  - You are about to drop the column `ssl_status` on the `domains` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_domains" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "domainName" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registrar" TEXT,
    "nameservers" TEXT,
    "last_ssl_check" DATETIME,
    "is_monitored" BOOLEAN NOT NULL DEFAULT true,
    "last_uptime" REAL,
    "health_score" REAL,
    "last_health_check" DATETIME,
    CONSTRAINT "domains_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_domains" ("created_at", "domainName", "expiresAt", "health_score", "id", "is_monitored", "last_health_check", "last_ssl_check", "last_uptime", "provider", "userId") SELECT "created_at", "domainName", "expiresAt", "health_score", "id", "is_monitored", "last_health_check", "last_ssl_check", "last_uptime", "provider", "userId" FROM "domains";
DROP TABLE "domains";
ALTER TABLE "new_domains" RENAME TO "domains";
CREATE INDEX "domains_userId_idx" ON "domains"("userId");
CREATE UNIQUE INDEX "domains_userId_domainName_key" ON "domains"("userId", "domainName");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
