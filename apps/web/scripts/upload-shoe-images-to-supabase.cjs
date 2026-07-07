const fs = require("node:fs/promises");
const path = require("node:path");
const { createClient } = require("@supabase/supabase-js");

const root = path.resolve(__dirname, "..");
const envPath = path.join(root, ".env.local");
const shoeRoot = path.join(root, "public", "images", "SHOES");
const bucketName = process.env.SUPABASE_PRODUCT_IMAGE_BUCKET || "product-images";

function parseEnv(content) {
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator === -1) continue;
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^[ '\"]|[ '\"]$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

function contentTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  return "application/octet-stream";
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }
  return files;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function uploadWithRetry(bucket, objectPath, data, options) {
  let lastError;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    const { error } = await bucket.upload(objectPath, data, options);
    if (!error) return;
    lastError = error;
    await sleep(attempt * 1500);
  }
  throw lastError;
}

async function main() {
  try {
    parseEnv(await fs.readFile(envPath, "utf8"));
  } catch {
    // Deployment environments can provide vars directly; local .env is optional.
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const { error: createBucketError } = await supabase.storage.createBucket(bucketName, {
    public: true,
    fileSizeLimit: "20MB"
  });
  if (createBucketError && !/already exists/i.test(createBucketError.message)) {
    throw createBucketError;
  }

  const files = await walk(shoeRoot);
  let uploaded = 0;

  for (const filePath of files) {
    const relativePath = path.relative(path.join(root, "public", "images"), filePath).split(path.sep).join("/");
    const data = await fs.readFile(filePath);
    try {
      await uploadWithRetry(supabase.storage.from(bucketName), relativePath, data, {
        upsert: true,
        contentType: contentTypeFor(filePath),
        cacheControl: "31536000"
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`${relativePath}: ${message}`);
    }
    uploaded += 1;
  }

  console.log(JSON.stringify({ bucketName, uploaded, publicBaseUrl: `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${bucketName}` }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
