type ImageMatchProduct = {
  brand: string;
  modelEn: string;
  slug: string;
  imageFolder?: string;
};

const shoeViews = ["FRONT", "LEFT", "RIGHT", "REAR", "TOP", "SOLE"] as const;
type ShoeView = (typeof shoeViews)[number];

type ShoeFolder = {
  name: string;
  files: Partial<Record<ShoeView, string>>;
  storeImages?: string[];
};

const fullViews = {
  FRONT: "FRONT.png",
  LEFT: "LEFT.png",
  RIGHT: "RIGHT.png",
  REAR: "REAR.png",
  TOP: "TOP.png",
  SOLE: "SOLE.png"
} satisfies Record<ShoeView, string>;

export const approvedShoeFolders = [
  "ADIDAS ADZIRO",
  "AIR FORCE BLACK RED",
  "AIR FORCE WHITE LIMITED",
  "AIR FORCE WHITE MIRROR MOLTEN METAL",
  "AIR MAX 95 CORTZ",
  "AIR MAX 95 LIMITED WHITE",
  "AIR MAX 95 SAYNA",
  "AIR MAX 97",
  "AIR MAX 720",
  "AIR MAX 2021 SE",
  "ALEXANDER MCQUEEN",
  "ASICS",
  "B22",
  "BALENCIAGA TRACK",
  "BAPE",
  "JORDAN 4",
  "JORDAN 11",
  "JORDAN 13",
  "LV SKATE",
  "LV TRAINER",
  "NEW BALANCE 530",
  "NEW BALANCE 2000",
  "NEW BALANCE 9060",
  "NIKE SHOX",
  "NIKE SHOX SUPREME",
  "NIKE VM",
  "TN 1",
  "TN 3",
  "TRAVIS SB",
  "ADIDAS ADISTAR"
] as const;

const shoeFolders: ReadonlyArray<ShoeFolder> = [
  { name: "ADIDAS ADZIRO", files: { FRONT: "FRONT.png", LEFT: "LEFT.png", RIGHT: "RIGHT.png", TOP: "TOP.png" } },
  { name: "AIR FORCE BLACK RED", files: fullViews },
  { name: "AIR FORCE WHITE LIMITED", files: { FRONT: "FRONT.png", LEFT: "LEFT.png", RIGHT: "RIGHT.png", TOP: "TOP.png" } },
  { name: "AIR FORCE WHITE MIRROR MOLTEN METAL", files: fullViews },
  { name: "AIR MAX 95 CORTZ", files: { FRONT: "FRONT.png", LEFT: "LEFT.png", RIGHT: "RIGHT.png", TOP: "TOP.png" } },
  { name: "AIR MAX 95 LIMITED WHITE", files: { FRONT: "FRONT.png", LEFT: "LEFT.png", RIGHT: "RIGHT.png", TOP: "TOP.png" } },
  { name: "AIR MAX 95 SAYNA", files: { FRONT: "FRONT.png", LEFT: "LEFT.png", RIGHT: "RIGHT.png", TOP: "TOP.png" } },
  { name: "AIR MAX 97", files: fullViews },
  { name: "AIR MAX 720", files: { FRONT: "FRONT.png", LEFT: "LEFT.png", RIGHT: "RIGHT.png", REAR: "REAR.png", TOP: "TOP.png" } },
  { name: "AIR MAX 2021 SE", files: { FRONT: "FRONT.png", LEFT: "LEFT.png", RIGHT: "RIGHT.png", TOP: "TOP.png" } },
  { name: "ALEXANDER MCQUEEN", files: { FRONT: "FRONT.png", LEFT: "LEFT.png", RIGHT: "RIGHT.png", TOP: "TOP.png" } },
  { name: "ASICS", files: { FRONT: "FRONT.png", LEFT: "LEFT.png", RIGHT: "RIGHT.png", TOP: "TOP.png" } },
  { name: "B22", files: { FRONT: "FRONT.png", LEFT: "LEFT.png", RIGHT: "RIGHT.png", TOP: "TOP.png" } },
  { name: "BALENCIAGA TRACK", files: fullViews },
  { name: "BAPE", files: { FRONT: "FRONT.png", LEFT: "LEFT.png", RIGHT: "RIGHT.png", TOP: "TOP.png" } },
  { name: "JORDAN 4", files: fullViews },
  { name: "JORDAN 11", files: fullViews },
  { name: "JORDAN 13", files: { FRONT: "FRONT.png", LEFT: "LEFT.png", RIGHT: "RIGHT.png", REAR: "REAR.png", TOP: "TOP.png" } },
  { name: "LV SKATE", files: { FRONT: "FRONT.png", LEFT: "LEFT.png", RIGHT: "RIGHT.png", TOP: "TOP.png" } },
  { name: "LV TRAINER", files: { FRONT: "FRONT.png", LEFT: "LEFT.png", RIGHT: "RIGHT.png", REAR: "REAR.png", TOP: "TOP.png" } },
  { name: "NEW BALANCE 530", files: fullViews },
  { name: "NEW BALANCE 2000", files: { FRONT: "FRONT.png", LEFT: "LEFT.png", RIGHT: "RIGHT.png", REAR: "REAR.png", TOP: "TOP.png" } },
  { name: "NEW BALANCE 9060", files: { FRONT: "FRONT.png", LEFT: "LEFT.png", RIGHT: "RIGHT.png", REAR: "REAR.png", TOP: "TOP.png" } },
  { name: "NIKE SHOX", files: { FRONT: "FRONT.png", LEFT: "LEFT.png", RIGHT: "RIGHT.png", TOP: "TOP.png" } },
  { name: "NIKE SHOX SUPREME", files: { FRONT: "FRONT.png", LEFT: "LEFT.png", RIGHT: "RIGHT.png", TOP: "TOP.png" } },
  { name: "NIKE VM", files: fullViews },
  { name: "TN 1", files: { FRONT: "FRONT.png", LEFT: "LEFT.png", RIGHT: "RIGHT.png", TOP: "TOP.png" } },
  { name: "TN 3", files: { FRONT: "FRONT.png", LEFT: "LEFT.png", RIGHT: "RIGHT.png", TOP: "TOP.png" } },
  { name: "TRAVIS SB", files: { FRONT: "FRONT.png", LEFT: "LEFT.png", RIGHT: "RIGHT.png", TOP: "TOP.png" } },
  { name: "ADIDAS ADISTAR", files: { FRONT: "FRONT.png", LEFT: "LEFT.png", RIGHT: "RIGHT.png", TOP: "TOP.png" } }
];

const normalize = (value: string) =>
  value
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, " ")
    .replace(/\b(NIKE|NABKI|MIRROR|SNEAKER|STYLE|SHOE)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokens = (value: string) => normalize(value).split(" ").filter(Boolean);

const folderScore = (folder: string, product: ImageMatchProduct) => {
  const folderTokens = new Set(tokens(folder));
  const candidates = [
    product.imageFolder ?? "",
    product.modelEn,
    product.slug.replace(/-/g, " "),
    `${product.brand} ${product.modelEn}`
  ];

  return Math.max(
    ...candidates.map((candidate) => {
      const candidateTokens = tokens(candidate);
      if (!candidateTokens.length) return 0;
      const matched = candidateTokens.filter((token) => folderTokens.has(token)).length;
      return matched === candidateTokens.length ? matched : 0;
    })
  );
};

export function getApprovedShoeFolder(folderName: string) {
  return shoeFolders.find((folder) => folder.name === folderName);
}

export function buildShoeImagePaths(folder: ShoeFolder, fallback: string[] = ["/images/smsm-logo.png"]) {
const encodedFolder = folder.name; 
 const fallbackImage = fallback[0] ?? "/images/smsm-logo.png";
  const viewImages = shoeViews.flatMap((view) => {
    const file = folder.files[view];
    return file ? [`/images/SHOES/${encodedFolder}/${file}`] : [];
  });
  const storeImages = folder.storeImages?.map((file) => `/images/SHOES/${encodedFolder}/${file}`) ?? [];
  const images = [...viewImages, ...storeImages];
  return images.length ? images : [fallbackImage];
}

export function resolveProductImages(product: ImageMatchProduct, fallback: string[]) {
  const folder = product.imageFolder
    ? getApprovedShoeFolder(product.imageFolder)
    : shoeFolders
        .map((folderConfig) => ({ folderConfig, score: folderScore(folderConfig.name, product) }))
        .filter((match) => match.score > 0)
        .sort((a, b) => b.score - a.score)[0]?.folderConfig;

  if (!folder) {
    return fallback;
  }

  return buildShoeImagePaths(folder, fallback);
}
