export default function appendNewToName(name: string, fileFormat?: string) {
  let insertPos = name.indexOf(".");
  let newName = name
    .substring(0, insertPos)
    .concat("-new", name.substring(insertPos))
  ;
  if (fileFormat) {
    newName = newName.replace(newName.slice(-3), fileFormat);
  }
  return newName;
}
