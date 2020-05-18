
function showPointDialog(id, data) {
  detach('#point');

  const dialog = render('#_point', {data}).attach('body');

  _('.close', dialog).addEventListener('click', () => {
    closePointDialog(dialog);
  });
  _('button', dialog).addEventListener('click', () => {
    closePointDialog(dialog);
  });

  onEscapeKey(() => {closePointDialog(dialog);});
}

function closePointDialog(dialog) {
  detach(dialog);
  onEscapeKey(() => {});
}
