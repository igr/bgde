function storeNewPoint(emotionId, name, description, userId, lat, lng) {
  return db
    .collection('points')
    .add({
      a: false,
      d: description,
      e: emotionId,
      n: name,
      u: userId,
      x: new firebase.firestore.GeoPoint(lat, lng),
      t: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .catch(function (error) {
      showAlert('Нажалост, записивање није успело.')
      console.error('Error writing to database', error);
    });
}

function updatePoint(uid, data) {
  return db
    .collection('points')
    .doc(uid)
    .update({
      d: data.d,
      e: data.e,
      n: data.name,
      t: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .catch(function (error) {
      showAlert('Нажалост, измена није успела.')
      console.error('Error writing to database', error);
    });
}


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
