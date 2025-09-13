-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT,
    "avatarUrl" TEXT,
    "role" TEXT NOT NULL,
    "studioId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_email_key" ON "user_profiles"("email");

-- CreateIndex
CREATE INDEX "user_profiles_email_idx" ON "user_profiles"("email");

-- CreateIndex
CREATE INDEX "user_profiles_role_idx" ON "user_profiles"("role");

-- CreateIndex
CREATE INDEX "user_profiles_studioId_idx" ON "user_profiles"("studioId");

-- AddForeignKey
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "studios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Enable RLS
ALTER TABLE "user_profiles" ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can insert their own profile" ON "user_profiles"
    FOR INSERT 
    WITH CHECK (auth.uid()::text = id);

CREATE POLICY "Users can read their own profile" ON "user_profiles"
    FOR SELECT 
    USING (auth.uid()::text = id);

CREATE POLICY "Users can update their own profile" ON "user_profiles"
    FOR UPDATE 
    USING (auth.uid()::text = id)
    WITH CHECK (auth.uid()::text = id);

CREATE POLICY "Super admins can do everything" ON "user_profiles"
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM "user_profiles" 
            WHERE id = auth.uid()::text 
            AND role = 'super_admin'
        )
    );
