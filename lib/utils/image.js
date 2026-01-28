export function getCloudinaryUrl(publicId, transformations = {}) {
  const {
    width = 600,
    height = 400,
    quality = "auto",
    format = "auto",
    crop = "fill",
  } = transformations;

  const baseUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

  const params = [
    `w_${width}`,
    `h_${height}`,
    `c_${crop}`,
    `q_${quality}`,
    `f_${format}`,
  ].join(",");

  return `${baseUrl}/${params}/${publicId}`;
}

export function extractCloudinaryPublicId(url) {
  if (!url || !url.includes("cloudinary.com")) return null;

  const parts = url.split("/upload/");
  if (parts.length !== 2) return null;

  const pathParts = parts[1].split("/");
  return pathParts
    .slice(1)
    .join("/")
    .replace(/\.(jpg|jpeg|png|webp)$/, "");
}

export function getOptimizedImageUrl(imageUrl, width = 600, height = 400) {
  if (!imageUrl) {
    return "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&q=80";
  }

  if (imageUrl.includes("cloudinary.com")) {
    const publicId = extractCloudinaryPublicId(imageUrl);
    if (publicId) {
      return getCloudinaryUrl(publicId, { width, height });
    }
  }

  return imageUrl;
}
