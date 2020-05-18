
function showPointDialog(id, data) {
  detach('#point');

  const dialog = render('#_point', {data, theUser}).attach('body');

  _('.close', dialog).addEventListener('click', () => {
    closePointDialog(dialog);
  });
  _('button', dialog).addEventListener('click', () => {
    closePointDialog(dialog);
  });
  _('#deletePoint', dialog).addEventListener('click', () => {
    closePointDialog(dialog);
    deletePoint(id);
  });

  onEscapeKey(() => {closePointDialog(dialog);});
}

function closePointDialog(dialog) {
  detach(dialog);
  onEscapeKey(() => {});
}
