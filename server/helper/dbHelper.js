export function filterPrivateData(data, filter = []) {
  return data
}
export function exclude(attr = []) {
  return { exclude: ['_created', '_updated', '_deleted'] }
}