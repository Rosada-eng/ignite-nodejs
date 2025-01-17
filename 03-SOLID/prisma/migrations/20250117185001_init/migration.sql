-- CreateTable
CREATE TABLE "Pet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "energy_level" INTEGER NOT NULL,
    "independence_level" INTEGER NOT NULL,
    "space_for_living" INTEGER NOT NULL,
    "ngo_id" TEXT NOT NULL,
    "adopted_at" TIMESTAMP(3),
    "requirements" TEXT[],

    CONSTRAINT "Pet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NGO" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "zipcode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "NGO_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_ngo_id_fkey" FOREIGN KEY ("ngo_id") REFERENCES "NGO"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
