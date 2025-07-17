
ALTER TABLE "posts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;

CREATE TABLE "profiles" (
  "id" UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  "is_premium" BOOLEAN NOT NULL DEFAULT FALSE,
  "stripe_customer_id" TEXT,
  "stripe_subscription_id" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY ("id")
);

CREATE TABLE "posts" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "visibility" TEXT NOT NULL DEFAULT 'free', -- 'free' or 'premium'
  "cover_image" TEXT,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY ("id")
);


INSERT INTO storage.buckets (id, name) VALUES ('post_images', 'post_images');

CREATE POLICY "Allow public read access to free posts" ON "posts"
  FOR SELECT USING (visibility = 'free');

CREATE POLICY "Allow premium read access to premium posts" ON "posts"
  FOR SELECT USING (visibility = 'premium' AND auth.uid() IN (
    SELECT id FROM profiles WHERE is_premium = TRUE
  ));

CREATE POLICY "Allow users to create their own posts" ON "posts"
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own posts" ON "posts"
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own posts" ON "posts"
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Allow users to read their own profile" ON "profiles"
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile" ON "profiles"
  FOR UPDATE USING (auth.uid() = id);