function showAlert(message) {
  detach("#alert");
  render('#_alert', { message }).attach('body');
}
