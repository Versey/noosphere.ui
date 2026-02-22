export function createNodeProperty(id, text = 'new property') {
  return {
    id,
    text
  };
}

export function reorderNodeProperties(properties, fromId, toId) {
  if (fromId === toId) {
    return properties;
  }

  const sourceIndex = properties.findIndex((property) => property.id === fromId);
  const targetIndex = properties.findIndex((property) => property.id === toId);

  if (sourceIndex < 0 || targetIndex < 0) {
    return properties;
  }

  const next = [...properties];
  const [moved] = next.splice(sourceIndex, 1);
  next.splice(targetIndex, 0, moved);
  return next;
}
