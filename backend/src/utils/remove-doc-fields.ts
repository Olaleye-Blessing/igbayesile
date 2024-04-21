export const removeDocFields = <IDoc>({
  doc,
  keys,
}: {
  doc: IDoc;
  keys: (keyof IDoc)[];
}) => {
  keys.forEach((key) => {
    // @ts-expect-error ignore
    doc[key] = undefined;
  });

  return doc;
};
