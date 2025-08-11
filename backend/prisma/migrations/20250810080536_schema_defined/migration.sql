-- CreateTable
CREATE TABLE "public"."Seller" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "public"."Business" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "sellTime" INTEGER NOT NULL,
    "sellerId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "public"."Buyer" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "public"."Interest" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "budget" INTEGER NOT NULL,
    "buyTime" INTEGER NOT NULL,
    "buyerId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Seller_id_key" ON "public"."Seller"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Seller_email_key" ON "public"."Seller"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Business_id_key" ON "public"."Business"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Buyer_id_key" ON "public"."Buyer"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Buyer_email_key" ON "public"."Buyer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Interest_id_key" ON "public"."Interest"("id");

-- AddForeignKey
ALTER TABLE "public"."Business" ADD CONSTRAINT "Business_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "public"."Seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Interest" ADD CONSTRAINT "Interest_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "public"."Buyer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
