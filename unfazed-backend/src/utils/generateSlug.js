/**
 * Generates a clean URL-friendly slug from a therapist's name.
 * Example: "Dr. Ananya Sharma" -> "dr-ananya-sharma"
 */
function generateSlug(name) {
  if (!name) return 'therapist-' + Math.floor(1000 + Math.random() * 9000);
  
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-alphanumeric except space and hyphen
    .replace(/[\s_-]+/g, '-')  // replace spaces and underscores with single hyphen
    .replace(/^-+|-+$/g, '');  // trim leading/trailing hyphens
}

module.exports = generateSlug;
