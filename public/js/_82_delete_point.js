function deletePoint(id) {
  db
    .collection("points")
    .doc(id)
    .delete()
    .then(() => {
    })
    .catch((error) => {
      showAlert('Нажалост, брисање није успело.')
      console.error("Error removing document: ", error);
    });
}
