export default function appendNewToName(name: string, fileFormat?: string) {
  let newName;
  try {
    let insertPos = name.indexOf(".");
     newName= name
      .substring(0, insertPos)
      .concat("-new", name.substring(insertPos))
    ;
    if (fileFormat) {
      newName = newName.replace(newName.slice(-3), fileFormat);
    }
  } catch (e) {
    newName = `download.${fileFormat}`
  }

  return newName;
}
