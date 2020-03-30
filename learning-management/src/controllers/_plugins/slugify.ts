export function slugify(text: string, prefix: string|null = null) {
  let slug = text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text

  if (prefix === 'random') {
    slug = slug + '-' + getRndInteger(10000, 99999);
  } else if (prefix) {
    slug = slug + '-' + prefix;
  }

  return slug;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}
